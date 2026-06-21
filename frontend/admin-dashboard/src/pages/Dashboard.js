import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import io from 'socket.io-client';

const ALERT_URL   = 'https://redesigned-chainsaw-wv7x54jxqr5cgxvr-3003.app.github.dev';
const TRACK_URL   = 'https://redesigned-chainsaw-wv7x54jxqr5cgxvr-3004.app.github.dev';
const TOURIST_URL = 'https://redesigned-chainsaw-wv7x54jxqr5cgxvr-3002.app.github.dev';

export default function Dashboard() {
  const [tourists,  setTourists]  = useState([]);
  const [alerts,    setAlerts]    = useState([]);
  const [zones,     setZones]     = useState([]);
  const [stats,     setStats]     = useState({
    total: 0, safe: 0, atRisk: 0, critical: 0
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();

    // Socket connection for real-time alerts
    const socket = io(ALERT_URL);
    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 19)]);
    });

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => {
      socket.close();
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [alertRes, zoneRes, touristRes] = await Promise.all([
        axios.get(`${ALERT_URL}/api/alerts?limit=10`),
        axios.get(`${TRACK_URL}/api/tracking/zones/all`),
        axios.get(`${TOURIST_URL}/api/tourists/all`),
      ]);

      setAlerts(alertRes.data.alerts   || []);
      setZones(zoneRes.data.zones      || []);
      setTourists(touristRes.data.tourists || []);
      updateStats(touristRes.data.tourists || []);

    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  const updateStats = (list) => {
    setStats({
      total:    list.length,
      safe:     list.filter(t => (t.safetyScore?.score || 100) >= 80).length,
      atRisk:   list.filter(t => {
        const s = t.safetyScore?.score || 100;
        return s >= 40 && s < 80;
      }).length,
      critical: list.filter(t => (t.safetyScore?.score || 100) < 40).length,
    });
  };

  const getColor = (score = 100) => {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const getZoneColor = (level) => {
    if (level === 'restricted') return 'red';
    if (level === 'high')       return 'orange';
    return 'yellow';
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      await axios.put(
        `${ALERT_URL}/api/alerts/${alertId}/acknowledge`,
        { officerName: user.name || 'Officer' }
      );
      setAlerts(prev => prev.map(a =>
        a.alertId === alertId
          ? { ...a, status: 'ACKNOWLEDGED' }
          : a
      ));
    } catch (err) {
      alert('Failed to acknowledge');
    }
  };

  const generateFIR = async (alertId) => {
    try {
      const res = await axios.post(
        `${ALERT_URL}/api/alerts/${alertId}/fir`
      );
      alert(`✅ FIR Generated!\nFIR Number: ${res.data.firNumber}`);
    } catch (err) {
      alert('Failed to generate FIR');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={styles.container}>

      {/* ── Header ─────────────────────────────────── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            🛡️ Tourist Safety Command Center
          </h1>
          <p style={styles.headerSub}>
            Northeast India • Real-time Monitoring
          </p>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.welcomeText}>
            👮 {user.name || 'Officer'}
          </span>
          <button
            style={styles.navBtn}
            onClick={() => window.location.href = '/tourists'}
          >
            👥 Tourists
          </button>
          <button
            style={styles.navBtn}
            onClick={() => window.location.href = '/alerts'}
          >
            🚨 Alerts
          </button>
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────── */}
      <div style={styles.statsRow}>
        {[
          { label: 'Total Tourists', value: stats.total,    icon: '👥', color: '#3B82F6' },
          { label: 'Safe',           value: stats.safe,     icon: '✅', color: '#22C55E' },
          { label: 'At Risk',        value: stats.atRisk,   icon: '⚠️', color: '#F97316' },
          { label: 'Critical',       value: stats.critical, icon: '🚨', color: '#EF4444' },
        ].map((stat, i) => (
          <div key={i} style={{
            ...styles.statCard,
            borderTop: `4px solid ${stat.color}`
          }}>
            <span style={{ fontSize: '32px' }}>{stat.icon}</span>
            <span style={styles.statValue}>{stat.value}</span>
            <span style={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Map + Alerts ─────────────────────────────── */}
      <div style={styles.mainRow}>

        {/* Map */}
        <div style={styles.mapCard}>
          <h3 style={styles.cardTitle}>
            📍 Live Tourist Locations & Risk Zones
          </h3>
          <MapContainer
            center={[25.5, 91.8]}
            zoom={7}
            style={{ height: '450px', borderRadius: '12px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />

            {/* Risk Zones */}
            {zones.map((zone, i) => (
              <Circle
                key={i}
                center={[zone.center.lat, zone.center.lng]}
                radius={zone.radius * 1000}
                pathOptions={{
                  color:       getZoneColor(zone.riskLevel),
                  fillOpacity: 0.2,
                  weight:      2,
                }}
              >
                <Popup>
                  <b>{zone.name}</b><br />
                  Risk: {zone.riskLevel?.toUpperCase()}<br />
                  {zone.description}
                </Popup>
              </Circle>
            ))}

            {/* Tourist Markers */}
            {tourists.map((t, i) => (
              t.currentLocation?.lat && (
                <CircleMarker
                  key={i}
                  center={[
                    t.currentLocation.lat,
                    t.currentLocation.lng
                  ]}
                  radius={10}
                  pathOptions={{
                    color:       getColor(t.safetyScore?.score),
                    fillColor:   getColor(t.safetyScore?.score),
                    fillOpacity: 0.9,
                  }}
                >
                  <Popup>
                    <b>👤 {t.name}</b><br />
                    📱 {t.phone}<br />
                    🔒 Score: {t.safetyScore?.score || 100}<br />
                    🏷️ {t.safetyScore?.label || 'SAFE'}
                  </Popup>
                </CircleMarker>
              )
            ))}
          </MapContainer>
        </div>

        {/* Alert Panel */}
        <div style={styles.alertCard}>
          <h3 style={styles.cardTitle}>
            🚨 Live Alerts
            {alerts.filter(a => a.status === 'ACTIVE').length > 0 && (
              <span style={styles.badge}>
                {alerts.filter(a => a.status === 'ACTIVE').length}
              </span>
            )}
          </h3>

          <div style={styles.alertList}>
            {alerts.length === 0 ? (
              <div style={styles.noAlerts}>
                ✅ No active alerts
              </div>
            ) : (
              alerts.map((alert, i) => (
                <div key={i} style={{
                  ...styles.alertItem,
                  borderLeft: `4px solid ${
                    alert.severity === 'CRITICAL' ? '#EF4444' :
                    alert.severity === 'HIGH'     ? '#F97316' : '#F59E0B'
                  }`
                }}>
                  <div style={styles.alertTop}>
                    <span style={styles.alertType}>
                      {alert.alertType === 'PANIC'     ? '🚨 PANIC' :
                       alert.alertType === 'GEO_FENCE' ? '⚠️ GEO FENCE' :
                       '📍 ' + alert.alertType}
                    </span>
                    <span style={styles.alertTime}>
                      {new Date(
                        alert.createdAt || alert.timestamp
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <p style={styles.alertName}>
                    👤 {alert.tourist?.name || 'Unknown'}
                  </p>
                  <p style={styles.alertLoc}>
                    📍 {alert.location?.address ||
                        `${alert.location?.lat?.toFixed(3)},
                         ${alert.location?.lng?.toFixed(3)}`}
                  </p>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      alert.status === 'ACTIVE'       ? '#DC2626' :
                      alert.status === 'ACKNOWLEDGED' ? '#D97706' : '#16A34A'
                  }}>
                    {alert.status}
                  </span>
                  <div style={styles.alertBtns}>
                    {alert.status === 'ACTIVE' && (
                      <button
                        style={styles.ackBtn}
                        onClick={() => acknowledgeAlert(alert.alertId)}
                      >
                        ✓ Acknowledge
                      </button>
                    )}
                    {!alert.firNumber && (
                      <button
                        style={styles.firBtn}
                        onClick={() => generateFIR(alert.alertId)}
                      >
                        📄 Generate FIR
                      </button>
                    )}
                    {alert.firNumber && (
                      <span style={styles.firNumber}>
                        FIR: {alert.firNumber}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0F172A',
    minHeight:       '100vh',
    padding:         '24px',
    fontFamily:      'Arial, sans-serif',
  },
  header: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   '24px',
  },
  headerTitle: {
    color:      '#F8FAFC',
    margin:     '0 0 4px',
    fontSize:   '24px',
    fontWeight: 'bold',
  },
  headerSub: {
    color:    '#94A3B8',
    margin:   '0',
    fontSize: '14px',
  },
  headerRight: {
    display:    'flex',
    alignItems: 'center',
    gap:        '12px',
  },
  welcomeText: {
    color:    '#CBD5E1',
    fontSize: '14px',
  },
  navBtn: {
    backgroundColor: '#1E293B',
    color:           '#CBD5E1',
    border:          '1px solid #334155',
    borderRadius:    '8px',
    padding:         '8px 16px',
    cursor:          'pointer',
    fontSize:        '13px',
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    color:           '#fff',
    border:          'none',
    borderRadius:    '8px',
    padding:         '8px 16px',
    cursor:          'pointer',
    fontSize:        '13px',
  },
  statsRow: {
    display:             'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap:                 '16px',
    marginBottom:        '24px',
  },
  statCard: {
    backgroundColor: '#1E293B',
    borderRadius:    '12px',
    padding:         '20px',
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    gap:             '8px',
  },
  statValue: {
    color:      '#F8FAFC',
    fontSize:   '36px',
    fontWeight: 'bold',
  },
  statLabel: {
    color:    '#94A3B8',
    fontSize: '14px',
  },
  mainRow: {
    display:             'grid',
    gridTemplateColumns: '2fr 1fr',
    gap:                 '16px',
  },
  mapCard: {
    backgroundColor: '#1E293B',
    borderRadius:    '12px',
    padding:         '20px',
  },
  alertCard: {
    backgroundColor: '#1E293B',
    borderRadius:    '12px',
    padding:         '20px',
    maxHeight:       '560px',
    overflowY:       'auto',
  },
  cardTitle: {
    color:        '#F8FAFC',
    marginBottom: '16px',
    fontSize:     '16px',
    display:      'flex',
    alignItems:   'center',
    gap:          '8px',
  },
  badge: {
    backgroundColor: '#EF4444',
    color:           '#fff',
    borderRadius:    '50%',
    width:           '24px',
    height:          '24px',
    display:         'inline-flex',
    alignItems:      'center',
    justifyContent:  'center',
    fontSize:        '12px',
    fontWeight:      'bold',
  },
  alertList: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '12px',
  },
  noAlerts: {
    color:     '#22C55E',
    textAlign: 'center',
    padding:   '20px',
  },
  alertItem: {
    backgroundColor: '#0F172A',
    borderRadius:    '8px',
    padding:         '12px',
  },
  alertTop: {
    display:        'flex',
    justifyContent: 'space-between',
    marginBottom:   '6px',
  },
  alertType: {
    color:      '#F8FAFC',
    fontWeight: 'bold',
    fontSize:   '13px',
  },
  alertTime: {
    color:    '#64748B',
    fontSize: '12px',
  },
  alertName: {
    color:    '#CBD5E1',
    fontSize: '13px',
    margin:   '4px 0',
  },
  alertLoc: {
    color:    '#64748B',
    fontSize: '12px',
    margin:   '4px 0',
  },
  statusBadge: {
    color:        '#fff',
    padding:      '2px 8px',
    borderRadius: '20px',
    fontSize:     '10px',
    fontWeight:   'bold',
  },
  alertBtns: {
    display:   'flex',
    gap:       '8px',
    marginTop: '8px',
  },
  ackBtn: {
    backgroundColor: '#22C55E',
    color:           '#fff',
    border:          'none',
    borderRadius:    '6px',
    padding:         '6px 12px',
    cursor:          'pointer',
    fontSize:        '12px',
  },
  firBtn: {
    backgroundColor: '#3B82F6',
    color:           '#fff',
    border:          'none',
    borderRadius:    '6px',
    padding:         '6px 12px',
    cursor:          'pointer',
    fontSize:        '12px',
  },
  firNumber: {
    color:    '#60A5FA',
    fontSize: '11px',
  },
};
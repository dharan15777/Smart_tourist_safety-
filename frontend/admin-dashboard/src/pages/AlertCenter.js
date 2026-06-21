import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ALERT_URL = 'https://redesigned-chainsaw-wv7x54jxqr5cgxvr-3003.app.github.dev';

export default function AlertCenter() {
  const [alerts,  setAlerts]  = useState([]);
  const [filter,  setFilter]  = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [stats,   setStats]   = useState({
    total: 0, active: 0, panic: 0, geoFence: 0
  });

  useEffect(() => {
    fetchAlerts();
    fetchStats();

    const socket = io(ALERT_URL);
    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
      fetchStats();
    });

    socket.on('alert_updated', (data) => {
      setAlerts(prev => prev.map(a =>
        a.alertId === data.alertId
          ? { ...a, status: data.status }
          : a
      ));
    });

    return () => socket.close();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${ALERT_URL}/api/alerts?limit=100`);
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${ALERT_URL}/api/alerts/stats`);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error(err.message);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      await axios.put(
        `${ALERT_URL}/api/alerts/${alertId}/acknowledge`,
        { officerName: 'Officer' }
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

  const resolveAlert = async (alertId) => {
    try {
      await axios.put(
        `${ALERT_URL}/api/alerts/${alertId}/resolve`,
        { notes: 'Resolved by officer' }
      );
      setAlerts(prev => prev.map(a =>
        a.alertId === alertId
          ? { ...a, status: 'RESOLVED' }
          : a
      ));
    } catch (err) {
      alert('Failed to resolve');
    }
  };

  const generateFIR = async (alertId) => {
    try {
      const res = await axios.post(
        `${ALERT_URL}/api/alerts/${alertId}/fir`
      );
      alert(`✅ FIR Generated!\n\nFIR Number: ${res.data.firNumber}\n\nSave this number for records.`);
      fetchAlerts();
    } catch (err) {
      alert('Failed to generate FIR');
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL')    return true;
    if (filter === 'ACTIVE') return a.status === 'ACTIVE';
    if (filter === 'PANIC')  return a.alertType === 'PANIC';
    if (filter === 'GEO')    return a.alertType === 'GEO_FENCE';
    return true;
  });

  const getSeverityColor = (severity) => {
    if (severity === 'CRITICAL') return '#EF4444';
    if (severity === 'HIGH')     return '#F97316';
    if (severity === 'MEDIUM')   return '#F59E0B';
    return '#22C55E';
  };

  const getStatusColor = (status) => {
    if (status === 'ACTIVE')       return '#EF4444';
    if (status === 'ACKNOWLEDGED') return '#F59E0B';
    if (status === 'RESOLVED')     return '#22C55E';
    return '#64748B';
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🚨 Alert Center</h2>
          <p style={styles.subtitle}>
            Real-time tourist emergency alerts
          </p>
        </div>
        <button
          style={styles.backBtn}
          onClick={() => window.location.href = '/'}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { label: 'Total',     value: stats.total    || 0, color: '#3B82F6' },
          { label: 'Active',    value: stats.active   || 0, color: '#EF4444' },
          { label: 'Panic',     value: stats.panic    || 0, color: '#DC2626' },
          { label: 'Geo-Fence', value: stats.geoFence || 0, color: '#F97316' },
        ].map((s, i) => (
          <div key={i} style={{
            ...styles.statCard,
            borderTop: `3px solid ${s.color}`
          }}>
            <span style={{ ...styles.statNum, color: s.color }}>
              {s.value}
            </span>
            <span style={styles.statLbl}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div style={styles.filterRow}>
        {['ALL', 'ACTIVE', 'PANIC', 'GEO'].map(f => (
          <button
            key={f}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === f ? '#3B82F6' : '#1E293B',
              color:           filter === f ? '#fff'    : '#94A3B8',
            }}
            onClick={() => setFilter(f)}
          >
            {f === 'ALL'    ? '📋 All'       :
             f === 'ACTIVE' ? '🔴 Active'    :
             f === 'PANIC'  ? '🚨 Panic'     :
             '⚠️ Geo-Fence'}
          </button>
        ))}
        <span style={styles.countText}>
          Showing {filteredAlerts.length} alerts
        </span>
      </div>

      {/* Alert List */}
      {loading ? (
        <div style={styles.loading}>⏳ Loading alerts...</div>
      ) : filteredAlerts.length === 0 ? (
        <div style={styles.noAlerts}>✅ No alerts found</div>
      ) : (
        <div style={styles.alertGrid}>
          {filteredAlerts.map((alert, i) => (
            <div key={i} style={{
              ...styles.alertCard,
              borderLeft: `5px solid ${getSeverityColor(alert.severity)}`
            }}>

              {/* Alert Header */}
              <div style={styles.alertTop}>
                <div style={styles.alertTypeBox}>
                  <span style={styles.alertIcon}>
                    {alert.alertType === 'PANIC'     ? '🚨' :
                     alert.alertType === 'GEO_FENCE' ? '⚠️' : '📍'}
                  </span>
                  <span style={styles.alertTypeTxt}>
                    {alert.alertType}
                  </span>
                </div>
                <span style={{
                  ...styles.severityBadge,
                  backgroundColor: getSeverityColor(alert.severity)
                }}>
                  {alert.severity}
                </span>
              </div>

              {/* Alert ID */}
              <p style={styles.alertId}>
                ID: {alert.alertId}
              </p>

              {/* Tourist Info */}
              <div style={styles.infoBox}>
                <p style={styles.infoText}>
                  👤 <b>{alert.tourist?.name || 'Unknown'}</b>
                </p>
                <p style={styles.infoText}>
                  📱 {alert.tourist?.phone || 'N/A'}
                </p>
                <p style={styles.infoText}>
                  🪪 {alert.tourist?.digitalId || 'N/A'}
                </p>
                <p style={styles.infoText}>
                  📍 {alert.location?.address ||
                      `${alert.location?.lat?.toFixed(4)},
                       ${alert.location?.lng?.toFixed(4)}`}
                </p>
                <p style={styles.infoText}>
                  🕐 {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Description */}
              {alert.description && (
                <p style={styles.description}>
                  {alert.description}
                </p>
              )}

              {/* Status */}
              <div style={styles.statusRow}>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(alert.status)
                }}>
                  {alert.status}
                </span>
                {alert.firNumber && (
                  <span style={styles.firTag}>
                    📄 {alert.firNumber}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={styles.actions}>
                {alert.status === 'ACTIVE' && (
                  <button
                    style={styles.ackBtn}
                    onClick={() => acknowledgeAlert(alert.alertId)}
                  >
                    ✓ Acknowledge
                  </button>
                )}
                {alert.status === 'ACKNOWLEDGED' && (
                  <button
                    style={styles.resolveBtn}
                    onClick={() => resolveAlert(alert.alertId)}
                  >
                    ✅ Resolve
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
              </div>

            </div>
          ))}
        </div>
      )}
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
    alignItems:     'flex-start',
    marginBottom:   '24px',
  },
  title: {
    color:      '#F8FAFC',
    margin:     '0 0 4px',
    fontSize:   '24px',
    fontWeight: 'bold',
  },
  subtitle: {
    color:    '#94A3B8',
    margin:   '0',
    fontSize: '14px',
  },
  backBtn: {
    backgroundColor: '#1E293B',
    color:           '#CBD5E1',
    border:          '1px solid #334155',
    borderRadius:    '8px',
    padding:         '8px 16px',
    cursor:          'pointer',
    fontSize:        '13px',
  },
  statsRow: {
    display:             'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap:                 '16px',
    marginBottom:        '20px',
  },
  statCard: {
    backgroundColor: '#1E293B',
    borderRadius:    '8px',
    padding:         '16px',
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    gap:             '4px',
  },
  statNum: {
    fontSize:   '32px',
    fontWeight: 'bold',
  },
  statLbl: {
    color:    '#94A3B8',
    fontSize: '13px',
  },
  filterRow: {
    display:      'flex',
    gap:          '8px',
    marginBottom: '20px',
    alignItems:   'center',
    flexWrap:     'wrap',
  },
  filterBtn: {
    border:       'none',
    borderRadius: '8px',
    padding:      '8px 16px',
    cursor:       'pointer',
    fontSize:     '13px',
    fontWeight:   '500',
  },
  countText: {
    color:    '#64748B',
    fontSize: '13px',
    marginLeft:'auto',
  },
  loading: {
    color:     '#94A3B8',
    textAlign: 'center',
    padding:   '40px',
  },
  noAlerts: {
    color:     '#22C55E',
    textAlign: 'center',
    padding:   '40px',
    fontSize:  '18px',
  },
  alertGrid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap:                 '16px',
  },
  alertCard: {
    backgroundColor: '#1E293B',
    borderRadius:    '12px',
    padding:         '16px',
  },
  alertTop: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   '8px',
  },
  alertTypeBox: {
    display:    'flex',
    alignItems: 'center',
    gap:        '8px',
  },
  alertIcon:    { fontSize: '20px' },
  alertTypeTxt: {
    color:      '#F8FAFC',
    fontWeight: 'bold',
    fontSize:   '14px',
  },
  severityBadge: {
    color:        '#fff',
    padding:      '3px 10px',
    borderRadius: '20px',
    fontSize:     '11px',
    fontWeight:   'bold',
  },
  alertId: {
    color:    '#475569',
    fontSize: '11px',
    margin:   '0 0 8px',
  },
  infoBox: {
    backgroundColor: '#0F172A',
    borderRadius:    '8px',
    padding:         '10px',
    marginBottom:    '8px',
  },
  infoText: {
    color:    '#CBD5E1',
    fontSize: '13px',
    margin:   '3px 0',
  },
  description: {
    color:        '#94A3B8',
    fontSize:     '12px',
    fontStyle:    'italic',
    marginBottom: '8px',
  },
  statusRow: {
    display:     'flex',
    gap:         '8px',
    alignItems:  'center',
    marginBottom:'8px',
  },
  statusBadge: {
    color:        '#fff',
    padding:      '3px 10px',
    borderRadius: '20px',
    fontSize:     '11px',
    fontWeight:   'bold',
  },
  firTag: {
    color:        '#60A5FA',
    fontSize:     '11px',
    backgroundColor: '#1E3A5F',
    padding:      '3px 8px',
    borderRadius: '4px',
  },
  actions: {
    display:  'flex',
    gap:      '8px',
    flexWrap: 'wrap',
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
  resolveBtn: {
    backgroundColor: '#3B82F6',
    color:           '#fff',
    border:          'none',
    borderRadius:    '6px',
    padding:         '6px 12px',
    cursor:          'pointer',
    fontSize:        '12px',
  },
  firBtn: {
    backgroundColor: '#7C3AED',
    color:           '#fff',
    border:          'none',
    borderRadius:    '6px',
    padding:         '6px 12px',
    cursor:          'pointer',
    fontSize:        '12px',
  },
};
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TOURIST_URL = 'https://redesigned-chainsaw-wv7x54jxqr5cgxvr-3002.app.github.dev';

export default function TouristList() {
  const [tourists,  setTourists]  = useState([]);
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => { fetchTourists(); }, []);

  const fetchTourists = async () => {
    try {
      const res = await axios.get(`${TOURIST_URL}/api/tourists/all`);
      setTourists(res.data.tourists || []);
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tourists.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.digitalId?.uniqueId?.includes(search) ||
    t.phone?.includes(search)
  );

  const getScoreColor = (score = 100) => {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>👥 Tourist Registry</h2>
          <p style={styles.subtitle}>
            All registered tourists in NER Safety System
          </p>
        </div>
        <button
          style={styles.backBtn}
          onClick={() => window.location.href = '/'}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by name, Digital ID, or phone..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{tourists.length}</span>
          <span style={styles.statLbl}>Total</span>
        </div>
        <div style={styles.statBox}>
          <span style={{ ...styles.statNum, color: '#22C55E' }}>
            {tourists.filter(t =>
              (t.safetyScore?.score || 100) >= 80
            ).length}
          </span>
          <span style={styles.statLbl}>Safe</span>
        </div>
        <div style={styles.statBox}>
          <span style={{ ...styles.statNum, color: '#F97316' }}>
            {tourists.filter(t => {
              const s = t.safetyScore?.score || 100;
              return s >= 40 && s < 80;
            }).length}
          </span>
          <span style={styles.statLbl}>At Risk</span>
        </div>
        <div style={styles.statBox}>
          <span style={{ ...styles.statNum, color: '#EF4444' }}>
            {tourists.filter(t =>
              (t.safetyScore?.score || 100) < 40
            ).length}
          </span>
          <span style={styles.statLbl}>Critical</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={styles.loading}>⏳ Loading tourists...</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Name', 'Digital ID', 'Phone',
                  'Safety Score', 'Entry Point',
                  'Status', 'Action'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.noData}>
                    No tourists found
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>
                      {t.name || 'N/A'}
                    </td>
                    <td style={styles.td}>
                      <code style={styles.idCode}>
                        {t.digitalId?.uniqueId || 'Not issued'}
                      </code>
                    </td>
                    <td style={styles.td}>
                      {t.phone || 'N/A'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        color:      getScoreColor(t.safetyScore?.score),
                        fontWeight: 'bold'
                      }}>
                        {t.safetyScore?.score || 100} -{' '}
                        {t.safetyScore?.label || 'SAFE'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {t.digitalId?.entryPoint || 'N/A'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: t.isActive
                          ? '#166534' : '#7F1D1D',
                        color: t.isActive
                          ? '#86EFAC' : '#FCA5A5'
                      }}>
                        {t.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.viewBtn}
                        onClick={() => setSelected(t)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          style={styles.overlay}
          onClick={() => setSelected(null)}
        >
          <div
            style={styles.modal}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={styles.closeBtn}
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <h3 style={styles.modalTitle}>
              Tourist Details
            </h3>

            <div style={styles.detailGrid}>
              {[
                { label: 'Name',        value: selected.name },
                { label: 'Phone',       value: selected.phone },
                { label: 'Digital ID',  value: selected.digitalId?.uniqueId },
                { label: 'Entry Point', value: selected.digitalId?.entryPoint },
                { label: 'Safety Score',value: `${selected.safetyScore?.score || 100} - ${selected.safetyScore?.label || 'SAFE'}` },
                { label: 'Status',      value: selected.isActive ? 'ACTIVE' : 'INACTIVE' },
                { label: 'Issued At',   value: selected.digitalId?.issuedAt ? new Date(selected.digitalId.issuedAt).toLocaleDateString() : 'N/A' },
                { label: 'Expires At',  value: selected.digitalId?.expiresAt ? new Date(selected.digitalId.expiresAt).toLocaleDateString() : 'N/A' },
              ].map((item, i) => (
                <div key={i} style={styles.detailItem}>
                  <label style={styles.detailLabel}>
                    {item.label}
                  </label>
                  <p style={styles.detailValue}>
                    {item.value || 'N/A'}
                  </p>
                </div>
              ))}
            </div>

            {/* QR Code */}
            {selected.digitalId?.qrCode && (
              <div style={styles.qrBox}>
                <p style={styles.qrLabel}>Digital ID QR Code</p>
                <img
                  src={selected.digitalId.qrCode}
                  alt="QR Code"
                  style={styles.qrImage}
                />
              </div>
            )}
          </div>
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
  searchInput: {
    width:           '100%',
    padding:         '12px 16px',
    backgroundColor: '#1E293B',
    border:          '1px solid #334155',
    borderRadius:    '8px',
    color:           '#F8FAFC',
    fontSize:        '14px',
    marginBottom:    '16px',
    boxSizing:       'border-box',
    outline:         'none',
  },
  statsRow: {
    display:             'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap:                 '12px',
    marginBottom:        '16px',
  },
  statBox: {
    backgroundColor: '#1E293B',
    borderRadius:    '8px',
    padding:         '16px',
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    gap:             '4px',
  },
  statNum: {
    color:      '#F8FAFC',
    fontSize:   '28px',
    fontWeight: 'bold',
  },
  statLbl: {
    color:    '#94A3B8',
    fontSize: '12px',
  },
  loading: {
    color:     '#94A3B8',
    textAlign: 'center',
    padding:   '40px',
  },
  tableWrap: {
    backgroundColor: '#1E293B',
    borderRadius:    '12px',
    overflow:        'auto',
  },
  table: {
    width:           '100%',
    borderCollapse: 'collapse',
  },
  th: {
    color:        '#94A3B8',
    padding:      '12px 16px',
    textAlign:    'left',
    borderBottom: '1px solid #334155',
    fontSize:     '13px',
    fontWeight:   '600',
  },
  tr: {
    borderBottom: '1px solid #0F172A',
  },
  td: {
    color:   '#CBD5E1',
    padding: '12px 16px',
    fontSize:'14px',
  },
  noData: {
    color:     '#64748B',
    textAlign: 'center',
    padding:   '40px',
  },
  idCode: {
    backgroundColor: '#0F172A',
    padding:         '4px 8px',
    borderRadius:    '4px',
    fontSize:        '12px',
    color:           '#60A5FA',
  },
  badge: {
    padding:      '4px 10px',
    borderRadius: '20px',
    fontSize:     '11px',
    fontWeight:   'bold',
  },
  viewBtn: {
    backgroundColor: '#3B82F6',
    color:           '#fff',
    border:          'none',
    borderRadius:    '6px',
    padding:         '6px 14px',
    cursor:          'pointer',
    fontSize:        '13px',
  },
  overlay: {
    position:        'fixed',
    top:             0,
    left:            0,
    right:           0,
    bottom:          0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          1000,
  },
  modal: {
    backgroundColor: '#1E293B',
    borderRadius:    '16px',
    padding:         '32px',
    width:           '500px',
    maxHeight:       '80vh',
    overflowY:       'auto',
    position:        'relative',
  },
  closeBtn: {
    position:        'absolute',
    top:             '16px',
    right:           '16px',
    background:      'none',
    border:          'none',
    color:           '#94A3B8',
    fontSize:        '20px',
    cursor:          'pointer',
  },
  modalTitle: {
    color:        '#F8FAFC',
    marginBottom: '20px',
    fontSize:     '18px',
  },
  detailGrid: {
    display:             'grid',
    gridTemplateColumns: '1fr 1fr',
    gap:                 '16px',
  },
  detailItem: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '4px',
  },
  detailLabel: {
    color:    '#64748B',
    fontSize: '12px',
  },
  detailValue: {
    color:      '#F8FAFC',
    fontSize:   '15px',
    fontWeight: '500',
    margin:     '0',
  },
  qrBox: {
    textAlign: 'center',
    marginTop: '20px',
  },
  qrLabel: {
    color:        '#94A3B8',
    marginBottom: '8px',
    fontSize:     '14px',
  },
  qrImage: {
    width:        '150px',
    height:       '150px',
    borderRadius: '8px',
  },
};
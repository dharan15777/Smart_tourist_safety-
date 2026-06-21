import React, { useState } from 'react';
import axios from 'axios';

const AUTH_URL = 'https://redesigned-chainsaw-wv7x54jxqr5cgxvr-3001.app.github.dev';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${AUTH_URL}/api/auth/login`, {
        email,
        password
      });

      if (res.data.success) {
        const { role } = res.data.user;
        if (role === 'police' || role === 'admin') {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          window.location.href = '/';
        } else {
          setError('Access denied. Police or Admin only.');
        }
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🛡️</div>
          <h2 style={styles.title}>Tourist Safety</h2>
          <p style={styles.subtitle}>Police Command Center</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              placeholder="officer@police.gov.in"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔐 LOGIN'}
          </button>

        </form>

        {/* Demo Credentials */}
        <div style={styles.demoBox}>
          <p style={styles.demoTitle}>Demo Credentials:</p>
          <p style={styles.demoText}>
            First register a police account then login
          </p>
          <button
            style={styles.demoBtn}
            onClick={async () => {
              try {
                await axios.post(`${AUTH_URL}/api/auth/register`, {
                  name:     'Police Officer',
                  email:    'police@demo.com',
                  phone:    '9999999999',
                  password: 'police123',
                  role:     'police',
                });
                setEmail('police@demo.com');
                setPassword('police123');
              } catch (err) {
                setEmail('police@demo.com');
                setPassword('police123');
              }
            }}
          >
            Fill Demo Credentials
          </button>
        </div>

        <p style={styles.footer}>
          Ministry of Tourism • NER Safety System
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight:       '100vh',
    backgroundColor: '#0F172A',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    fontFamily:      'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius:    '16px',
    padding:         '40px',
    width:           '400px',
    boxShadow:       '0 20px 60px rgba(0,0,0,0.5)',
  },
  header: {
    textAlign:    'center',
    marginBottom: '32px',
  },
  logo: {
    fontSize: '48px',
  },
  title: {
    color:      '#F8FAFC',
    margin:     '8px 0 4px',
    fontSize:   '24px',
    fontWeight: 'bold',
  },
  subtitle: {
    color:    '#94A3B8',
    margin:   '0',
    fontSize: '14px',
  },
  form: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '16px',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    color:           '#DC2626',
    padding:         '12px',
    borderRadius:    '8px',
    fontSize:        '14px',
  },
  inputGroup: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '6px',
  },
  label: {
    color:      '#CBD5E1',
    fontSize:   '14px',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#334155',
    border:          '1px solid #475569',
    borderRadius:    '8px',
    padding:         '12px',
    color:           '#F8FAFC',
    fontSize:        '14px',
    outline:         'none',
  },
  button: {
    backgroundColor: '#3B82F6',
    color:           '#fff',
    border:          'none',
    borderRadius:    '8px',
    padding:         '14px',
    fontSize:        '16px',
    fontWeight:      'bold',
    cursor:          'pointer',
    marginTop:       '8px',
  },
  demoBox: {
    backgroundColor: '#0F172A',
    borderRadius:    '8px',
    padding:         '16px',
    marginTop:       '24px',
    textAlign:       'center',
  },
  demoTitle: {
    color:    '#94A3B8',
    fontSize: '12px',
    margin:   '0 0 4px',
  },
  demoText: {
    color:    '#64748B',
    fontSize: '11px',
    margin:   '0 0 8px',
  },
  demoBtn: {
    backgroundColor: '#1E293B',
    color:           '#60A5FA',
    border:          '1px solid #334155',
    borderRadius:    '6px',
    padding:         '8px 16px',
    cursor:          'pointer',
    fontSize:        '12px',
  },
  footer: {
    color:     '#64748B',
    fontSize:  '12px',
    textAlign: 'center',
    marginTop: '24px',
  },
};
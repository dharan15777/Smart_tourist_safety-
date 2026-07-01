import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Verify() {
  const [touristId, setTouristId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!touristId.trim()) { setError('Please enter a Tourist ID'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BLOCKCHAIN_URL}/api/blockchain/verify/${touristId}`)
      const data = await res.json()
      if (data.valid) setResult(data)
      else setError('Tourist ID not found in blockchain registry')
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Verify Digital ID - TouristSafe NE</title></Head>
      <nav style={{ background: 'white', padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: '700', color: '#1a56db', fontSize: '18px' }}>🛡️ TouristSafe NE</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
          <Link href="/register" style={{ color: '#374151', textDecoration: 'none' }}>Register</Link>
        </div>
      </nav>
      <div style={{ minHeight: '90vh', padding: '60px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Verify Digital Tourist ID</h1>
            <p style={{ fontSize: '17px', color: '#6b7280' }}>Enter your Tourist ID to verify authenticity on the blockchain</p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <form onSubmit={handleVerify}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Tourist Digital ID</label>
              <input type="text" placeholder="Enter Tourist ID (e.g. USER001) or NER-2026-XXXXXXXX" value={touristId} onChange={e => setTouristId(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', marginBottom: '8px', boxSizing: 'border-box' }} />
              {error && <p style={{ color: '#e02424', fontSize: '14px', marginBottom: '8px' }}>❌ {error}</p>}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: loading ? '#94a3b8' : '#1a56db', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
                {loading ? '🔄 Verifying...' : '🔍 Verify on Blockchain'}
              </button>
            </form>
            {result && (
              <div style={{ marginTop: '24px', padding: '24px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #86efac' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '28px' }}>✅</span>
                  <div>
                    <h3 style={{ color: '#15803d', fontWeight: '700', fontSize: '18px', margin: 0 }}>Identity Verified</h3>
                    <p style={{ color: '#16a34a', fontSize: '13px', margin: 0 }}>Blockchain record authenticated</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    {label:'Tourist ID', value: result.touristId},
                    {label:'Full Name', value: result.name},
                    {label:'Nationality', value: result.nationality},
                    {label:'Valid Until', value: result.validUntil},
                    {label:'Status', value: result.status?.toUpperCase()},
                    {label:'Block Hash', value: result.blockHash ? result.blockHash.substring(0,16)+'...' : 'N/A'}
                  ].map((item,i) => (
                    <div key={i} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{item.value || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[{icon:'🔒',title:'Blockchain Secured',desc:'Every ID stored on tamper-proof ledger'},{icon:'⚡',title:'Instant Verify',desc:'Results in under 2 seconds'},{icon:'🏛️',title:'Govt Verified',desc:'Verified by Tourism Department'}].map((item,i) => (
              <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

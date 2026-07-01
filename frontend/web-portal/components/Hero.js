import Link from 'next/link'
export default function Hero() {
  return (
    <section style={{ background: 'linear-gradient(135deg, #1a56db 0%, #1e429f 50%, #0e9f6e 100%)', color: 'white', padding: '80px 0', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>Smart Tourist Safety System</h1>
        <p style={{ fontSize: '20px', opacity: '0.9', marginBottom: '40px' }}>AI-Powered Safety Monitoring for Northeast India</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register"><button style={{ background: 'white', color: '#1a56db', fontSize: '17px', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>🪪 Register as Tourist</button></Link>
          <Link href="/verify"><button style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid white', fontSize: '17px', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>🔍 Verify Digital ID</button></Link>
        </div>
      </div>
    </section>
  )
}

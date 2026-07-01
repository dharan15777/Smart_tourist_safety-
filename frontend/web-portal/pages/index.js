import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head><title>Smart Tourist Safety System - Northeast India</title></Head>
      <nav style={{ background: 'white', padding: '16px 0', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a56db' }}>🛡️ TouristSafe NE</div>
          <div style={{ display: 'flex', gap: '24px', listStyle: 'none' }}>
            <Link href="/" style={{ color: '#111827', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
            <Link href="/register" style={{ color: '#111827', textDecoration: 'none', fontWeight: '500' }}>Register</Link>
            <Link href="/verify" style={{ color: '#111827', textDecoration: 'none', fontWeight: '500' }}>Verify ID</Link>
            <Link href="/about" style={{ color: '#111827', textDecoration: 'none', fontWeight: '500' }}>About</Link>
            <Link href="/register"><button style={{ background: '#1a56db', color: 'white', padding: '8px 20px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Get Started</button></Link>
          </div>
        </div>
      </nav>

      <section style={{ background: 'linear-gradient(135deg, #1a56db 0%, #1e429f 50%, #0e9f6e 100%)', color: 'white', padding: '80px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>Smart Tourist Safety System</h1>
          <p style={{ fontSize: '20px', opacity: '0.9', marginBottom: '12px' }}>AI-Powered Safety Monitoring for Northeast India</p>
          <p style={{ fontSize: '15px', opacity: '0.75', marginBottom: '40px' }}>Blockchain Digital ID · Geo-Fencing Alerts · Real-Time Tracking · Emergency Response</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register"><button style={{ background: 'white', color: '#1a56db', fontSize: '17px', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>🪪 Register as Tourist</button></Link>
            <Link href="/verify"><button style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid white', fontSize: '17px', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>🔍 Verify Digital ID</button></Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '60px', flexWrap: 'wrap' }}>
            {[{icon:'👥',number:'10,000+',label:'Tourists Registered'},{icon:'🛡️',number:'99.9%',label:'Safety Rate'},{icon:'⚡',number:'< 2 min',label:'Emergency Response'},{icon:'🌏',number:'8 States',label:'NE India Coverage'}].map((stat,i)=>(
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>{stat.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: '800' }}>{stat.number}</div>
                <div style={{ fontSize: '13px', opacity: '0.8' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>Complete Safety Ecosystem</h2>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Everything you need for a safe tourism experience in Northeast India</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {icon:'🪪',title:'Blockchain Digital ID',desc:'Secure tamper-proof digital identity issued at entry points.',color:'#1a56db'},
              {icon:'📍',title:'Geo-Fencing Alerts',desc:'Instant alerts when entering high-risk or restricted zones.',color:'#e02424'},
              {icon:'🤖',title:'AI Anomaly Detection',desc:'Detects sudden location drop-offs and route deviations.',color:'#0e9f6e'},
              {icon:'🚨',title:'Panic Button',desc:'One-tap emergency alert sends live location to nearest police.',color:'#ff5a1f'},
              {icon:'🗺️',title:'Real-Time Tracking',desc:'Optional live tracking for families and law enforcement.',color:'#7e3af2'},
              {icon:'📋',title:'Auto E-FIR Generation',desc:'Automated First Information Report for missing person cases.',color:'#1c64f2'},
              {icon:'🌐',title:'Multilingual Support',desc:'Available in 10+ Indian languages including Assamese and Bengali.',color:'#057a55'},
              {icon:'🔒',title:'Data Privacy',desc:'End-to-end encryption with full compliance to data protection laws.',color:'#c27803'}
            ].map((f,i)=>(
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ width: '52px', height: '52px', background: f.color+'15', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0', background: '#fef2f2', borderTop: '1px solid #fecaca' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#991b1b', marginBottom: '12px' }}>Emergency? Get Help Immediately</h2>
          <p style={{ fontSize: '16px', color: '#7f1d1d', marginBottom: '32px' }}>If you are in danger, use the panic button in the app or call the tourist helpline</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: '#e02424', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: '700', fontSize: '18px' }}>📞 Tourist Helpline: 1800-XXX-XXXX</div>
            <div style={{ background: '#1a56db', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: '700', fontSize: '18px' }}>🚔 Police Emergency: 112</div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#111827', color: '#9ca3af', padding: '40px 0 20px', marginTop: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '18px' }}>🛡️ TouristSafe NE</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.7' }}>Smart Tourist Safety Monitoring System for Northeast India. Powered by AI, Blockchain and Geo-Fencing.</p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '12px' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/register" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>Register as Tourist</Link>
                <Link href="/verify" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>Verify Digital ID</Link>
                <Link href="/about" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>About the System</Link>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '12px' }}>Government</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <span>Ministry of Tourism</span>
                <span>Ministry of Home Affairs</span>
                <span>MoDoNER</span>
                <span>NIC India</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #374151', paddingTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            © 2024 Smart Tourist Safety System | Government of India Initiative | SIH 2025 - Problem 25002
          </div>
        </div>
      </footer>
    </>
  )
}

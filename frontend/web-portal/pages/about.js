import Head from 'next/head'
import Link from 'next/link'

export default function About() {
  return (
    <>
      <Head><title>About - TouristSafe NE</title></Head>
      <nav style={{ background: 'white', padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: '700', color: '#1a56db', fontSize: '18px' }}>🛡️ TouristSafe NE</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
          <Link href="/register" style={{ color: '#374151', textDecoration: 'none' }}>Register</Link>
          <Link href="/verify" style={{ color: '#374151', textDecoration: 'none' }}>Verify ID</Link>
        </div>
      </nav>
      <section style={{ background: 'linear-gradient(135deg, #1e429f, #1a56db)', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>ℹ️</div>
        <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '12px' }}>About TouristSafe NE</h1>
        <p style={{ fontSize: '18px', opacity: '0.9', maxWidth: '600px', margin: '0 auto' }}>A Government of India initiative to ensure tourist safety in Northeast India</p>
      </section>
      <div style={{ padding: '60px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#111827' }}>🎯 Problem Statement</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.8', marginBottom: '12px' }}>SIH Problem ID: <strong>25002</strong> | Ministry of Development of North Eastern Region (MoDoNER)</p>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.8' }}>Northeast India is home to breathtaking landscapes but ensuring tourist safety in remote, high-risk areas remains a significant challenge for traditional policing. This system addresses that gap with AI, Blockchain, and Geo-Fencing technology.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#111827' }}>⚙️ Technology Stack</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[{icon:'🤖',title:'Artificial Intelligence',desc:'Anomaly detection and safety scoring'},{icon:'⛓️',title:'Blockchain',desc:'SHA-256 tamper-proof Digital ID'},{icon:'📍',title:'Geo-Fencing',desc:'Real-time zone monitoring'},{icon:'🔌',title:'Microservices',desc:'Node.js scalable architecture'},{icon:'📱',title:'React Native',desc:'Cross-platform mobile app'},{icon:'🗺️',title:'Real-Time Maps',desc:'Live tracking with Leaflet.js'}].map((tech,i) => (
                <div key={i} style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{tech.icon}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a56db', marginBottom: '6px' }}>{tech.title}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: '16px', padding: '48px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏆</div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Smart India Hackathon 2025</h2>
            <p style={{ opacity: '0.8', marginBottom: '8px' }}>Problem Statement ID: <strong>SIH25002</strong></p>
            <p style={{ opacity: '0.7', fontSize: '14px', marginBottom: '24px' }}>Category: Software | Theme: Travel & Tourism | Deadline: 7 October 2025</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
              {[{label:'Problem ID',value:'25002'},{label:'Prize Pool',value:'₹5,00,000'},{label:'Category',value:'Software'},{label:'Theme',value:'Tourism'}].map((item,i) => (
                <div key={i}>
                  <div style={{ fontSize: '20px', fontWeight: '800' }}>{item.value}</div>
                  <div style={{ fontSize: '12px', opacity: '0.7' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

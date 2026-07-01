export default function FeatureSection() {
  const features = [
    {icon:'🪪',title:'Blockchain Digital ID',desc:'Secure tamper-proof digital identity issued at entry points.',color:'#1a56db'},
    {icon:'📍',title:'Geo-Fencing Alerts',desc:'Instant alerts when entering high-risk or restricted zones.',color:'#e02424'},
    {icon:'🤖',title:'AI Anomaly Detection',desc:'Detects sudden location drop-offs and route deviations.',color:'#0e9f6e'},
    {icon:'🚨',title:'Panic Button',desc:'One-tap emergency alert sends live location to nearest police.',color:'#ff5a1f'},
    {icon:'🗺️',title:'Real-Time Tracking',desc:'Optional live tracking for families and law enforcement.',color:'#7e3af2'},
    {icon:'📋',title:'Auto E-FIR Generation',desc:'Automated First Information Report for missing person cases.',color:'#1c64f2'},
    {icon:'🌐',title:'Multilingual Support',desc:'Available in 10+ Indian languages.',color:'#057a55'},
    {icon:'🔒',title:'Data Privacy',desc:'End-to-end encryption with full compliance.',color:'#c27803'}
  ]
  return (
    <section style={{ padding: '80px 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>Complete Safety Ecosystem</h2>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>Everything you need for a safe tourism experience in Northeast India</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {features.map((f,i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ width: '52px', height: '52px', background: f.color+'15', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Register() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', nationality: '',
    passportNumber: '', emergencyContact: '', emergencyPhone: '',
    arrivalDate: '', departureDate: '', hotelName: '',
    password: '', confirmPassword: ''
  })
  const [selectedStates, setSelectedStates] = useState([])
  const states = ['Assam','Meghalaya','Manipur','Nagaland','Arunachal Pradesh','Tripura','Mizoram','Sikkim']

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleStateToggle = (state) => {
    setSelectedStates(prev => prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_TOURIST_URL}/api/tourists/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'USER' + Date.now(),
          name: formData.fullName,
          phone: formData.phone,
          nationality: formData.nationality,
          passportNumber: formData.passportNumber,
          arrivalDate: formData.arrivalDate,
          departureDate: formData.departureDate,
          entryPoint: 'Web Portal',
          emergencyContacts: [{ name: formData.emergencyContact, phone: formData.emergencyPhone, relation: 'Family' }]
        })
      })
      const data = await res.json()
      if (data.success) setSuccess(data.profile)
      else setError(data.message || 'Registration failed')
    } catch (err) {
      setError('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <>
      <Head><title>Registration Successful - TouristSafe NE</title></Head>
      <nav style={{ background: 'white', padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: '700', color: '#1a56db', fontSize: '18px' }}>🛡️ TouristSafe NE</div>
        <Link href="/" style={{ color: '#1a56db', textDecoration: 'none' }}>← Home</Link>
      </nav>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#f8fafc' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#15803d', marginBottom: '8px' }}>Registration Successful!</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your Digital Tourist ID has been created</p>
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Your Tourist Digital ID</p>
            <p style={{ fontSize: '24px', fontWeight: '800', color: '#15803d' }}>{success.digitalId?.uniqueId}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/verify"><button style={{ background: '#1a56db', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>🔍 Verify My ID</button></Link>
            <Link href="/"><button style={{ background: '#0e9f6e', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>🏠 Go Home</button></Link>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Head><title>Register - TouristSafe NE</title></Head>
      <nav style={{ background: 'white', padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: '700', color: '#1a56db', fontSize: '18px' }}>🛡️ TouristSafe NE</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
          <Link href="/verify" style={{ color: '#374151', textDecoration: 'none' }}>Verify ID</Link>
        </div>
      </nav>
      <div style={{ minHeight: '90vh', padding: '40px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>🪪 Tourist Registration</h1>
            <p style={{ color: '#6b7280' }}>Register to get your Blockchain Digital ID for safe travel in Northeast India</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: s <= step ? '#1a56db' : '#e5e7eb', color: s <= step ? 'white' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && <div style={{ width: '60px', height: '2px', background: s < step ? '#1a56db' : '#e5e7eb' }} />}
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
              {step === 1 && '👤 Personal Information'}
              {step === 2 && '✈️ Trip Details'}
              {step === 3 && '🔒 Account Security'}
            </h2>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#e02424', fontSize: '14px' }}>❌ {error}</div>}
            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1) }}>
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[{name:'fullName',label:'Full Name',placeholder:'As per passport/Aadhaar'},{name:'email',label:'Email',placeholder:'your@email.com',type:'email'},{name:'phone',label:'Phone',placeholder:'+91 XXXXX XXXXX'},{name:'nationality',label:'Nationality',placeholder:'Indian / Foreign'},{name:'passportNumber',label:'Passport/Aadhaar Number',placeholder:'Optional'},{name:'emergencyContact',label:'Emergency Contact Name',placeholder:'Family member name'},{name:'emergencyPhone',label:'Emergency Contact Phone',placeholder:'+91 XXXXX XXXXX'}].map(field => (
                    <div key={field.name}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{field.label}</label>
                      <input name={field.name} type={field.type || 'text'} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[{name:'arrivalDate',label:'Arrival Date',type:'date'},{name:'departureDate',label:'Departure Date',type:'date'},{name:'hotelName',label:'Hotel/Accommodation',placeholder:'Where are you staying?'}].map(field => (
                    <div key={field.name}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{field.label}</label>
                      <input name={field.name} type={field.type || 'text'} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>States to Visit</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {states.map(state => (
                        <div key={state} onClick={() => handleStateToggle(state)} style={{ padding: '10px 14px', borderRadius: '8px', border: `2px solid ${selectedStates.includes(state) ? '#1a56db' : '#e5e7eb'}`, background: selectedStates.includes(state) ? '#eff6ff' : 'white', cursor: 'pointer', fontSize: '14px', fontWeight: selectedStates.includes(state) ? '600' : '400', color: selectedStates.includes(state) ? '#1a56db' : '#374151' }}>
                          {selectedStates.includes(state) ? '✓ ' : ''}{state}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#92400e' }}>
                    ⚠️ Use these credentials to login to the TouristSafe mobile app
                  </div>
                  {[{name:'password',label:'Password',placeholder:'Minimum 6 characters',type:'password'},{name:'confirmPassword',label:'Confirm Password',placeholder:'Repeat password',type:'password'}].map(field => (
                    <div key={field.name}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{field.label}</label>
                      <input name={field.name} type={field.type} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                {step > 1 && <button type="button" onClick={() => setStep(step-1)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #e5e7eb', background: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>← Back</button>}
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#1a56db', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
                  {loading ? '🔄 Registering...' : step === 3 ? '🪪 Complete Registration' : 'Next →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

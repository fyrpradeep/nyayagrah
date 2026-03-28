'use client'
import { useState } from 'react'
import Link from 'next/link'
import { registerClient } from '../../data/clientStore'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', mobile: '', email: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    if (form.mobile.length !== 10) { setErr('Enter valid 10-digit mobile number'); setLoading(false); return }
    const res = registerClient(form)
    if (res.error) { setErr(res.error); setLoading(false); return }
    setTimeout(() => router.push('/login?registered=1'), 500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="Nyaya Grah" style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover', marginBottom: 12 }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 700, color: '#c9a84c' }}>Nyaya Grah</div>
          <div style={{ fontSize: 12, color: '#8a9bb0' }}>Client Portal</div>
        </div>

        <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 16, padding: 36 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Create Account</h2>
          <p style={{ fontSize: 13, color: '#8a9bb0', marginBottom: 24 }}>Register to track your services and payments</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Full Name *" type="text" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Your full name" required />
            <Field label="Mobile Number *" type="tel" value={form.mobile} onChange={v => setForm({ ...form, mobile: v })} placeholder="10-digit mobile number" required maxLength={10} />
            <Field label="Email Address" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="your@email.com" />

            <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#c9a84c' }}>
              🔐 Default password: <strong>666666</strong> — aap baad mein change kar sakte hain
            </div>

            {err && <div style={{ fontSize: 12, color: '#e24b4a', padding: '8px 12px', background: 'rgba(226,75,74,0.1)', borderRadius: 6 }}>⚠️ {err}</div>}

            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14, fontFamily: 'DM Sans,sans-serif', marginTop: 4 }}>
              {loading ? 'Registering...' : 'Create Account →'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#8a9bb0' }}>
            Already have an account? <Link href="/login" style={{ color: '#c9a84c', textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 12, color: '#8a9bb0', textDecoration: 'none' }}>← Back to Website</Link>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: '#8a9bb0' }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} {...props}
        style={{ background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif', width: '100%' }} />
    </div>
  )
}

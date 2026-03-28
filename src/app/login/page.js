'use client'
import { useState } from 'react'
import Link from 'next/link'
import { loginClient } from '../../data/clientStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [form, setForm] = useState({ mobile: '', password: '666666' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const registered = params.get('registered')

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    const res = loginClient(form.mobile, form.password)
    if (res.error) { setErr(res.error); setLoading(false); return }
    router.push('/client/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="Nyaya Grah" style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover', marginBottom: 12 }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 700, color: '#c9a84c' }}>Nyaya Grah</div>
          <div style={{ fontSize: 12, color: '#8a9bb0' }}>Client Portal</div>
        </div>

        <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 16, padding: 36 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Client Login</h2>
          <p style={{ fontSize: 13, color: '#8a9bb0', marginBottom: 24 }}>Track your services, payments & documents</p>

          {registered && (
            <div style={{ background: 'rgba(29,158,117,0.12)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1D9E75', marginBottom: 16 }}>
              ✅ Registration successful! Login karein.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#8a9bb0' }}>Mobile Number *</label>
              <input type="tel" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="Registered mobile number" maxLength={10} required style={inp} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#8a9bb0' }}>Password *</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Default: 666666" required style={inp} />
            </div>

            {err && <div style={{ fontSize: 12, color: '#e24b4a', padding: '8px 12px', background: 'rgba(226,75,74,0.1)', borderRadius: 6 }}>⚠️ {err}</div>}

            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: 13, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14, fontFamily: 'DM Sans,sans-serif', marginTop: 4 }}>
              {loading ? 'Logging in...' : 'Login to Portal →'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#8a9bb0' }}>
            New user? <Link href="/register" style={{ color: '#c9a84c', textDecoration: 'none' }}>Register here</Link>
          </div>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <Link href="/admin" style={{ fontSize: 12, color: '#8a9bb0', textDecoration: 'none' }}>Admin Login →</Link>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 12, color: '#8a9bb0', textDecoration: 'none' }}>← Back to Website</Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense fallback={<div style={{background:'#0a1628',minHeight:'100vh'}}/>}><LoginForm /></Suspense>
}

const inp = { background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif', width: '100%' }

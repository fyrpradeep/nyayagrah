'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPaymentSettings, savePaymentSettings } from '../../../data/clientStore'

const ADMIN_PASS = 'nyayagrah2025'

export default function PaymentGatewayAdmin() {
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [passErr, setPassErr] = useState(false)
  const [settings, setSettings] = useState({
    mode: 'manual',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    upiId: '',
    upiName: 'Nyaya Grah',
    bankName: '',
    accountNo: '',
    ifsc: '',
    manualInstructions: 'Please pay via UPI/Bank Transfer and share the transaction ID with us on WhatsApp.',
  })
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState('')

  useEffect(() => {
    if (auth) {
      const s = getPaymentSettings()
      setSettings(prev => ({ ...prev, ...s }))
    }
  }, [auth])

  function handleSave() {
    savePaymentSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function testRazorpay() {
    if (!settings.razorpayKeyId) { setTestResult('❌ Please enter Razorpay Key ID first'); return }
    if (!settings.razorpayKeyId.startsWith('rzp_')) { setTestResult('❌ Invalid Key ID format. Should start with rzp_test_ or rzp_live_'); return }
    setTestResult('✅ Key format looks valid! Save settings and test with a real payment.')
  }

  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 16, padding: 36, width: '100%', maxWidth: 400 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 700, color: '#c9a84c', marginBottom: 20 }}>Payment Gateway Settings</div>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Admin password" onKeyDown={e => e.key === 'Enter' && (pass === ADMIN_PASS ? (setAuth(true), setPassErr(false)) : setPassErr(true))}
            style={inp} />
          {passErr && <p style={{ fontSize: 12, color: '#e24b4a', marginTop: 6 }}>Incorrect password</p>}
          <button onClick={() => pass === ADMIN_PASS ? (setAuth(true), setPassErr(false)) : setPassErr(true)}
            style={{ ...btnGold, width: '100%', marginTop: 12 }}>Login</button>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link href="/admin" style={{ fontSize: 12, color: '#8a9bb0', textDecoration: 'none' }}>← Back to Admin</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      {/* Top bar */}
      <div style={{ background: '#0f1e35', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/admin" style={{ fontSize: 12, color: '#8a9bb0', textDecoration: 'none' }}>← Admin Panel</Link>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 600, color: '#c9a84c' }}>💳 Payment Gateway Settings</div>
      </div>

      <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 24px' }}>

        {/* Mode Toggle — Main Card */}
        <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: 28, marginBottom: 20 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 600, color: '#c9a84c', marginBottom: 6 }}>Payment Mode</div>
          <p style={{ fontSize: 13, color: '#8a9bb0', marginBottom: 20 }}>Switch between Razorpay online payment and manual payment anytime.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Razorpay */}
            <div onClick={() => setSettings({ ...settings, mode: 'razorpay' })}
              style={{ border: `2px solid ${settings.mode === 'razorpay' ? '#c9a84c' : 'rgba(201,168,76,0.15)'}`, borderRadius: 12, padding: 20, cursor: 'pointer', background: settings.mode === 'razorpay' ? 'rgba(201,168,76,0.08)' : '#162440', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>💳</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: settings.mode === 'razorpay' ? '#c9a84c' : '#fff' }}>Razorpay</div>
                  <div style={{ fontSize: 11, color: '#8a9bb0' }}>Online Payment Gateway</div>
                </div>
                {settings.mode === 'razorpay' && <span style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#0a1628', fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ fontSize: 12, color: '#8a9bb0', lineHeight: 1.6 }}>
                Clients pay online via UPI, Cards, Net Banking. Payment auto-confirmed.
              </div>
            </div>

            {/* Manual */}
            <div onClick={() => setSettings({ ...settings, mode: 'manual' })}
              style={{ border: `2px solid ${settings.mode === 'manual' ? '#c9a84c' : 'rgba(201,168,76,0.15)'}`, borderRadius: 12, padding: 20, cursor: 'pointer', background: settings.mode === 'manual' ? 'rgba(201,168,76,0.08)' : '#162440', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>🏦</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: settings.mode === 'manual' ? '#c9a84c' : '#fff' }}>Manual</div>
                  <div style={{ fontSize: 11, color: '#8a9bb0' }}>UPI / Bank Transfer</div>
                </div>
                {settings.mode === 'manual' && <span style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#0a1628', fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ fontSize: 12, color: '#8a9bb0', lineHeight: 1.6 }}>
                Client pays via UPI/bank and shares TXN ID. Admin confirms manually.
              </div>
            </div>
          </div>
        </div>

        {/* Razorpay Config */}
        {settings.mode === 'razorpay' && (
          <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 600, color: '#c9a84c', marginBottom: 6 }}>Razorpay API Keys</div>
            <p style={{ fontSize: 13, color: '#8a9bb0', marginBottom: 20 }}>Get these keys from your <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c' }}>Razorpay Dashboard</a> → Settings → API Keys</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>Key ID * <span style={{ color: '#8a9bb0', fontWeight: 400 }}>(starts with rzp_test_ or rzp_live_)</span></label>
                <input type="text" value={settings.razorpayKeyId} onChange={e => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                  placeholder="rzp_live_XXXXXXXXXXXXXXXXXX" style={{ ...inp, marginTop: 6, fontFamily: 'monospace', letterSpacing: 0.5 }} />
              </div>
              <div>
                <label style={lbl}>Key Secret * <span style={{ color: '#8a9bb0', fontWeight: 400 }}>(keep this private)</span></label>
                <input type="password" value={settings.razorpayKeySecret} onChange={e => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                  placeholder="••••••••••••••••••••" style={{ ...inp, marginTop: 6, fontFamily: 'monospace' }} />
              </div>

              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10, padding: 16, fontSize: 13, color: '#c8d4e0', lineHeight: 1.7 }}>
                <strong style={{ color: '#c9a84c' }}>📋 How to get Razorpay keys:</strong><br />
                1. Go to <strong>dashboard.razorpay.com</strong><br />
                2. Settings → API Keys → Generate Key<br />
                3. Copy Key ID and Key Secret here<br />
                4. Use <strong>rzp_test_</strong> for testing, <strong>rzp_live_</strong> for real payments
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={testRazorpay} style={btnOutline}>🧪 Validate Key Format</button>
                {testResult && <span style={{ fontSize: 13, color: testResult.startsWith('✅') ? '#1D9E75' : '#e24b4a', display: 'flex', alignItems: 'center' }}>{testResult}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Manual Payment Config */}
        {settings.mode === 'manual' && (
          <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 600, color: '#c9a84c', marginBottom: 6 }}>Manual Payment Details</div>
            <p style={{ fontSize: 13, color: '#8a9bb0', marginBottom: 20 }}>These details will be shown to clients when they click Pay Now</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="UPI ID" value={settings.upiId} onChange={v => setSettings({ ...settings, upiId: v })} placeholder="nyayagrah@upi" />
              <Field label="UPI Display Name" value={settings.upiName} onChange={v => setSettings({ ...settings, upiName: v })} placeholder="Nyaya Grah" />
              <Field label="Bank Name" value={settings.bankName} onChange={v => setSettings({ ...settings, bankName: v })} placeholder="HDFC Bank" />
              <Field label="Account Number" value={settings.accountNo} onChange={v => setSettings({ ...settings, accountNo: v })} placeholder="1234567890" />
              <Field label="IFSC Code" value={settings.ifsc} onChange={v => setSettings({ ...settings, ifsc: v })} placeholder="HDFC0001234" />
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={lbl}>Instructions shown to client</label>
              <textarea value={settings.manualInstructions} onChange={e => setSettings({ ...settings, manualInstructions: e.target.value })} rows={3}
                style={{ ...inp, marginTop: 6, resize: 'vertical' }} />
            </div>

            {/* Preview */}
            <div style={{ marginTop: 20, background: '#162440', borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 12, color: '#8a9bb0', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Client Will See This:</div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 500, marginBottom: 12 }}>💳 Pay via UPI or Bank Transfer</div>
              {settings.upiId && (
                <div style={{ background: '#0f1e35', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: '#8a9bb0', marginBottom: 4 }}>UPI ID</div>
                  <div style={{ fontSize: 15, color: '#c9a84c', fontWeight: 600, letterSpacing: 1 }}>{settings.upiId}</div>
                  <div style={{ fontSize: 12, color: '#8a9bb0' }}>{settings.upiName}</div>
                </div>
              )}
              {settings.accountNo && (
                <div style={{ background: '#0f1e35', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: '#8a9bb0', marginBottom: 4 }}>Bank Transfer</div>
                  <div style={{ fontSize: 13, color: '#fff' }}>{settings.bankName} | A/C: {settings.accountNo} | IFSC: {settings.ifsc}</div>
                </div>
              )}
              <div style={{ fontSize: 13, color: '#8a9bb0', lineHeight: 1.6 }}>{settings.manualInstructions}</div>
            </div>
          </div>
        )}

        {/* Both modes — also show UPI for Razorpay mode */}
        {settings.mode === 'razorpay' && (
          <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#c9a84c', marginBottom: 14 }}>Backup Manual Details <span style={{ fontSize: 12, color: '#8a9bb0', fontWeight: 400 }}>(optional — shown if Razorpay fails)</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="UPI ID" value={settings.upiId} onChange={v => setSettings({ ...settings, upiId: v })} placeholder="nyayagrah@upi" />
              <Field label="Bank Account" value={settings.accountNo} onChange={v => setSettings({ ...settings, accountNo: v })} placeholder="Account number" />
            </div>
          </div>
        )}

        {/* Save */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <button onClick={handleSave} style={{ ...btnGold, fontSize: 15, padding: '12px 36px' }}>
            {saved ? '✅ Saved Successfully!' : '💾 Save Payment Settings'}
          </button>
          <Link href="/admin/clients" style={{ fontSize: 13, color: '#8a9bb0', textDecoration: 'none' }}>Go to Client Management →</Link>
        </div>

        {/* Status Banner */}
        <div style={{ marginTop: 24, padding: 18, background: settings.mode === 'razorpay' ? 'rgba(29,158,117,0.1)' : 'rgba(201,168,76,0.08)', border: `1px solid ${settings.mode === 'razorpay' ? 'rgba(29,158,117,0.25)' : 'rgba(201,168,76,0.2)'}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: settings.mode === 'razorpay' ? '#1D9E75' : '#c9a84c', marginBottom: 4 }}>
            {settings.mode === 'razorpay' ? '🟢 Razorpay Mode Active' : '🟡 Manual Payment Mode Active'}
          </div>
          <div style={{ fontSize: 12, color: '#8a9bb0' }}>
            {settings.mode === 'razorpay'
              ? 'Clients will see a Razorpay payment popup. Payments are automatically confirmed.'
              : 'Clients will see your UPI/bank details. Admin must manually confirm each payment in Client Management.'}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={lbl}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp} />
    </div>
  )
}

const inp = { background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '11px 14px', fontSize: 13, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif', width: '100%' }
const lbl = { fontSize: 11, color: '#8a9bb0' }
const btnGold = { background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 13, fontFamily: 'DM Sans,sans-serif', display: 'inline-block' }
const btnOutline = { background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans,sans-serif' }

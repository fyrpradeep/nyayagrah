'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getCurrentClient, logoutClient, getClients, saveClients, addDocument, addMessage, recordPayment, getInvoiceSettings } from '../../../data/clientStore'
import { useRouter } from 'next/navigation'

export default function ClientDashboard() {
  const router = useRouter()
  const [client, setClient] = useState(null)
  const [tab, setTab] = useState('dashboard')
  const [selSvc, setSelSvc] = useState(null)
  const [msgText, setMsgText] = useState('')
  const [payModal, setPayModal] = useState(null)
  const [payStep, setPayStep] = useState('info')
  const [manualTxnId, setManualTxnId] = useState('')
  const [manualMode, setManualMode] = useState('UPI')
  const [gwSettings, setGwSettings] = useState({})
  const [invoiceView, setInvoiceView] = useState(null)
  const [pwForm, setPwForm] = useState({ old: '', new1: '', new2: '' })
  const [pwMsg, setPwMsg] = useState('')
  const fileRef = useRef()

  useEffect(() => {
    const c = getCurrentClient()
    if (!c) { router.push('/login'); return }
    setClient(c)
    if (c.services && c.services.length > 0) setSelSvc(c.services[0])
    const s = localStorage.getItem('ng_settings')
    if (s) setGwSettings(JSON.parse(s))
  }, [])

  function refresh() {
    const c = getCurrentClient()
    if (!c) return
    setClient({ ...c })
    if (selSvc) {
      const found = c.services.find(s => s.id === selSvc.id)
      setSelSvc(found || (c.services[0] || null))
    }
  }

  function handleLogout() { logoutClient(); router.push('/') }

  function sendMessage() {
    if (!msgText.trim()) return
    addMessage(client.id, selSvc ? selSvc.id : null, msgText, 'client')
    setMsgText('')
    refresh()
  }

  function handleDocUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      addDocument(client.id, selSvc ? selSvc.id : null, {
        name: file.name, size: file.size, type: file.type,
        data: ev.target.result, uploadedBy: 'client'
      })
      refresh()
    }
    reader.readAsDataURL(file)
  }

  function handlePayNow() {
    const isRazorpay = gwSettings.paymentMode === 'razorpay' && gwSettings.razorpayKeyId
    if (isRazorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const amount = payModal.payments[0].due
        const options = {
          key: gwSettings.razorpayKeyId,
          amount: Math.round(amount * 100),
          currency: 'INR',
          name: gwSettings.brandName || 'Nyaya Grah',
          description: payModal.title,
          image: '/logo.png',
          handler: function(response) {
            recordPayment(client.id, payModal.id, amount, 'Razorpay', response.razorpay_payment_id)
            setPayModal(null)
            setPayStep('info')
            refresh()
          },
          prefill: { name: client.name, contact: client.mobile, email: client.email || '' },
          theme: { color: '#c9a84c' },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)
    } else {
      setPayStep('manual')
    }
  }

  function submitManualPayment() {
    if (!manualTxnId.trim()) { alert('Please enter Transaction ID'); return }
    recordPayment(client.id, payModal.id, payModal.payments[0].due, manualMode, manualTxnId)
    setPayModal(null)
    setPayStep('info')
    setManualTxnId('')
    refresh()
    alert('Payment submitted! Admin will confirm shortly.')
  }

  function changePw(e) {
    e.preventDefault()
    if (client.password !== pwForm.old) { setPwMsg('Old password incorrect'); return }
    if (pwForm.new1 !== pwForm.new2) { setPwMsg('Passwords do not match'); return }
    if (pwForm.new1.length < 4) { setPwMsg('Password too short'); return }
    const clients = getClients()
    const idx = clients.findIndex(c => c.id === client.id)
    clients[idx].password = pwForm.new1
    saveClients(clients)
    setPwMsg('Password changed successfully!')
    setPwForm({ old: '', new1: '', new2: '' })
  }

  if (!client) return <div style={{ background: '#0a1628', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c' }}>Loading...</div>

  const totalPaid = (client.services || []).reduce((a, s) => a + (s.payments && s.payments[0] ? s.payments[0].paid || 0 : 0), 0)
  const totalDue = (client.services || []).reduce((a, s) => a + (s.payments && s.payments[0] ? s.payments[0].due || 0 : 0), 0)
  const activeServices = (client.services || []).filter(s => s.status === 'In Progress').length

  const isRazorpayMode = gwSettings.paymentMode === 'razorpay' && gwSettings.razorpayKeyId

  const navTabs = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'services', icon: '⚙️', label: 'My Services' },
    { key: 'payments', icon: '💰', label: 'Payments' },
    { key: 'documents', icon: '📁', label: 'Documents' },
    { key: 'messages', icon: '💬', label: 'Messages' },
    { key: 'profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#0f1e35', borderRight: '1px solid rgba(201,168,76,0.15)', position: 'fixed', top: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <img src="/logo.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', marginBottom: 8 }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 14, fontWeight: 700, color: '#c9a84c' }}>Nyaya Grah</div>
          <div style={{ fontSize: 11, color: '#8a9bb0' }}>Client Portal</div>
        </div>
        <div style={{ padding: '12px 8px', flex: 1 }}>
          <div style={{ fontSize: 11, color: '#8a9bb0', padding: '8px 8px 4px', letterSpacing: 1 }}>WELCOME</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', padding: '0 8px 12px', borderBottom: '1px solid rgba(201,168,76,0.1)', marginBottom: 8 }}>{client.name}</div>
          {navTabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: tab === t.key ? '#c9a84c' : '#8a9bb0', background: tab === t.key ? 'rgba(201,168,76,0.1)' : 'transparent', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
          <Link href="/" style={{ display: 'block', textAlign: 'center', padding: '8px', fontSize: 11, color: '#8a9bb0', textDecoration: 'none', borderRadius: 6, border: '1px solid rgba(201,168,76,0.15)', marginBottom: 6 }}>🌐 Website</Link>
          <button onClick={handleLogout} style={{ width: '100%', padding: '8px', fontSize: 11, color: '#e24b4a', background: 'transparent', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 6, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: 220, flex: 1, padding: 28 }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Welcome, {client.name.split(' ')[0]}!</div>
            <p style={{ fontSize: 14, color: '#8a9bb0', marginBottom: 28 }}>Here is a summary of your services and payments.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
              {[
                ['⚙️', 'Total Services', (client.services || []).length, '#c9a84c'],
                ['🔄', 'Active', activeServices, '#1D9E75'],
                ['✅', 'Total Paid', '₹' + totalPaid.toLocaleString('en-IN'), '#1D9E75'],
                ['⏳', 'Amount Due', '₹' + totalDue.toLocaleString('en-IN'), totalDue > 0 ? '#e24b4a' : '#8a9bb0']
              ].map(([icon, t, v, color]) => (
                <div key={t} style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 11, color: '#8a9bb0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: color }}>{v}</div>
                </div>
              ))}
            </div>

            {(client.services || []).length === 0 ? (
              <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 16, color: '#fff', marginBottom: 8 }}>No services yet</div>
                <a href={'https://wa.me/' + (gwSettings.whatsapp || '916350136833')} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 16, background: '#25D366', color: '#fff', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontSize: 13 }}>WhatsApp Us</a>
              </div>
            ) : (
              <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 24 }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 600, color: '#c9a84c', marginBottom: 16 }}>Your Services</div>
                {(client.services || []).map(s => (
                  <div key={s.id} style={{ background: '#162440', borderRadius: 10, padding: 16, marginBottom: 12, border: '1px solid rgba(201,168,76,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{s.title}</div>
                        <div style={{ fontSize: 11, color: '#8a9bb0', marginTop: 2 }}>{s.category}</div>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: '#8a9bb0' }}>Progress</span>
                        <span style={{ fontSize: 11, color: '#c9a84c', fontWeight: 500 }}>{s.progress || 0}%</span>
                      </div>
                      <div style={{ height: 6, background: '#0a1628', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: (s.progress || 0) + '%', background: 'linear-gradient(90deg,#c9a84c,#e2c46a)', borderRadius: 3 }} />
                      </div>
                    </div>
                    {s.payments && s.payments[0] && (
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: '#8a9bb0' }}>Total: <strong style={{ color: '#fff' }}>₹{(s.payments[0].amount || 0).toLocaleString('en-IN')}</strong></span>
                        <span style={{ fontSize: 12, color: '#1D9E75' }}>Paid: ₹{(s.payments[0].paid || 0).toLocaleString('en-IN')}</span>
                        {s.payments[0].due > 0 && <span style={{ fontSize: 12, color: '#e24b4a' }}>Due: ₹{(s.payments[0].due || 0).toLocaleString('en-IN')}</span>}
                        {s.payments[0].due > 0 && (
                          <button onClick={() => { setPayModal(s); setPayStep('info') }}
                            style={{ padding: '4px 14px', background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 500 }}>Pay Now</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SERVICES */}
        {tab === 'services' && (
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 4 }}>My Services</div>
            <p style={{ fontSize: 14, color: '#8a9bb0', marginBottom: 24 }}>Track progress of all your services</p>
            {(client.services || []).length === 0
              ? <Empty icon="⚙️" text="No services assigned yet." />
              : (client.services || []).map(s => (
                <div key={s.id} style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 600, color: '#fff' }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: '#8a9bb0', marginTop: 4 }}>{s.category} · Timeline: {s.timeline || 'TBD'}</div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: '#c8d4e0' }}>Overall Progress</span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#c9a84c' }}>{s.progress || 0}%</span>
                    </div>
                    <div style={{ height: 10, background: '#162440', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: (s.progress || 0) + '%', background: 'linear-gradient(90deg,#c9a84c,#e2c46a)', borderRadius: 5 }} />
                    </div>
                  </div>
                  {(s.steps || []).length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      {s.steps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: step.done ? '#1D9E75' : 'rgba(201,168,76,0.1)', border: step.done ? 'none' : '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: step.done ? '#fff' : '#c9a84c', flexShrink: 0 }}>{step.done ? '✓' : i + 1}</div>
                          <span style={{ fontSize: 13, color: step.done ? '#1D9E75' : '#c8d4e0' }}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {s.notes && <div style={{ background: 'rgba(201,168,76,0.06)', borderRadius: 8, padding: 12, fontSize: 13, color: '#c8d4e0' }}>📝 {s.notes}</div>}
                </div>
              ))
            }
          </div>
        )}

        {/* PAYMENTS */}
        {tab === 'payments' && (
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Payments</div>
            <p style={{ fontSize: 14, color: '#8a9bb0', marginBottom: 24 }}>View payment history and download invoices</p>
            {(client.services || []).length === 0
              ? <Empty icon="💰" text="No payment records yet." />
              : (client.services || []).map(s => {
                const pay = s.payments && s.payments[0]
                if (!pay) return null
                return (
                  <div key={s.id} style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 600, color: '#fff' }}>{s.title}</div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, color: '#8a9bb0' }}>Total: <strong style={{ color: '#fff' }}>₹{(pay.amount || 0).toLocaleString('en-IN')}</strong></span>
                          <span style={{ fontSize: 13, color: '#1D9E75' }}>Paid: ₹{(pay.paid || 0).toLocaleString('en-IN')}</span>
                          {pay.due > 0 && <span style={{ fontSize: 13, color: '#e24b4a' }}>Due: ₹{(pay.due || 0).toLocaleString('en-IN')}</span>}
                        </div>
                      </div>
                      {pay.due > 0 && (
                        <button onClick={() => { setPayModal(s); setPayStep('info') }}
                          style={{ background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>Pay Now →</button>
                      )}
                    </div>
                    {(pay.transactions || []).length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, color: '#8a9bb0', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Transactions</div>
                        {pay.transactions.map(txn => (
                          <div key={txn.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#162440', borderRadius: 8, marginBottom: 8 }}>
                            <div>
                              <div style={{ fontSize: 13, color: '#fff' }}>₹{(txn.amount || 0).toLocaleString('en-IN')} via {txn.mode}</div>
                              <div style={{ fontSize: 11, color: '#8a9bb0' }}>TXN: {txn.txnId} · {new Date(txn.date).toLocaleDateString('en-IN')}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: '#1D9E75' }}>✅ Confirmed</span>
                              {pay.invoices && pay.invoices.find(inv => inv.txnId === txn.txnId) && (
                                <button onClick={() => setInvoiceView(pay.invoices.find(inv => inv.txnId === txn.txnId))}
                                  style={{ padding: '5px 12px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 6, color: '#c9a84c', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>📄 Invoice</button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            }
          </div>
        )}

        {/* DOCUMENTS */}
        {tab === 'documents' && (
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Documents</div>
            <p style={{ fontSize: 14, color: '#8a9bb0', marginBottom: 24 }}>Upload and manage your documents</p>
            {(client.services || []).length === 0
              ? <Empty icon="📁" text="No services yet. Documents will appear here." />
              : (
                <div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                    {(client.services || []).map(s => (
                      <button key={s.id} onClick={() => setSelSvc(s)}
                        style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid', borderColor: selSvc && selSvc.id === s.id ? '#c9a84c' : 'rgba(201,168,76,0.2)', background: selSvc && selSvc.id === s.id ? 'rgba(201,168,76,0.1)' : 'transparent', color: selSvc && selSvc.id === s.id ? '#c9a84c' : '#8a9bb0', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
                        {s.title}
                      </button>
                    ))}
                  </div>
                  {selSvc && (
                    <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#c9a84c' }}>📁 {selSvc.title}</div>
                        <div>
                          <input type="file" ref={fileRef} onChange={handleDocUpload} style={{ display: 'none' }} />
                          <button onClick={() => fileRef.current.click()} style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans,sans-serif', fontWeight: 500 }}>+ Upload Document</button>
                        </div>
                      </div>
                      {(selSvc.documents || []).length === 0
                        ? <div style={{ textAlign: 'center', padding: '32px 0', color: '#8a9bb0', fontSize: 13 }}>No documents uploaded yet.</div>
                        : (selSvc.documents || []).map(doc => (
                          <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#162440', borderRadius: 8, marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 20 }}>📄</span>
                              <div>
                                <div style={{ fontSize: 13, color: '#fff' }}>{doc.name}</div>
                                <div style={{ fontSize: 11, color: '#8a9bb0' }}>{(doc.size / 1024).toFixed(1)} KB · {doc.uploadedBy}</div>
                              </div>
                            </div>
                            <a href={doc.data} download={doc.name} style={{ padding: '5px 12px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6, color: '#c9a84c', fontSize: 11, textDecoration: 'none' }}>Download</a>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )
            }
          </div>
        )}

        {/* MESSAGES */}
        {tab === 'messages' && (
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Messages</div>
            <p style={{ fontSize: 14, color: '#8a9bb0', marginBottom: 24 }}>Chat with our team</p>
            {(client.services || []).length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <button onClick={() => setSelSvc(null)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', borderColor: !selSvc ? '#c9a84c' : 'rgba(201,168,76,0.2)', background: !selSvc ? 'rgba(201,168,76,0.1)' : 'transparent', color: !selSvc ? '#c9a84c' : '#8a9bb0', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>General</button>
                {(client.services || []).map(s => (
                  <button key={s.id} onClick={() => setSelSvc(s)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', borderColor: selSvc && selSvc.id === s.id ? '#c9a84c' : 'rgba(201,168,76,0.2)', background: selSvc && selSvc.id === s.id ? 'rgba(201,168,76,0.1)' : 'transparent', color: selSvc && selSvc.id === s.id ? '#c9a84c' : '#8a9bb0', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>{s.title.length > 20 ? s.title.slice(0,20) + '...' : s.title}</button>
                ))}
              </div>
            )}
            <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 400, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(() => {
                  const msgs = selSvc
                    ? ((client.services || []).find(s => s.id === selSvc.id) || {}).messages || []
                    : client.messages || []
                  if (msgs.length === 0) return <div style={{ textAlign: 'center', color: '#8a9bb0', fontSize: 13, marginTop: 'auto', marginBottom: 'auto' }}>No messages yet.</div>
                  return msgs.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender === 'client' ? 'row-reverse' : 'row', gap: 10 }}>
                      <div style={{ background: msg.sender === 'client' ? 'rgba(201,168,76,0.1)' : '#162440', border: '1px solid ' + (msg.sender === 'client' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)'), borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#fff', maxWidth: 320 }}>{msg.text}</div>
                    </div>
                  ))
                })()}
              </div>
              <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', gap: 10 }}>
                <input value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..." style={{ flex: 1, background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif' }} />
                <button onClick={sendMessage} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontFamily: 'DM Sans,sans-serif' }}>Send</button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 24 }}>My Profile</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 24 }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, color: '#c9a84c', marginBottom: 16 }}>Account Info</div>
                {[['Client ID', client.id], ['Name', client.name], ['Mobile', client.mobile], ['Email', client.email || 'Not provided'], ['Member Since', new Date(client.createdAt).toLocaleDateString('en-IN')]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.06)', fontSize: 13 }}>
                    <span style={{ color: '#8a9bb0' }}>{l}</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 24 }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, color: '#c9a84c', marginBottom: 16 }}>Change Password</div>
                <form onSubmit={changePw} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[['Current Password', 'old'], ['New Password', 'new1'], ['Confirm Password', 'new2']].map(([l, k]) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 12, color: '#8a9bb0' }}>{l}</label>
                      <input type="password" value={pwForm[k]} onChange={e => setPwForm({ ...pwForm, [k]: e.target.value })} style={{ background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif' }} />
                    </div>
                  ))}
                  {pwMsg && <div style={{ fontSize: 12, color: pwMsg.includes('successfully') ? '#1D9E75' : '#e24b4a' }}>{pwMsg}</div>}
                  <button type="submit" style={{ background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: '11px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>Update Password</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PAYMENT MODAL */}
      {payModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 440 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Make Payment</div>
            <div style={{ fontSize: 13, color: '#8a9bb0', marginBottom: 18 }}>{payModal.title}</div>
            <div style={{ background: '#162440', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: '#8a9bb0' }}>Total Amount</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>₹{(payModal.payments[0].amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: '#8a9bb0' }}>Amount Paid</span>
                <span style={{ color: '#1D9E75' }}>₹{(payModal.payments[0].paid || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, paddingTop: 8, borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                <span style={{ color: '#e24b4a' }}>Amount Due</span>
                <span style={{ color: '#e24b4a', fontWeight: 600 }}>₹{(payModal.payments[0].due || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {payStep === 'info' && (
              <div>
                <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: 14, fontSize: 13, color: '#c8d4e0', marginBottom: 16 }}>
                  {isRazorpayMode ? '💳 Pay securely via Razorpay — UPI, Cards, Net Banking' : '🏦 Pay via UPI or Bank Transfer and submit your transaction ID'}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handlePayNow} style={{ flex: 1, background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: 13, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}>
                    {isRazorpayMode ? '💳 Pay via Razorpay' : '🏦 Pay Manually'} — ₹{(payModal.payments[0].due || 0).toLocaleString('en-IN')}
                  </button>
                  <button onClick={() => { setPayModal(null); setPayStep('info') }} style={{ padding: '13px 16px', background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, color: '#8a9bb0', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>✕</button>
                </div>
              </div>
            )}

            {payStep === 'manual' && (
              <div>
                {gwSettings.upiId && (
                  <div style={{ background: '#162440', borderRadius: 10, padding: 16, marginBottom: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#8a9bb0', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>UPI ID</div>
                    <div style={{ fontSize: 18, color: '#c9a84c', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{gwSettings.upiId}</div>
                    <div style={{ fontSize: 12, color: '#8a9bb0' }}>{gwSettings.upiName || 'Nyaya Grah'}</div>
                    <button onClick={() => navigator.clipboard && navigator.clipboard.writeText(gwSettings.upiId)}
                      style={{ marginTop: 10, padding: '5px 14px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6, color: '#c9a84c', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>📋 Copy UPI ID</button>
                  </div>
                )}
                {gwSettings.accountNo && (
                  <div style={{ background: '#162440', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 12, color: '#c8d4e0', lineHeight: 1.7 }}>
                    🏦 Bank: {gwSettings.bankName} | A/C: {gwSettings.accountNo} | IFSC: {gwSettings.ifsc}
                  </div>
                )}
                {gwSettings.manualInstructions && <div style={{ fontSize: 12, color: '#8a9bb0', marginBottom: 14 }}>{gwSettings.manualInstructions}</div>}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  {['UPI', 'Bank Transfer', 'Cash', 'Other'].map(m => (
                    <button key={m} onClick={() => setManualMode(m)}
                      style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid', borderColor: manualMode === m ? '#c9a84c' : 'rgba(201,168,76,0.2)', background: manualMode === m ? 'rgba(201,168,76,0.1)' : 'transparent', color: manualMode === m ? '#c9a84c' : '#8a9bb0', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>{m}</button>
                  ))}
                </div>
                <input value={manualTxnId} onChange={e => setManualTxnId(e.target.value)}
                  placeholder="Enter Transaction ID / UTR number" style={{ width: '100%', background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={submitManualPayment} style={{ flex: 1, background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}>Submit Payment</button>
                  <button onClick={() => setPayStep('info')} style={{ padding: '12px 16px', background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, color: '#8a9bb0', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>← Back</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INVOICE VIEW */}
      {invoiceView && <InvoicePrint invoice={invoiceView} settings={gwSettings} onClose={() => setInvoiceView(null)} />}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = { 'In Progress': ['rgba(201,168,76,0.15)', '#c9a84c'], 'Completed': ['rgba(29,158,117,0.15)', '#1D9E75'], 'On Hold': ['rgba(226,75,74,0.15)', '#e24b4a'] }
  const [bg, color] = map[status] || map['In Progress']
  return <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: bg, color, fontWeight: 500 }}>{status || 'In Progress'}</span>
}

function Empty({ icon, text }) {
  return (
    <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, color: '#8a9bb0' }}>{text}</div>
    </div>
  )
}

function InvoicePrint({ invoice, settings, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: 40, color: '#000', fontFamily: 'Arial,sans-serif' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #c9a84c' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0a1628' }}>{invoice.firmName || 'Nyaya Grah'}</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 6, lineHeight: 1.6 }}>{invoice.firmAddress}</div>
              <div style={{ fontSize: 11, color: '#555' }}>📞 {invoice.firmPhone} | ✉️ {invoice.firmEmail}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>INVOICE</div>
              <div style={{ fontSize: 13, color: '#333', marginTop: 4 }}>#{invoice.invoiceNo}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{new Date(invoice.date).toLocaleDateString('en-IN')}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: '#f8f5ee', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#8a6f2e', marginBottom: 6, textTransform: 'uppercase' }}>Billed To</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{invoice.clientName}</div>
              <div style={{ fontSize: 12, color: '#555' }}>📞 {invoice.clientMobile}</div>
            </div>
            <div style={{ background: '#f8f5ee', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#8a6f2e', marginBottom: 6, textTransform: 'uppercase' }}>Payment Info</div>
              <div style={{ fontSize: 12, color: '#555' }}>Mode: {invoice.mode}</div>
              <div style={{ fontSize: 12, color: '#555' }}>TXN: {invoice.txnId}</div>
              <div style={{ fontSize: 12 }}>Status: <span style={{ color: '#1D9E75', fontWeight: 600 }}>PAID</span></div>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
            <thead><tr style={{ background: '#0a1628', color: '#fff' }}><th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12 }}>Service</th><th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12 }}>Amount</th></tr></thead>
            <tbody><tr><td style={{ padding: '12px 14px', fontSize: 13 }}>{invoice.serviceName}</td><td style={{ padding: '12px 14px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>₹{(invoice.amount || 0).toLocaleString('en-IN')}</td></tr></tbody>
            <tfoot><tr style={{ background: '#f8f5ee' }}><td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700 }}>Total Paid</td><td style={{ padding: '12px 14px', textAlign: 'right', fontSize: 16, fontWeight: 700, color: '#c9a84c' }}>₹{(invoice.amount || 0).toLocaleString('en-IN')}</td></tr></tfoot>
          </table>
          <div style={{ borderTop: '2px solid #c9a84c', paddingTop: 10, fontSize: 11, color: '#888', textAlign: 'center' }}>Thank you for choosing {invoice.firmName || 'Nyaya Grah'}.</div>
        </div>
        <div style={{ padding: '16px 40px', borderTop: '1px solid #eee', display: 'flex', gap: 12 }}>
          <button onClick={() => window.print()} style={{ flex: 1, background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: '11px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>🖨️ Print / Download PDF</button>
          <button onClick={onClose} style={{ padding: '11px 20px', background: 'transparent', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

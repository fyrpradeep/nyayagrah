'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getClients, saveClients, addServiceToClient, updateServiceProgress, recordPayment, addMessage, getInvoiceSettings } from '../../../data/clientStore'

const ADMIN_PASS = 'nyayagrah2025'

export default function AdminClientsPage() {
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)
  const [clients, setClients] = useState([])
  const [selClient, setSelClient] = useState(null)
  const [tab, setTab] = useState('list')
  const [invoiceSettings, setInvoiceSettings] = useState({})

  // Add service form
  const [addSvcForm, setAddSvcForm] = useState({ title: '', category: 'registration', timeline: '', totalAmount: '', notes: '' })
  const [addSvcSteps, setAddSvcSteps] = useState([])
  const [addSvcStepText, setAddSvcStepText] = useState('')
  const [svcAdded, setSvcAdded] = useState(false)

  // Payment form
  const [payForm, setPayForm] = useState({ serviceId: '', amount: '', mode: 'Razorpay', txnId: '' })
  const [payDone, setPayDone] = useState(false)

  // Message
  const [adminMsg, setAdminMsg] = useState('')
  const [adminMsgSvc, setAdminMsgSvc] = useState(null)

  // Invoice settings edit
  const [invForm, setInvForm] = useState({})
  const [invSaved, setInvSaved] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('ng_settings')
    const parsed = s ? JSON.parse(s) : {}
    setInvForm({
      gstin: parsed.gstin || '',
      bankName: parsed.bankName || '',
      accountNo: parsed.accountNo || '',
      ifsc: parsed.ifsc || '',
      upi: parsed.upi || '',
      invoiceFooter: parsed.invoiceFooter || 'Thank you for choosing Nyaya Grah.',
    })
  }, [])

  function login() {
    if (pass === ADMIN_PASS) { setAuth(true); loadClients() }
    else setErr(true)
  }

  function loadClients() {
    setClients(getClients())
  }

  function refresh() {
    const updated = getClients()
    setClients(updated)
    if (selClient) setSelClient(updated.find(c => c.id === selClient.id) || null)
  }

  function handleAddService(e) {
    e.preventDefault()
    const steps = addSvcSteps.map(s => ({ label: s, done: false }))
    addServiceToClient(selClient.id, { ...addSvcForm, steps })
    setSvcAdded(true)
    setAddSvcForm({ title: '', category: 'registration', timeline: '', totalAmount: '', notes: '' })
    setAddSvcSteps([])
    refresh()
    setTimeout(() => setSvcAdded(false), 3000)
  }

  function updateProgress(clientId, serviceId, field, value) {
    updateServiceProgress(clientId, serviceId, { [field]: value })
    refresh()
  }

  function toggleStep(clientId, serviceId, svc, stepIdx) {
    const steps = svc.steps.map((s, i) => i === stepIdx ? { ...s, done: !s.done } : s)
    const doneCount = steps.filter(s => s.done).length
    const progress = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : svc.progress
    updateServiceProgress(clientId, serviceId, { steps, progress })
    refresh()
  }

  function handleRecordPayment(e) {
    e.preventDefault()
    const inv = recordPayment(selClient.id, payForm.serviceId, payForm.amount, payForm.mode, payForm.txnId || 'MANUAL' + Date.now())
    setPayDone(true)
    setPayForm({ serviceId: '', amount: '', mode: 'Razorpay', txnId: '' })
    refresh()
    setTimeout(() => setPayDone(false), 3000)
  }

  function sendAdminMessage() {
    if (!adminMsg.trim()) return
    addMessage(selClient.id, adminMsgSvc?.id, adminMsg, 'admin')
    setAdminMsg('')
    refresh()
  }

  function resetClientPassword(clientId) {
    const cls = getClients()
    const idx = cls.findIndex(c => c.id === clientId)
    cls[idx].password = '666666'
    saveClients(cls)
    alert('Password reset to 666666')
    refresh()
  }

  function saveInvoiceSettings() {
    const s = JSON.parse(localStorage.getItem('ng_settings') || '{}')
    const updated = { ...s, ...invForm }
    localStorage.setItem('ng_settings', JSON.stringify(updated))
    setInvSaved(true)
    setTimeout(() => setInvSaved(false), 2000)
  }

  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 16, padding: 36, width: '100%', maxWidth: 400 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, fontWeight: 700, color: '#c9a84c', marginBottom: 20 }}>Admin — Client Portal</div>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Admin password" onKeyDown={e => e.key === 'Enter' && login()}
            style={{ width: '100%', background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif', marginBottom: 8 }} />
          {err && <p style={{ fontSize: 12, color: '#e24b4a', marginBottom: 8 }}>Incorrect password</p>}
          <button onClick={login} style={{ width: '100%', background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'DM Sans,sans-serif' }}>Login</button>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link href="/admin" style={{ fontSize: 12, color: '#8a9bb0', textDecoration: 'none' }}>← Main Admin Panel</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '0' }}>
      {/* Top bar */}
      <div style={{ background: '#0f1e35', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin" style={{ fontSize: 12, color: '#8a9bb0', textDecoration: 'none' }}>← Admin Panel</Link>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 600, color: '#c9a84c' }}>Client Management</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['list', 'invoice-settings'].map(t => (
            <button key={t} onClick={() => { setTab(t); setSelClient(null) }}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid', borderColor: tab === t ? '#c9a84c' : 'rgba(201,168,76,0.2)', background: tab === t ? 'rgba(201,168,76,0.1)' : 'transparent', color: tab === t ? '#c9a84c' : '#8a9bb0', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
              {t === 'list' ? '👥 Clients' : '🧾 Invoice Settings'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>

        {/* CLIENTS LIST */}
        {tab === 'list' && !selClient && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 600, color: '#fff' }}>All Clients ({clients.length})</div>
                <div style={{ fontSize: 13, color: '#8a9bb0' }}>Click on a client to manage their services & payments</div>
              </div>
              <button onClick={loadClients} style={{ padding: '8px 18px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, color: '#c9a84c', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>🔄 Refresh</button>
            </div>
            {clients.length === 0
              ? <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 48, textAlign: 'center', color: '#8a9bb0' }}>No clients registered yet. Share your portal link to get clients.</div>
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
                  {clients.map(c => {
                    const totalPaid = c.services?.reduce((a, s) => a + (s.payments?.[0]?.paid || 0), 0) || 0
                    const totalDue = c.services?.reduce((a, s) => a + (s.payments?.[0]?.due || 0), 0) || 0
                    return (
                      <div key={c.id} onClick={() => { setSelClient(c); setTab('client') }}
                        style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>{c.name[0]}</div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: '#8a9bb0' }}>📞 {c.mobile}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                          <span style={{ color: '#8a9bb0' }}>Services: <strong style={{ color: '#fff' }}>{c.services?.length || 0}</strong></span>
                          <span style={{ color: '#1D9E75' }}>Paid: ₹{totalPaid.toLocaleString('en-IN')}</span>
                          {totalDue > 0 && <span style={{ color: '#e24b4a' }}>Due: ₹{totalDue.toLocaleString('en-IN')}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: '#8a9bb0', marginTop: 8 }}>ID: {c.id} · Joined {new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>
                    )
                  })}
                </div>
              )
            }
          </div>
        )}

        {/* CLIENT DETAIL */}
        {tab === 'client' && selClient && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <button onClick={() => { setSelClient(null); setTab('list') }} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}>← Back</button>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 600, color: '#fff' }}>{selClient.name}</div>
                <div style={{ fontSize: 13, color: '#8a9bb0' }}>📞 {selClient.mobile} {selClient.email && `· ✉️ ${selClient.email}`} · ID: {selClient.id}</div>
              </div>
              <button onClick={() => resetClientPassword(selClient.id)} style={{ marginLeft: 'auto', padding: '8px 16px', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 8, color: '#e24b4a', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>Reset Password</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Add Service */}
              <Card title="➕ Add New Service">
                <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <AField label="Service Name *" value={addSvcForm.title} onChange={v => setAddSvcForm({ ...addSvcForm, title: v })} placeholder="e.g. GST Registration" required />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={lbl}>Category</label>
                    <select value={addSvcForm.category} onChange={e => setAddSvcForm({ ...addSvcForm, category: e.target.value })} style={sel}>
                      {['registration', 'compliance', 'tax', 'ipr', 'legal', 'digital', 'ngo'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <AField label="Timeline" value={addSvcForm.timeline} onChange={v => setAddSvcForm({ ...addSvcForm, timeline: v })} placeholder="e.g. 7-10 days" />
                    <AField label="Total Amount (₹)" type="number" value={addSvcForm.totalAmount} onChange={v => setAddSvcForm({ ...addSvcForm, totalAmount: v })} placeholder="e.g. 5000" />
                  </div>
                  <AField label="Notes" value={addSvcForm.notes} onChange={v => setAddSvcForm({ ...addSvcForm, notes: v })} placeholder="Any notes for client" textarea rows={2} />
                  {/* Steps */}
                  <div>
                    <label style={lbl}>Process Steps</label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <input value={addSvcStepText} onChange={e => setAddSvcStepText(e.target.value)} placeholder="Add a step..." style={{ ...inp, flex: 1 }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (addSvcStepText.trim()) { setAddSvcSteps([...addSvcSteps, addSvcStepText.trim()]); setAddSvcStepText('') } } }} />
                      <button type="button" onClick={() => { if (addSvcStepText.trim()) { setAddSvcSteps([...addSvcSteps, addSvcStepText.trim()]); setAddSvcStepText('') } }}
                        style={{ padding: '0 16px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, color: '#c9a84c', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 13 }}>+</button>
                    </div>
                    {addSvcSteps.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, color: '#c8d4e0' }}>
                        <span style={{ color: '#c9a84c' }}>{i + 1}.</span> {s}
                        <button type="button" onClick={() => setAddSvcSteps(addSvcSteps.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#e24b4a', cursor: 'pointer', marginLeft: 'auto' }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button type="submit" style={btnGold}>Add Service to Client</button>
                  {svcAdded && <div style={{ fontSize: 12, color: '#1D9E75' }}>✅ Service added successfully!</div>}
                </form>
              </Card>

              {/* Record Payment */}
              <Card title="💰 Record Payment">
                {selClient.services?.length === 0
                  ? <div style={{ fontSize: 13, color: '#8a9bb0' }}>Add a service first to record payment.</div>
                  : (
                    <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={lbl}>Select Service *</label>
                        <select value={payForm.serviceId} onChange={e => setPayForm({ ...payForm, serviceId: e.target.value })} style={sel} required>
                          <option value="">Choose service...</option>
                          {selClient.services.map(s => <option key={s.id} value={s.id}>{s.title} (Due: ₹{s.payments?.[0]?.due?.toLocaleString('en-IN') || 0})</option>)}
                        </select>
                      </div>
                      <AField label="Amount Received (₹) *" type="number" value={payForm.amount} onChange={v => setPayForm({ ...payForm, amount: v })} placeholder="Amount" required />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={lbl}>Payment Mode</label>
                        <select value={payForm.mode} onChange={e => setPayForm({ ...payForm, mode: e.target.value })} style={sel}>
                          {['Razorpay', 'UPI', 'Bank Transfer', 'Cash', 'Cheque', 'NEFT/RTGS'].map(m => <option key={m}>{m}</option>)}
                        </select>
                      </div>
                      <AField label="Transaction ID" value={payForm.txnId} onChange={v => setPayForm({ ...payForm, txnId: v })} placeholder="UTR/TXN ID (optional)" />
                      <button type="submit" style={btnGold}>Record Payment & Generate Invoice</button>
                      {payDone && <div style={{ fontSize: 12, color: '#1D9E75' }}>✅ Payment recorded! Invoice generated.</div>}
                    </form>
                  )
                }
              </Card>
            </div>

            {/* Services with progress */}
            {selClient.services?.length > 0 && (
              <Card title="⚙️ Manage Services & Progress" style={{ marginTop: 20 }}>
                {selClient.services.map(svc => (
                  <div key={svc.id} style={{ background: '#162440', borderRadius: 10, padding: 18, marginBottom: 14, border: '1px solid rgba(201,168,76,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{svc.title}</div>
                        <div style={{ fontSize: 11, color: '#8a9bb0', marginTop: 2 }}>
                          Total: ₹{svc.payments?.[0]?.amount?.toLocaleString('en-IN')} | Paid: ₹{svc.payments?.[0]?.paid?.toLocaleString('en-IN')} | Due: ₹{svc.payments?.[0]?.due?.toLocaleString('en-IN')}
                        </div>
                      </div>
                      {/* Status select */}
                      <select value={svc.status} onChange={e => updateProgress(selClient.id, svc.id, 'status', e.target.value)}
                        style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6, padding: '5px 10px', fontSize: 12, color: '#c9a84c', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
                        {['In Progress', 'Completed', 'On Hold'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Progress slider */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: '#8a9bb0' }}>Progress: {svc.progress}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={svc.progress}
                        onChange={e => updateProgress(selClient.id, svc.id, 'progress', parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#c9a84c' }} />
                    </div>

                    {/* Steps */}
                    {svc.steps?.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: '#8a9bb0', marginBottom: 8 }}>Steps (click to mark done):</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {svc.steps.map((step, i) => (
                            <div key={i} onClick={() => toggleStep(selClient.id, svc.id, svc, i)}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 6, background: step.done ? 'rgba(29,158,117,0.1)' : 'rgba(201,168,76,0.05)', border: `1px solid ${step.done ? 'rgba(29,158,117,0.2)' : 'rgba(201,168,76,0.1)'}` }}>
                              <span style={{ width: 20, height: 20, borderRadius: '50%', background: step.done ? '#1D9E75' : 'transparent', border: `1px solid ${step.done ? '#1D9E75' : 'rgba(201,168,76,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', flexShrink: 0 }}>{step.done ? '✓' : ''}</span>
                              <span style={{ fontSize: 12, color: step.done ? '#1D9E75' : '#c8d4e0' }}>{step.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Invoices */}
                    {svc.payments?.[0]?.invoices?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, color: '#8a9bb0', marginBottom: 6 }}>Invoices:</div>
                        {svc.payments[0].invoices.map(inv => (
                          <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#0f1e35', borderRadius: 6, marginBottom: 4, fontSize: 12 }}>
                            <span style={{ color: '#c8d4e0' }}>#{inv.invoiceNo} · ₹{inv.amount?.toLocaleString('en-IN')} · {new Date(inv.date).toLocaleDateString('en-IN')}</span>
                            <button onClick={() => window.open('#', '_blank')} style={{ padding: '3px 10px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 5, color: '#c9a84c', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>📄 View</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            )}

            {/* Messages */}
            <Card title="💬 Messages with Client" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <button onClick={() => setAdminMsgSvc(null)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid', borderColor: !adminMsgSvc ? '#c9a84c' : 'rgba(201,168,76,0.2)', background: !adminMsgSvc ? 'rgba(201,168,76,0.1)' : 'transparent', color: !adminMsgSvc ? '#c9a84c' : '#8a9bb0', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>General</button>
                {selClient.services?.map(s => (
                  <button key={s.id} onClick={() => setAdminMsgSvc(s)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid', borderColor: adminMsgSvc?.id === s.id ? '#c9a84c' : 'rgba(201,168,76,0.2)', background: adminMsgSvc?.id === s.id ? 'rgba(201,168,76,0.1)' : 'transparent', color: adminMsgSvc?.id === s.id ? '#c9a84c' : '#8a9bb0', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>{s.title.slice(0, 20)}</button>
                ))}
              </div>
              {/* Messages */}
              <div style={{ height: 300, overflowY: 'auto', background: '#162440', borderRadius: 8, padding: 16, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(adminMsgSvc ? selClient.services?.find(s => s.id === adminMsgSvc.id)?.messages : selClient.messages || [])?.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender === 'admin' ? 'row-reverse' : 'row', gap: 8 }}>
                    <div style={{ background: msg.sender === 'admin' ? 'rgba(201,168,76,0.15)' : '#0f1e35', border: `1px solid ${msg.sender === 'admin' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff', maxWidth: 280 }}>
                      <div style={{ fontSize: 10, color: '#8a9bb0', marginBottom: 4 }}>{msg.sender === 'admin' ? '👤 Admin' : '🙍 Client'}</div>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={adminMsg} onChange={e => setAdminMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAdminMessage()}
                  placeholder="Type reply..." style={{ flex: 1, background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif' }} />
                <button onClick={sendAdminMessage} style={btnGold}>Send</button>
              </div>
            </Card>
          </div>
        )}

        {/* INVOICE SETTINGS */}
        {tab === 'invoice-settings' && (
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Invoice Settings</div>
            <p style={{ fontSize: 14, color: '#8a9bb0', marginBottom: 24 }}>Edit invoice format, bank details, GST and footer text</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Card title="Tax & Legal Info">
                <AField label="GSTIN (optional)" value={invForm.gstin} onChange={v => setInvForm({ ...invForm, gstin: v })} placeholder="e.g. 08ABCDE1234F1Z5" />
                <div style={{ marginTop: 12 }}>
                  <AField label="Invoice Footer Text" value={invForm.invoiceFooter} onChange={v => setInvForm({ ...invForm, invoiceFooter: v })} textarea rows={3} placeholder="Thank you message shown at bottom of invoice" />
                </div>
              </Card>
              <Card title="Bank / Payment Details">
                <AField label="Bank Name" value={invForm.bankName} onChange={v => setInvForm({ ...invForm, bankName: v })} placeholder="e.g. HDFC Bank" />
                <div style={{ marginTop: 10 }}><AField label="Account Number" value={invForm.accountNo} onChange={v => setInvForm({ ...invForm, accountNo: v })} placeholder="Account number" /></div>
                <div style={{ marginTop: 10 }}><AField label="IFSC Code" value={invForm.ifsc} onChange={v => setInvForm({ ...invForm, ifsc: v })} placeholder="e.g. HDFC0001234" /></div>
                <div style={{ marginTop: 10 }}><AField label="UPI ID (optional)" value={invForm.upi} onChange={v => setInvForm({ ...invForm, upi: v })} placeholder="e.g. nyayagrah@upi" /></div>
              </Card>
            </div>
            <div style={{ marginTop: 16 }}>
              <button onClick={saveInvoiceSettings} style={btnGold}>Save Invoice Settings</button>
              {invSaved && <span style={{ fontSize: 12, color: '#1D9E75', marginLeft: 12 }}>✅ Saved!</span>}
            </div>

            {/* Invoice Preview */}
            <Card title="Invoice Preview" style={{ marginTop: 20 }}>
              <div style={{ background: '#fff', borderRadius: 8, padding: 32, color: '#000', fontFamily: 'Arial,sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '2px solid #c9a84c' }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1628' }}>Nyaya Grah</div>
                    <div style={{ fontSize: 11, color: '#666' }}>Legal & Business Solutions</div>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>Bikaner, Rajasthan</div>
                    {invForm.gstin && <div style={{ fontSize: 11, color: '#555' }}>GSTIN: {invForm.gstin}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>INVOICE</div>
                    <div style={{ fontSize: 12, color: '#333' }}>#NG/2025/1234</div>
                    <div style={{ fontSize: 11, color: '#666' }}>Date: {new Date().toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                  <thead><tr style={{ background: '#0a1628', color: '#fff' }}><th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11 }}>Service</th><th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11 }}>Amount</th></tr></thead>
                  <tbody><tr><td style={{ padding: '10px 12px', fontSize: 12 }}>GST Registration</td><td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontWeight: 600 }}>₹2,999</td></tr></tbody>
                  <tfoot><tr style={{ background: '#f8f5ee' }}><td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>Total Paid</td><td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#c9a84c' }}>₹2,999</td></tr></tfoot>
                </table>
                {invForm.accountNo && <div style={{ fontSize: 11, color: '#555', background: '#f8f5ee', padding: 10, borderRadius: 6, marginBottom: 12 }}>Bank: {invForm.bankName} | A/C: {invForm.accountNo} | IFSC: {invForm.ifsc} {invForm.upi && `| UPI: ${invForm.upi}`}</div>}
                <div style={{ borderTop: '2px solid #c9a84c', paddingTop: 10, fontSize: 10, color: '#888', textAlign: 'center' }}>{invForm.invoiceFooter}</div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function Card({ title, children, style }) {
  return (
    <div style={{ background: '#0f1e35', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 22, ...style }}>
      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontWeight: 600, color: '#c9a84c', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  )
}

function AField({ label, value, onChange, textarea = false, rows = 2, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={lbl}>{label}</label>}
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} {...props} style={{ ...inp, resize: 'vertical' }} />
        : <input value={value} onChange={e => onChange(e.target.value)} {...props} style={inp} />
      }
    </div>
  )
}

const inp = { background: '#162440', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fff', outline: 'none', fontFamily: 'DM Sans,sans-serif', width: '100%' }
const lbl = { fontSize: 11, color: '#8a9bb0' }
const sel = { ...inp, cursor: 'pointer' }
const btnGold = { background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0a1628', padding: '10px 22px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 13, fontFamily: 'DM Sans,sans-serif' }

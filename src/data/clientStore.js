// ─── Central Data Store (localStorage based) ─────────────────────
// In production, replace with a real database (Supabase/MongoDB)

export const DEFAULT_CLIENT_PASSWORD = '666666'

export function getClients() {
  if (typeof window === 'undefined') return []
  const d = localStorage.getItem('ng_clients')
  return d ? JSON.parse(d) : []
}

export function saveClients(clients) {
  localStorage.setItem('ng_clients', JSON.stringify(clients))
}

export function getClientByMobile(mobile) {
  return getClients().find(c => c.mobile === mobile)
}

export function getClientById(id) {
  return getClients().find(c => c.id === id)
}

export function registerClient(data) {
  const clients = getClients()
  if (clients.find(c => c.mobile === data.mobile)) return { error: 'Mobile already registered' }
  const client = {
    id: 'CL' + Date.now(),
    name: data.name,
    mobile: data.mobile,
    email: data.email || '',
    password: DEFAULT_CLIENT_PASSWORD,
    createdAt: new Date().toISOString(),
    services: [],
    messages: [],
  }
  clients.push(client)
  saveClients(clients)
  return { success: true, client }
}

export function loginClient(mobile, password) {
  const client = getClientByMobile(mobile)
  if (!client) return { error: 'Mobile not registered' }
  if (client.password !== password) return { error: 'Incorrect password' }
  sessionStorage.setItem('ng_client_id', client.id)
  return { success: true, client }
}

export function logoutClient() {
  sessionStorage.removeItem('ng_client_id')
}

export function getCurrentClient() {
  if (typeof window === 'undefined') return null
  const id = sessionStorage.getItem('ng_client_id')
  if (!id) return null
  return getClientById(id)
}

// ─── Services ──────────────────────────────────────────────────────
export function getClientServices(clientId) {
  const client = getClientById(clientId)
  return client?.services || []
}

export function addServiceToClient(clientId, service) {
  const clients = getClients()
  const idx = clients.findIndex(c => c.id === clientId)
  if (idx === -1) return
  const svc = {
    id: 'SVC' + Date.now(),
    title: service.title,
    category: service.category,
    startDate: new Date().toISOString(),
    status: 'In Progress', // In Progress | Completed | On Hold
    progress: 0, // 0-100
    notes: service.notes || '',
    timeline: service.timeline || '',
    payments: [{
      id: 'PAY' + Date.now(),
      amount: parseFloat(service.totalAmount) || 0,
      paid: 0,
      due: parseFloat(service.totalAmount) || 0,
      status: 'Pending', // Pending | Partial | Paid
      invoices: [],
      transactions: [],
    }],
    documents: [],
    messages: [],
    steps: service.steps || [],
  }
  clients[idx].services.push(svc)
  saveClients(clients)
  return svc
}

export function updateServiceProgress(clientId, serviceId, updates) {
  const clients = getClients()
  const ci = clients.findIndex(c => c.id === clientId)
  if (ci === -1) return
  const si = clients[ci].services.findIndex(s => s.id === serviceId)
  if (si === -1) return
  clients[ci].services[si] = { ...clients[ci].services[si], ...updates }
  saveClients(clients)
}

// ─── Payments ──────────────────────────────────────────────────────
export function recordPayment(clientId, serviceId, amount, mode, txnId) {
  const clients = getClients()
  const ci = clients.findIndex(c => c.id === clientId)
  if (ci === -1) return
  const si = clients[ci].services.findIndex(s => s.id === serviceId)
  if (si === -1) return
  const pay = clients[ci].services[si].payments[0]
  const txn = {
    id: 'TXN' + Date.now(),
    amount: parseFloat(amount),
    mode,
    txnId,
    date: new Date().toISOString(),
    status: 'Confirmed',
  }
  pay.transactions.push(txn)
  pay.paid += parseFloat(amount)
  pay.due = pay.amount - pay.paid
  pay.status = pay.due <= 0 ? 'Paid' : pay.paid > 0 ? 'Partial' : 'Pending'
  // Auto generate invoice
  const invoice = generateInvoice(clients[ci], clients[ci].services[si], txn)
  pay.invoices.push(invoice)
  saveClients(clients)
  return invoice
}

export function generateInvoice(client, service, txn) {
  const settings = JSON.parse(localStorage.getItem('ng_settings') || '{}')
  return {
    id: 'INV' + Date.now(),
    invoiceNo: 'NG/' + new Date().getFullYear() + '/' + Math.floor(Math.random() * 9000 + 1000),
    date: new Date().toISOString(),
    clientName: client.name,
    clientMobile: client.mobile,
    clientEmail: client.email,
    serviceName: service.title,
    amount: txn.amount,
    txnId: txn.txnId,
    mode: txn.mode,
    firmName: settings.brandName || 'Nyaya Grah',
    firmPhone: settings.phone1 || '7878407950',
    firmEmail: settings.email || 'info@nyayagrah.com',
    firmAddress: settings.addressBikaner || 'Bikaner, Rajasthan',
    gstin: settings.gstin || '',
    status: 'Paid',
  }
}

// ─── Documents ─────────────────────────────────────────────────────
export function addDocument(clientId, serviceId, doc) {
  const clients = getClients()
  const ci = clients.findIndex(c => c.id === clientId)
  if (ci === -1) return
  const si = clients[ci].services.findIndex(s => s.id === serviceId)
  if (si === -1) return
  const document = { id: 'DOC' + Date.now(), ...doc, uploadedAt: new Date().toISOString() }
  clients[ci].services[si].documents.push(document)
  saveClients(clients)
  return document
}

// ─── Messages ──────────────────────────────────────────────────────
export function addMessage(clientId, serviceId, text, sender) {
  const clients = getClients()
  const ci = clients.findIndex(c => c.id === clientId)
  if (ci === -1) return
  const si = clients[ci].services.findIndex(s => s.id === serviceId)
  const msg = { id: 'MSG' + Date.now(), text, sender, time: new Date().toISOString(), read: false }
  if (si === -1) {
    // Global message
    if (!clients[ci].messages) clients[ci].messages = []
    clients[ci].messages.push(msg)
  } else {
    clients[ci].services[si].messages.push(msg)
  }
  saveClients(clients)
  return msg
}

export function getInvoiceSettings() {
  const s = JSON.parse(localStorage.getItem('ng_settings') || '{}')
  return {
    firmName: s.brandName || 'Nyaya Grah',
    firmTagline: s.tagline || 'Legal & Business Solutions',
    phone1: s.phone1 || '7878407950',
    phone2: s.phone2 || '6350136833',
    email: s.email || 'info@nyayagrah.com',
    address: s.addressBikaner || 'Opp. Vivekananda School, Murti Circle, JNV Colony, Bikaner, Rajasthan',
    gstin: s.gstin || '',
    logoUrl: s.logoUrl || '/logo.png',
    invoiceFooter: s.invoiceFooter || 'Thank you for choosing Nyaya Grah. For any queries, contact us at info@nyayagrah.com',
    bankName: s.bankName || '',
    accountNo: s.accountNo || '',
    ifsc: s.ifsc || '',
    upi: s.upi || '',
  }
}

// ─── Payment Gateway Settings ─────────────────────────────────────
export function getPaymentSettings() {
  if (typeof window === 'undefined') return { mode: 'manual' }
  const s = JSON.parse(localStorage.getItem('ng_settings') || '{}')
  return {
    mode: s.paymentMode || 'manual', // 'razorpay' | 'manual'
    razorpayKeyId: s.razorpayKeyId || '',
    razorpayKeySecret: s.razorpayKeySecret || '',
    upiId: s.upiId || '',
    upiName: s.upiName || 'Nyaya Grah',
    bankName: s.bankName || '',
    accountNo: s.accountNo || '',
    ifsc: s.ifsc || '',
    manualInstructions: s.manualInstructions || 'Please pay via UPI/Bank Transfer and share the transaction ID with us.',
  }
}

export function savePaymentSettings(data) {
  const s = JSON.parse(localStorage.getItem('ng_settings') || '{}')
  const updated = { ...s, ...data }
  localStorage.setItem('ng_settings', JSON.stringify(updated))
}

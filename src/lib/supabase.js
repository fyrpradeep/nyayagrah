import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://luxhckglcybwbpwrnors.supabase.co'
const supabaseKey = 'sb_publishable_fknsfc0otgO2UIFie_G01A_9YpcxTWa'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Settings ─────────────────────────────────────────────────────
export async function getSettings() {
  const { data } = await supabase.from('settings').select('*').eq('id', 'main').single()
  return data || {}
}

export async function updateSettings(updates) {
  const { data, error } = await supabase.from('settings').upsert({ id: 'main', ...updates, updated_at: new Date().toISOString() })
  return { data, error }
}

// ─── Blogs ────────────────────────────────────────────────────────
export async function getBlogs() {
  const { data } = await supabase.from('blogs').select('*').eq('published', true).order('created_at', { ascending: false })
  return data || []
}

export async function addBlog(blog) {
  const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
  const { data, error } = await supabase.from('blogs').insert([{ ...blog, slug }]).select()
  return { data, error }
}

export async function deleteBlog(id) {
  const { error } = await supabase.from('blogs').delete().eq('id', id)
  return { error }
}

// ─── Custom Services ──────────────────────────────────────────────
export async function getCustomServices() {
  const { data } = await supabase.from('services_custom').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function addCustomService(svc) {
  const slug = svc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
  const { data, error } = await supabase.from('services_custom').insert([{ ...svc, slug }]).select()
  return { data, error }
}

export async function updateCustomService(id, updates) {
  const { data, error } = await supabase.from('services_custom').update(updates).eq('id', id).select()
  return { data, error }
}

export async function deleteCustomService(id) {
  const { error } = await supabase.from('services_custom').delete().eq('id', id)
  return { error }
}

// ─── Clients ──────────────────────────────────────────────────────
export async function getClients() {
  const { data } = await supabase.from('clients').select('*, client_services(*)').order('created_at', { ascending: false })
  return data || []
}

export async function getClientByMobile(mobile) {
  const { data } = await supabase.from('clients').select('*, client_services(*, messages(*), documents(*))').eq('mobile', mobile).single()
  return data
}

export async function getClientById(id) {
  const { data } = await supabase.from('clients').select('*, client_services(*, messages(*), documents(*))').eq('id', id).single()
  return data
}

export async function createClient_db(clientData) {
  const id = 'CL' + Date.now()
  const { data, error } = await supabase.from('clients').insert([{ id, ...clientData }]).select()
  return { data: data?.[0], error }
}

export async function updateClientPassword(id, password) {
  const { error } = await supabase.from('clients').update({ password }).eq('id', id)
  return { error }
}

// ─── Client Services ──────────────────────────────────────────────
export async function addServiceToClient_db(clientId, service) {
  const id = 'SVC' + Date.now()
  const { data, error } = await supabase.from('client_services').insert([{
    id, client_id: clientId,
    title: service.title, category: service.category,
    timeline: service.timeline, notes: service.notes || '',
    total_amount: parseFloat(service.totalAmount) || 0,
    paid_amount: 0,
    due_amount: parseFloat(service.totalAmount) || 0,
    steps: service.steps || [],
  }]).select()
  return { data: data?.[0], error }
}

export async function updateService_db(serviceId, updates) {
  const { data, error } = await supabase.from('client_services').update(updates).eq('id', serviceId).select()
  return { data, error }
}

// ─── Transactions ─────────────────────────────────────────────────
export async function recordTransaction(clientId, serviceId, amount, mode, txnId) {
  const id = 'TXN' + Date.now()
  const invoiceNo = 'NG/' + new Date().getFullYear() + '/' + Math.floor(Math.random() * 9000 + 1000)

  // Insert transaction
  const { error: txnError } = await supabase.from('transactions').insert([{
    id, client_id: clientId, client_service_id: serviceId,
    amount: parseFloat(amount), mode, txn_id: txnId, invoice_no: invoiceNo, status: 'Confirmed'
  }])
  if (txnError) return { error: txnError }

  // Update service payment amounts
  const { data: svc } = await supabase.from('client_services').select('paid_amount, total_amount').eq('id', serviceId).single()
  if (svc) {
    const newPaid = (svc.paid_amount || 0) + parseFloat(amount)
    const newDue = (svc.total_amount || 0) - newPaid
    await supabase.from('client_services').update({ paid_amount: newPaid, due_amount: Math.max(0, newDue) }).eq('id', serviceId)
  }

  return { invoiceNo, id }
}

export async function getTransactions(clientId) {
  const { data } = await supabase.from('transactions').select('*').eq('client_id', clientId).order('created_at', { ascending: false })
  return data || []
}

// ─── Messages ─────────────────────────────────────────────────────
export async function sendMessage_db(clientId, serviceId, text, sender) {
  const { data, error } = await supabase.from('messages').insert([{
    client_id: clientId, service_id: serviceId || null, text, sender
  }]).select()
  return { data, error }
}

export async function getMessages(clientId, serviceId) {
  let query = supabase.from('messages').select('*').eq('client_id', clientId).order('created_at', { ascending: true })
  if (serviceId) query = query.eq('service_id', serviceId)
  else query = query.is('service_id', null)
  const { data } = await query
  return data || []
}

// ─── Documents ────────────────────────────────────────────────────
export async function uploadDocument_db(clientId, serviceId, doc) {
  const id = 'DOC' + Date.now()
  const { data, error } = await supabase.from('documents').insert([{
    id, client_id: clientId, service_id: serviceId || null,
    name: doc.name, size: doc.size, file_type: doc.type,
    data: doc.data, uploaded_by: doc.uploadedBy || 'client'
  }]).select()
  return { data, error }
}

export async function getDocuments(clientId, serviceId) {
  let query = supabase.from('documents').select('*').eq('client_id', clientId)
  if (serviceId) query = query.eq('service_id', serviceId)
  const { data } = await query
  return data || []
}

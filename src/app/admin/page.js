'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getSettings, updateSettings, getBlogs, addBlog, deleteBlog, getCustomServices, addCustomService, updateCustomService, deleteCustomService } from '../../lib/supabase'

const ADMIN_PASS = 'nyayagrah2025'

const defaultSettings = {
  phone1: '7878407950', phone2: '6350136833', whatsapp: '6350136833',
  email: 'info@nyayagrah.com', brand_name: 'Nyaya Grah',
  tagline: 'Legal & Business Solutions',
  hero_title: 'Your Trusted Legal & Business Partner',
  address_bikaner: 'Opp. Vivekananda School, Murti Circle, JNV Colony, Bikaner, Rajasthan',
  address_jaipur: 'B-301, Maruti Nagar, Sanganer, Jaipur, Rajasthan',
  gstin: '', bank_name: '', account_no: '', ifsc: '', upi_id: '',
  payment_mode: 'manual', razorpay_key_id: '',
  invoice_footer: 'Thank you for choosing Nyaya Grah.',
}

const cats = ['registration','compliance','tax','ipr','legal','digital','ngo']
const tabs = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'branding', icon: '🎨', label: 'Branding' },
  { key: 'contact', icon: '📞', label: 'Contact Details' },
  { key: 'services', icon: '⚙️', label: 'Services' },
  { key: 'blog', icon: '📝', label: 'Blog Posts' },
  { key: 'write', icon: '✍️', label: 'Write Blog' },
  { key: 'gateway', icon: '💳', label: 'Payment Gateway' },
  { key: 'legal', icon: '⚖️', label: 'Privacy & Terms' },
]

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)
  const [tab, setTab] = useState('dashboard')
  const [settings, setSettings] = useState(defaultSettings)
  const [blogs, setBlogs] = useState([])
  const [services, setServices] = useState([])
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', category: 'Registration', excerpt: '', content: '', author: 'Nyaya Grah Team' })
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)
  const [newSvc, setNewSvc] = useState({ title: '', category: 'registration', icon: '📋', tagline: '', price: '', timeline: '' })
  const [editSvc, setEditSvc] = useState(null)
  const logoRef = useRef()

  useEffect(() => {
    if (auth) loadAll()
  }, [auth])

  async function loadAll() {
    setLoading(true)
    const [s, b, sv] = await Promise.all([getSettings(), getBlogs(), getCustomServices()])
    if (s) setSettings({ ...defaultSettings, ...s })
    setBlogs(b)
    setServices(sv)
    setLoading(false)
  }

  async function saveSettings() {
    const { error } = await updateSettings(settings)
    if (!error) { setSaved('settings'); setTimeout(() => setSaved(''), 2000) }
  }

  async function publishBlog(e) {
    e.preventDefault()
    setPosting(true)
    const { error } = await addBlog(newPost)
    if (!error) {
      setPosted(true)
      setNewPost({ title: '', category: 'Registration', excerpt: '', content: '', author: 'Nyaya Grah Team' })
      loadAll()
      setTimeout(() => { setPosted(false) }, 3000)
    }
    setPosting(false)
  }

  async function handleDeleteBlog(id) {
    if (!confirm('Delete this blog post?')) return
    await deleteBlog(id)
    loadAll()
  }

  async function handleAddService(e) {
    e.preventDefault()
    await addCustomService(newSvc)
    setNewSvc({ title: '', category: 'registration', icon: '📋', tagline: '', price: '', timeline: '' })
    loadAll()
  }

  async function handleUpdateService(id, updates) {
    await updateCustomService(id, updates)
    setEditSvc(null)
    loadAll()
  }

  async function handleDeleteService(id) {
    if (!confirm('Delete this service?')) return
    await deleteCustomService(id)
    loadAll()
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setSettings({ ...settings, logo_url: ev.target.result })
    reader.readAsDataURL(file)
  }

  if (!auth) {
    return (
      <div style={{minHeight:'100vh',background:'#0a1628',display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
        <div style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.25)',borderRadius:16,padding:40,width:'100%',maxWidth:420}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
            <img src="/logo.png" alt="Nyaya Grah" style={{width:48,height:48,borderRadius:8,objectFit:'cover'}} />
            <div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:700,color:'#c9a84c'}}>Nyaya Grah</div>
              <div style={{fontSize:11,color:'#8a9bb0',letterSpacing:1}}>ADMIN PANEL</div>
            </div>
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:28,fontWeight:600,color:'#fff',marginBottom:6}}>Admin Login</h2>
          <p style={{fontSize:13,color:'#8a9bb0',marginBottom:24}}>Enter your admin password to continue.</p>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin password" onKeyDown={e=>e.key==='Enter'&&(pass===ADMIN_PASS?(setAuth(true),setErr(false)):setErr(true))}
            style={{width:'100%',background:'#162440',border:'1px solid rgba(201,168,76,0.2)',borderRadius:8,padding:'12px 16px',fontSize:14,color:'#fff',outline:'none',fontFamily:'DM Sans,sans-serif',marginBottom:8}} />
          {err && <p style={{fontSize:12,color:'#e24b4a',marginBottom:8}}>Incorrect password.</p>}
          <button onClick={()=>pass===ADMIN_PASS?(setAuth(true),setErr(false)):setErr(true)}
            style={{width:'100%',background:'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:13,borderRadius:8,border:'none',cursor:'pointer',fontWeight:500,fontSize:14,fontFamily:'DM Sans,sans-serif',marginBottom:16}}>
            Login to Admin Panel
          </button>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <Link href="/" style={{fontSize:12,color:'#8a9bb0',textDecoration:'none'}}>← Website</Link>
            <Link href="/admin/clients" style={{fontSize:12,color:'#c9a84c',textDecoration:'none'}}>Client Management →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:'#0a1628',display:'flex'}}>
      {/* Sidebar */}
      <div style={{width:220,background:'#0f1e35',borderRight:'1px solid rgba(201,168,76,0.15)',position:'fixed',top:0,bottom:0,left:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'20px 16px',borderBottom:'1px solid rgba(201,168,76,0.15)',display:'flex',alignItems:'center',gap:10}}>
          <img src={settings.logo_url||'/logo.png'} alt="Logo" style={{width:36,height:36,borderRadius:6,objectFit:'cover'}} />
          <div>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:15,fontWeight:700,color:'#c9a84c'}}>{settings.brand_name||'Nyaya Grah'}</div>
            <div style={{fontSize:9,color:'#8a9bb0',letterSpacing:1}}>ADMIN</div>
          </div>
        </div>
        <nav style={{flex:1,padding:'12px 10px',overflowY:'auto'}}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{width:'100%',textAlign:'left',padding:'10px 12px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:12,color:tab===t.key?'#c9a84c':'#8a9bb0',background:tab===t.key?'rgba(201,168,76,0.1)':'transparent',marginBottom:2,display:'flex',alignItems:'center',gap:8}}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
          <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid rgba(201,168,76,0.1)'}}>
            <Link href="/admin/clients" style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:8,fontSize:12,color:'#8a9bb0',textDecoration:'none'}}>
              👥 Client Management
            </Link>
            <Link href="/admin/payment-gateway" style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:8,fontSize:12,color:'#8a9bb0',textDecoration:'none'}}>
              💳 Payment Gateway
            </Link>
          </div>
        </nav>
        <div style={{padding:'12px 10px',borderTop:'1px solid rgba(201,168,76,0.15)'}}>
          <Link href="/" style={{display:'block',textAlign:'center',padding:'8px',fontSize:11,color:'#8a9bb0',textDecoration:'none',borderRadius:6,border:'1px solid rgba(201,168,76,0.15)',marginBottom:6}}>← Website</Link>
          <button onClick={()=>{setAuth(false);setPass('')}} style={{width:'100%',padding:'8px',fontSize:11,color:'#e24b4a',background:'transparent',border:'1px solid rgba(226,75,74,0.2)',borderRadius:6,cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>Logout</button>
        </div>
      </div>

      {/* Main */}
      <div style={{marginLeft:220,flex:1,padding:'28px'}}>
        {loading && <div style={{textAlign:'center',padding:40,color:'#c9a84c',fontSize:14}}>Loading from database...</div>}

        {/* DASHBOARD */}
        {tab==='dashboard' && !loading && (
          <div>
            <H1>Dashboard</H1>
            <p style={{fontSize:14,color:'#8a9bb0',marginBottom:28}}>✅ Connected to Supabase — changes save instantly to live website!</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
              {[['📝','Blog Posts',blogs.length,'Live'],['⚙️','Custom Services',services.length,'Active'],['📞','Phone','+91 '+settings.phone1,'Primary'],['✉️','Email',settings.email,'Contact']].map(([icon,t,v,s])=>(
                <div key={t} style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.15)',borderRadius:12,padding:20}}>
                  <div style={{fontSize:26,marginBottom:8}}>{icon}</div>
                  <div style={{fontSize:10,color:'#8a9bb0',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>{t}</div>
                  <div style={{fontSize:14,fontWeight:500,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</div>
                  <div style={{fontSize:11,color:'#1D9E75',marginTop:4}}>{s} ✓</div>
                </div>
              ))}
            </div>
            <div style={{background:'rgba(29,158,117,0.1)',border:'1px solid rgba(29,158,117,0.2)',borderRadius:12,padding:20}}>
              <div style={{fontSize:14,fontWeight:500,color:'#1D9E75',marginBottom:8}}>🟢 Database Connected — Supabase</div>
              <div style={{fontSize:13,color:'#8a9bb0'}}>Admin mein jo bhi change karoge — phone, blog, services — seedha live website par dikhega. Koi deploy nahi karna!</div>
            </div>
          </div>
        )}

        {/* BRANDING */}
        {tab==='branding' && !loading && (
          <div>
            <H1>Branding</H1>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              <Card title="Logo">
                <div style={{textAlign:'center',marginBottom:16}}>
                  <img src={settings.logo_url||'/logo.png'} alt="Logo" style={{width:120,height:120,borderRadius:12,objectFit:'cover',border:'2px solid rgba(201,168,76,0.3)',marginBottom:12}} />
                </div>
                <input type="file" accept="image/*" ref={logoRef} onChange={handleLogoUpload} style={{display:'none'}} />
                <button onClick={()=>logoRef.current.click()} style={btnGold}>📁 Upload New Logo</button>
              </Card>
              <Card title="Brand Identity">
                <AField label="Brand Name" value={settings.brand_name||''} onChange={v=>setSettings({...settings,brand_name:v})} />
                <div style={{marginTop:12}}><AField label="Tagline" value={settings.tagline||''} onChange={v=>setSettings({...settings,tagline:v})} /></div>
                <div style={{marginTop:12}}><AField label="Hero Title" value={settings.hero_title||''} onChange={v=>setSettings({...settings,hero_title:v})} /></div>
              </Card>
            </div>
            <button onClick={saveSettings} style={{...btnGold,marginTop:16}}>💾 Save Branding</button>
            {saved==='settings' && <SavedMsg />}
          </div>
        )}

        {/* CONTACT */}
        {tab==='contact' && !loading && (
          <div>
            <H1>Contact Details</H1>
            <Card title="Phone & Email">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <AField label="Phone 1 *" value={settings.phone1||''} onChange={v=>setSettings({...settings,phone1:v})} prefix="+91" />
                <AField label="Phone 2" value={settings.phone2||''} onChange={v=>setSettings({...settings,phone2:v})} prefix="+91" />
                <AField label="WhatsApp" value={settings.whatsapp||''} onChange={v=>setSettings({...settings,whatsapp:v})} prefix="+91" />
                <AField label="Email" value={settings.email||''} onChange={v=>setSettings({...settings,email:v})} type="email" />
              </div>
            </Card>
            <Card title="Office Addresses" style={{marginTop:16}}>
              <AField label="Bikaner Office" value={settings.address_bikaner||''} onChange={v=>setSettings({...settings,address_bikaner:v})} textarea />
              <div style={{marginTop:12}}><AField label="Jaipur Office" value={settings.address_jaipur||''} onChange={v=>setSettings({...settings,address_jaipur:v})} textarea /></div>
            </Card>
            <button onClick={saveSettings} style={{...btnGold,marginTop:16}}>💾 Save Contact Details</button>
            {saved==='settings' && <SavedMsg />}
          </div>
        )}

        {/* SERVICES */}
        {tab==='services' && !loading && (
          <div>
            <H1>Custom Services</H1>
            <p style={{fontSize:14,color:'#8a9bb0',marginBottom:24}}>Yahan add ki gayi services website par dikhegi.</p>
            <Card title="Add New Service" style={{marginBottom:20}}>
              <form onSubmit={handleAddService}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  <AField label="Title *" value={newSvc.title} onChange={v=>setNewSvc({...newSvc,title:v})} placeholder="Service name" required />
                  <AField label="Icon (emoji)" value={newSvc.icon} onChange={v=>setNewSvc({...newSvc,icon:v})} placeholder="🏢" />
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    <label style={lbl}>Category</label>
                    <select value={newSvc.category} onChange={e=>setNewSvc({...newSvc,category:e.target.value})} style={sel}>{cats.map(c=><option key={c}>{c}</option>)}</select>
                  </div>
                  <AField label="Tagline" value={newSvc.tagline} onChange={v=>setNewSvc({...newSvc,tagline:v})} placeholder="Short description" />
                  <AField label="Price" value={newSvc.price} onChange={v=>setNewSvc({...newSvc,price:v})} placeholder="e.g. Starting ₹2,999" />
                  <AField label="Timeline" value={newSvc.timeline} onChange={v=>setNewSvc({...newSvc,timeline:v})} placeholder="e.g. 7-10 days" />
                </div>
                <button type="submit" style={{...btnGold,marginTop:14}}>Add Service</button>
              </form>
            </Card>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {services.map(s=>(
                <div key={s.id} style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.15)',borderRadius:10,padding:'14px 18px',display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:22}}>{s.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500,color:'#fff'}}>{s.title}</div>
                    <div style={{fontSize:11,color:'#8a9bb0'}}>{s.category} {s.price&&'· '+s.price} {s.timeline&&'· '+s.timeline}</div>
                  </div>
                  <button onClick={()=>handleDeleteService(s.id)} style={{padding:'5px 12px',background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.2)',borderRadius:6,color:'#e24b4a',fontSize:11,cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOG */}
        {tab==='blog' && !loading && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
              <div><H1>Blog Posts</H1><p style={{fontSize:14,color:'#8a9bb0'}}>{blogs.length} posts live on website</p></div>
              <button onClick={()=>setTab('write')} style={btnGold}>+ Write New Post</button>
            </div>
            {blogs.length===0
              ? <div style={{textAlign:'center',padding:60,background:'#0f1e35',borderRadius:12,border:'1px solid rgba(201,168,76,0.15)',color:'#8a9bb0'}}>No blog posts yet.</div>
              : <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {blogs.map(b=>(
                  <div key={b.id} style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.15)',borderRadius:10,padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',gap:8,marginBottom:5}}>
                        <span style={{background:'rgba(201,168,76,0.15)',color:'#c9a84c',padding:'2px 8px',borderRadius:100,fontSize:10}}>{b.category}</span>
                        <span style={{fontSize:11,color:'#8a9bb0'}}>{new Date(b.created_at).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div style={{fontSize:14,fontWeight:500,color:'#fff'}}>{b.title}</div>
                      <div style={{fontSize:12,color:'#8a9bb0'}}>{b.author}</div>
                    </div>
                    <button onClick={()=>handleDeleteBlog(b.id)} style={{padding:'7px 14px',background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.2)',borderRadius:7,color:'#e24b4a',fontSize:12,cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>Delete</button>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {/* WRITE */}
        {tab==='write' && (
          <div>
            <H1>Write Blog Post</H1>
            <Card title="New Article">
              <form onSubmit={publishBlog}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:14}}>
                  <div style={{gridColumn:'1/-1'}}><AField label="Blog Title *" value={newPost.title} onChange={v=>setNewPost({...newPost,title:v})} placeholder="Enter blog title" required /></div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    <label style={lbl}>Category</label>
                    <select value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})} style={sel}>
                      {['Registration','Compliance','Taxation','IPR','Legal','Digital','NGO'].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <AField label="Author" value={newPost.author} onChange={v=>setNewPost({...newPost,author:v})} />
                  <div style={{gridColumn:'1/-1'}}><AField label="Short Excerpt *" value={newPost.excerpt} onChange={v=>setNewPost({...newPost,excerpt:v})} placeholder="2-3 sentence summary..." textarea required rows={3} /></div>
                  <div style={{gridColumn:'1/-1'}}><AField label="Full Content *" value={newPost.content} onChange={v=>setNewPost({...newPost,content:v})} placeholder="Write full article..." textarea required rows={12} /></div>
                </div>
                <button type="submit" disabled={posting} style={{...btnGold,opacity:posting?0.7:1}}>
                  {posting?'Publishing...':posted?'✓ Published!':'Publish Article'}
                </button>
              </form>
            </Card>
          </div>
        )}

        {/* GATEWAY */}
        {tab==='gateway' && (
          <div>
            <H1>Payment Gateway</H1>
            <Card title="Gateway Settings">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <label style={lbl}>Payment Mode</label>
                  <select value={settings.payment_mode||'manual'} onChange={e=>setSettings({...settings,payment_mode:e.target.value})} style={sel}>
                    <option value="manual">Manual (UPI/Bank Transfer)</option>
                    <option value="razorpay">Razorpay (Online)</option>
                  </select>
                </div>
                <AField label="Razorpay Key ID" value={settings.razorpay_key_id||''} onChange={v=>setSettings({...settings,razorpay_key_id:v})} placeholder="rzp_live_..." />
                <AField label="UPI ID" value={settings.upi_id||''} onChange={v=>setSettings({...settings,upi_id:v})} placeholder="nyayagrah@upi" />
                <AField label="Bank Name" value={settings.bank_name||''} onChange={v=>setSettings({...settings,bank_name:v})} placeholder="HDFC Bank" />
                <AField label="Account Number" value={settings.account_no||''} onChange={v=>setSettings({...settings,account_no:v})} />
                <AField label="IFSC Code" value={settings.ifsc||''} onChange={v=>setSettings({...settings,ifsc:v})} />
              </div>
              <button onClick={saveSettings} style={{...btnGold,marginTop:16}}>💾 Save Gateway Settings</button>
              {saved==='settings' && <SavedMsg />}
            </Card>
          </div>
        )}

        {/* LEGAL */}
        {tab==='legal' && (
          <div>
            <H1>Privacy & Terms</H1>
            <p style={{fontSize:14,color:'#8a9bb0',marginBottom:24}}>Edit legal pages content.</p>
            <Card title="Privacy Policy">
              <AField label="" value={settings.privacy_policy||''} onChange={v=>setSettings({...settings,privacy_policy:v})} textarea rows={10} placeholder="Privacy policy content..." />
            </Card>
            <Card title="Terms of Use" style={{marginTop:16}}>
              <AField label="" value={settings.terms_of_use||''} onChange={v=>setSettings({...settings,terms_of_use:v})} textarea rows={10} placeholder="Terms of use content..." />
            </Card>
            <button onClick={saveSettings} style={{...btnGold,marginTop:16}}>💾 Save Legal Pages</button>
            {saved==='settings' && <SavedMsg />}
          </div>
        )}
      </div>
    </div>
  )
}

function H1({children}) {
  return <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:34,fontWeight:600,color:'#fff',marginBottom:6}}>{children}</h1>
}
function Card({title,children,style}) {
  return (
    <div style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.18)',borderRadius:12,padding:24,...style}}>
      {title && <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:20,fontWeight:600,color:'#c9a84c',marginBottom:18}}>{title}</h3>}
      {children}
    </div>
  )
}
function SavedMsg() {
  return <div style={{fontSize:12,color:'#1D9E75',marginTop:10}}>✅ Saved to database!</div>
}
function AField({label,value,onChange,prefix,type='text',textarea=false,placeholder='',required=false,rows=3}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {label && <label style={lbl}>{label}</label>}
      <div style={{display:'flex'}}>
        {prefix && <span style={{background:'#0a1628',border:'1px solid rgba(201,168,76,0.2)',borderRight:'none',borderRadius:'8px 0 0 8px',padding:'11px 12px',fontSize:13,color:'#8a9bb0'}}>{prefix}</span>}
        {textarea
          ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required} rows={rows} style={{...inp,resize:'vertical',borderRadius:prefix?'0 8px 8px 0':8}} />
          : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required} style={{...inp,borderRadius:prefix?'0 8px 8px 0':8}} />
        }
      </div>
    </div>
  )
}
const inp = {background:'#162440',border:'1px solid rgba(201,168,76,0.2)',padding:'11px 16px',fontSize:14,color:'#fff',fontFamily:'DM Sans,sans-serif',outline:'none',width:'100%'}
const lbl = {fontSize:12,color:'#8a9bb0',display:'block'}
const sel = {...inp,borderRadius:8,cursor:'pointer'}
const btnGold = {background:'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:'10px 22px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:500,fontSize:13,fontFamily:'DM Sans,sans-serif',display:'inline-block'}

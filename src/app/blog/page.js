'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat'

const defaultBlogs = [
  { id: 1, title: 'How to Register a Private Limited Company in India 2025', slug: 'pvt-ltd-registration-2025', category: 'Registration', date: '2025-01-10', excerpt: 'A complete step-by-step guide to registering your Private Limited Company in India — documents, process, costs and timeline explained.', author: 'CA Team, Nyaya Grah', readTime: '5 min read' },
  { id: 2, title: 'GST Return Filing: Complete Guide for Businesses', slug: 'gst-return-filing-guide', category: 'Taxation', date: '2025-01-08', excerpt: 'Everything you need to know about GST return filing — GSTR-1, GSTR-3B, annual returns, due dates and penalties.', author: 'CA Team, Nyaya Grah', readTime: '7 min read' },
  { id: 3, title: 'Trademark Registration in India: Protect Your Brand', slug: 'trademark-registration-guide', category: 'IPR', date: '2025-01-05', excerpt: 'Your brand is your biggest asset. Learn how to register a trademark in India, choose the right class and protect your brand legally.', author: 'Advocate Team, Nyaya Grah', readTime: '6 min read' },
  { id: 4, title: 'Annual Compliance for Private Limited Companies', slug: 'annual-compliance-pvt-ltd', category: 'Compliance', date: '2025-01-02', excerpt: 'A checklist of all annual compliance requirements for Private Limited Companies in India — ROC filings, AGM, audit and more.', author: 'CS Team, Nyaya Grah', readTime: '4 min read' },
]

const ADMIN_PASS = 'nyayagrah2025'

export default function BlogPage() {
  const [blogs, setBlogs] = useState(defaultBlogs)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminAuth, setAdminAuth] = useState(false)
  const [passInput, setPassInput] = useState('')
  const [passErr, setPassErr] = useState(false)
  const [newPost, setNewPost] = useState({ title:'', category:'Registration', excerpt:'', content:'', author:'Nyaya Grah Team' })
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ng_blogs')
    if (saved) setBlogs([...JSON.parse(saved), ...defaultBlogs].reduce((acc,b) => acc.find(x=>x.id===b.id)?acc:[...acc,b], []))
  }, [])

  const cats = ['All', 'Registration', 'Compliance', 'Taxation', 'IPR', 'Legal', 'Digital', 'NGO']
  const filtered = blogs.filter(b => (cat==='All'||b.category===cat) && (b.title.toLowerCase().includes(search.toLowerCase())||b.excerpt.toLowerCase().includes(search.toLowerCase())))

  function handleAdminLogin() {
    if (passInput === ADMIN_PASS) { setAdminAuth(true); setPassErr(false) }
    else { setPassErr(true) }
  }

  function handlePost(e) {
    e.preventDefault()
    setPosting(true)
    const post = { ...newPost, id: Date.now(), date: new Date().toISOString().split('T')[0], slug: newPost.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'), readTime: '3 min read' }
    const updated = [post, ...blogs]
    setBlogs(updated)
    const custom = updated.filter(b => !defaultBlogs.find(d=>d.id===b.id))
    localStorage.setItem('ng_blogs', JSON.stringify(custom))
    setTimeout(() => { setPosting(false); setPosted(true); setNewPost({title:'',category:'Registration',excerpt:'',content:'',author:'Nyaya Grah Team'}) }, 800)
    setTimeout(() => setPosted(false), 3000)
  }

  return (
    <>
      <Navbar />
      <main style={{paddingTop:70,background:'#0a1628',minHeight:'100vh'}}>

        {/* Header */}
        <div style={{background:'linear-gradient(135deg,#0f1e35,#162440)',borderBottom:'1px solid rgba(201,168,76,0.15)',padding:'60px 1.5rem'}}>
          <div style={{maxWidth:1400,margin:'0 auto'}}>
            <div style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Knowledge Hub</div>
            <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(36px,4vw,60px)',fontWeight:600,color:'#fff',marginBottom:12}}>Legal & Business <span style={{color:'#c9a84c'}}>Insights</span></h1>
            <p style={{fontSize:15,color:'#8a9bb0',maxWidth:540,lineHeight:1.7}}>Expert articles on company registration, GST, compliance, trademarks and more — from our CA, CS and Advocate team.</p>
          </div>
        </div>

        <div style={{maxWidth:1400,margin:'0 auto',padding:'40px 1.5rem'}}>
          {/* Filters */}
          <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center',marginBottom:32}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search articles..." style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.2)',borderRadius:8,padding:'10px 16px',fontSize:14,color:'#fff',outline:'none',fontFamily:'DM Sans,sans-serif',width:240}} />
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {cats.map(c=>(
                <button key={c} onClick={()=>setCat(c)} style={{padding:'8px 16px',borderRadius:100,border:'1px solid',borderColor:cat===c?'#c9a84c':'rgba(201,168,76,0.2)',fontSize:12,color:cat===c?'#c9a84c':'#8a9bb0',background:cat===c?'rgba(201,168,76,0.12)':'transparent',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>
                  {c}
                </button>
              ))}
            </div>
            <button onClick={()=>setShowAdmin(!showAdmin)} style={{marginLeft:'auto',padding:'8px 16px',borderRadius:8,border:'1px solid rgba(201,168,76,0.3)',fontSize:12,color:'#c9a84c',background:'transparent',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>
              {showAdmin?'Close Admin':'Admin'}
            </button>
          </div>

          {/* Admin Panel */}
          {showAdmin && (
            <div style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.25)',borderRadius:14,padding:28,marginBottom:36}}>
              <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:24,fontWeight:600,color:'#c9a84c',marginBottom:20}}>📝 Admin — Post New Blog</h3>
              {!adminAuth ? (
                <div style={{display:'flex',flexDirection:'column',gap:12,maxWidth:400}}>
                  <p style={{fontSize:14,color:'#8a9bb0'}}>Enter admin password to post blogs:</p>
                  <input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="Admin password" style={iStyle} onKeyDown={e=>e.key==='Enter'&&handleAdminLogin()} />
                  {passErr && <p style={{fontSize:12,color:'#e24b4a'}}>Incorrect password. Please try again.</p>}
                  <button onClick={handleAdminLogin} style={{background:'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:'11px 24px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:500,fontSize:14,fontFamily:'DM Sans,sans-serif',alignSelf:'flex-start'}}>Login</button>
                </div>
              ) : (
                <form onSubmit={handlePost} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}} className="bf">
                  <div style={{gridColumn:'1/-1',display:'flex',flexDirection:'column',gap:6}}>
                    <label style={{fontSize:12,color:'#8a9bb0'}}>Blog Title *</label>
                    <input value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})} placeholder="Enter blog title" style={iStyle} required />
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    <label style={{fontSize:12,color:'#8a9bb0'}}>Category</label>
                    <select value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})} style={iStyle}>
                      {cats.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    <label style={{fontSize:12,color:'#8a9bb0'}}>Author Name</label>
                    <input value={newPost.author} onChange={e=>setNewPost({...newPost,author:e.target.value})} placeholder="Author name" style={iStyle} />
                  </div>
                  <div style={{gridColumn:'1/-1',display:'flex',flexDirection:'column',gap:6}}>
                    <label style={{fontSize:12,color:'#8a9bb0'}}>Short Excerpt *</label>
                    <textarea value={newPost.excerpt} onChange={e=>setNewPost({...newPost,excerpt:e.target.value})} placeholder="Brief summary shown on blog listing..." style={{...iStyle,resize:'vertical',minHeight:80}} required />
                  </div>
                  <div style={{gridColumn:'1/-1',display:'flex',flexDirection:'column',gap:6}}>
                    <label style={{fontSize:12,color:'#8a9bb0'}}>Full Content *</label>
                    <textarea value={newPost.content} onChange={e=>setNewPost({...newPost,content:e.target.value})} placeholder="Write your full blog article here..." style={{...iStyle,resize:'vertical',minHeight:200}} required />
                  </div>
                  <div style={{gridColumn:'1/-1',display:'flex',gap:12,alignItems:'center'}}>
                    <button type="submit" disabled={posting} style={{background:posted?'#1D9E75':'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:'13px 28px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:500,fontSize:14,fontFamily:'DM Sans,sans-serif'}}>
                      {posting?'Publishing...':posted?'✓ Published!':'Publish Blog Post'}
                    </button>
                    <button type="button" onClick={()=>setAdminAuth(false)} style={{background:'transparent',border:'1px solid rgba(201,168,76,0.2)',color:'#8a9bb0',padding:'12px 20px',borderRadius:8,cursor:'pointer',fontSize:13,fontFamily:'DM Sans,sans-serif'}}>Logout</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Blog Grid */}
          {filtered.length === 0 ? (
            <div style={{textAlign:'center',padding:'60px 0',color:'#8a9bb0',fontSize:15}}>No articles found for your search.</div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:24}}>
              {filtered.map(b => (
                <article key={b.id} style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.15)',borderRadius:12,overflow:'hidden',transition:'all 0.25s',cursor:'pointer'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#c9a84c'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(201,168,76,0.15)'}>
                  <div style={{background:'linear-gradient(135deg,#162440,#1a2d4a)',padding:'28px 24px 20px'}}>
                    <div style={{display:'flex',gap:8,marginBottom:14}}>
                      <span style={{background:'rgba(201,168,76,0.15)',color:'#c9a84c',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:500}}>{b.category}</span>
                      <span style={{color:'#8a9bb0',fontSize:11,display:'flex',alignItems:'center'}}>{b.readTime}</span>
                    </div>
                    <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:600,color:'#fff',lineHeight:1.3,marginBottom:12}}>{b.title}</h2>
                    <p style={{fontSize:13,color:'#8a9bb0',lineHeight:1.6}}>{b.excerpt}</p>
                  </div>
                  <div style={{padding:'16px 24px',borderTop:'1px solid rgba(201,168,76,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div>
                      <div style={{fontSize:12,color:'#c8d4e0'}}>{b.author}</div>
                      <div style={{fontSize:11,color:'#8a9bb0'}}>{new Date(b.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                    </div>
                    <Link href={`/blog/${b.slug}`} style={{fontSize:12,color:'#c9a84c',textDecoration:'none',fontWeight:500}}>Read More →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
      <style>{`@media(max-width:600px){.bf{grid-template-columns:1fr!important}}`}</style>
    </>
  )
}

const iStyle = {background:'#162440',border:'1px solid rgba(201,168,76,0.2)',borderRadius:8,padding:'11px 16px',fontSize:14,color:'#fff',fontFamily:'DM Sans,sans-serif',outline:'none',width:'100%'}

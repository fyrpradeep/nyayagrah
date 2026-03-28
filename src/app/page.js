'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { services, categories } from '../data/services'

export default function Home() {
  const [activeTab, setActiveTab] = useState('all')
  const [formStatus, setFormStatus] = useState('')

  const filtered = activeTab === 'all' ? services : services.filter(s => s.category === activeTab)

  function handleSubmit(e) {
    e.preventDefault()
    setFormStatus('sending')
    setTimeout(() => { setFormStatus('sent'); e.target.reset(); }, 1500)
  }

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────── */}
      <section style={{minHeight:'100vh',position:'relative',display:'flex',alignItems:'center',padding:'120px 1.5rem 80px',overflow:'hidden',background:'#0a1628'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',inset:0,opacity:0.03,backgroundImage:'linear-gradient(#c9a84c 1px,transparent 1px),linear-gradient(90deg,#c9a84c 1px,transparent 1px)',backgroundSize:'80px 80px',pointerEvents:'none'}}/>
        <div style={{maxWidth:1400,margin:'0 auto',width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}} className="hero-grid">
          <div>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:100,padding:'6px 16px',fontSize:11,color:'#c9a84c',letterSpacing:1.5,textTransform:'uppercase',marginBottom:24}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#c9a84c',animation:'pulse 2s infinite'}}/>
              Pan India Legal & Business Platform
            </div>
            <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(40px,5vw,68px)',fontWeight:600,lineHeight:1.1,color:'#fff',marginBottom:8}}>
              Your Trusted <span style={{color:'#c9a84c'}}>Legal & Business</span> Partner
            </h1>
            <p style={{fontSize:16,color:'#8a9bb0',lineHeight:1.7,marginBottom:36,maxWidth:480}}>
              Nyaya Grah brings together expert CAs, CSs, CMAs & Advocates under one roof — delivering 200+ legal, financial, and compliance services across India.
            </p>
            <div style={{display:'flex',gap:32,marginBottom:40,flexWrap:'wrap'}}>
              {[['10K+','Clients Served'],['200+','Services'],['Pan India','Coverage'],['4.9★','Rating']].map(([n,l])=>(
                <div key={l}>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:32,fontWeight:700,color:'#c9a84c',lineHeight:1}}>{n}</div>
                  <div style={{fontSize:11,color:'#8a9bb0',marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <Link href="#contact" style={{background:'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:'14px 32px',borderRadius:8,fontWeight:500,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>Get Free Consultation →</Link>
              <Link href="#services" style={{background:'transparent',color:'#c9a84c',border:'1px solid rgba(201,168,76,0.3)',padding:'14px 32px',borderRadius:8,fontWeight:500,fontSize:14,textDecoration:'none'}}>Explore Services</Link>
            </div>
          </div>

          {/* Right side: logo + orbit */}
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',position:'relative',minHeight:400}} className="hero-right">
            <div style={{position:'absolute',width:320,height:320,border:'1px dashed rgba(201,168,76,0.15)',borderRadius:'50%',animation:'orbitSpin 30s linear infinite'}}><div style={{position:'absolute',width:8,height:8,background:'#c9a84c',borderRadius:'50%',top:-4,left:'50%',transform:'translateX(-50%)'}}/></div>
            <div style={{position:'absolute',width:420,height:420,border:'1px dashed rgba(201,168,76,0.1)',borderRadius:'50%',animation:'orbitSpin 50s linear infinite reverse'}}/>
            <div style={{width:200,height:200,background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:2}}>
              <img src="/logo.png" alt="Nyaya Grah" style={{width:140,height:140,objectFit:'contain'}} />
            </div>
            {[['Company Registration','top:8%,left:0'],['Trademark ®','top:8%,right:0'],['GST Filing','bottom:22%,left:-5%'],['Legal Drafting','bottom:22%,right:-5%'],['Virtual CFO','bottom:4%,left:28%']].map(([t,pos])=>(
              <div key={t} style={{position:'absolute',...Object.fromEntries(pos.split(',').map(p=>{const[k,v]=p.split(':');return[k.trim(),v.trim()]})),background:'#0f1e35',border:'1px solid rgba(201,168,76,0.2)',borderRadius:100,padding:'6px 14px',fontSize:11,color:'#c9a84c',fontWeight:500,whiteSpace:'nowrap'}}>{t}</div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}
          @keyframes orbitSpin{to{transform:rotate(360deg)}}
          @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}.hero-right{display:none!important}}
          .service-card{transition:all 0.25s!important}
          .service-card:hover{border-color:#c9a84c!important;transform:translateY(-3px)!important}
          .why-card{transition:border-color 0.2s!important}
          .why-card:hover{border-color:#c9a84c!important}
        `}</style>
      </section>

      {/* ── TRUST BAR ────────────────────────── */}
      <div style={{background:'#0f1e35',borderTop:'1px solid rgba(201,168,76,0.2)',borderBottom:'1px solid rgba(201,168,76,0.2)',padding:'20px 1.5rem'}}>
        <div style={{maxWidth:1400,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-around',flexWrap:'wrap',gap:20}}>
          {[['⚖️','Advocate Team','Expert Legal Counsel'],['📊','CA / CMA Team','Finance & Audit'],['🏛️','CS Team','Corporate Secretarial'],['🌏','Pan India','Bikaner & Jaipur'],['🔒','Confidential','Data Security']].map(([icon,t,s])=>(
            <div key={t} style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:8,background:'rgba(201,168,76,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{icon}</div>
              <div><div style={{fontSize:13,fontWeight:500,color:'#fff'}}>{t}</div><div style={{fontSize:11,color:'#8a9bb0'}}>{s}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ─────────────────────────── */}
      <section id="services" style={{padding:'80px 1.5rem',background:'#0f1e35'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>What We Offer</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,3.5vw,52px)',fontWeight:600,color:'#fff',lineHeight:1.15,marginBottom:16}}>200+ Services, <span style={{color:'#c9a84c'}}>One Platform</span></h2>
          <p style={{fontSize:15,color:'#8a9bb0',maxWidth:540,lineHeight:1.7}}>From company incorporation to international business setup — we handle every legal, financial & compliance need of your business.</p>

          {/* Tabs */}
          <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'36px 0 28px'}}>
            {categories.map(c => (
              <button key={c.key} onClick={() => setActiveTab(c.key)}
                style={{padding:'8px 18px',borderRadius:100,border:'1px solid',borderColor:activeTab===c.key?'#c9a84c':'rgba(201,168,76,0.2)',fontSize:13,color:activeTab===c.key?'#c9a84c':'#8a9bb0',background:activeTab===c.key?'rgba(201,168,76,0.12)':'transparent',cursor:'pointer',fontFamily:'DM Sans,sans-serif',transition:'all 0.2s'}}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {filtered.map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`}
                className="service-card"
                style={{background:'#162440',border:'1px solid rgba(201,168,76,0.15)',borderRadius:10,padding:20,textDecoration:'none',display:'block'}}>
                <div style={{fontSize:22,marginBottom:10}}>{s.icon}</div>
                <div style={{fontSize:13,fontWeight:500,color:'#fff',marginBottom:4}}>{s.title}</div>
                <div style={{fontSize:11,color:'#8a9bb0',lineHeight:1.5}}>{s.tagline}</div>
                <div style={{fontSize:11,color:'#c9a84c',marginTop:12}}>Know More →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────── */}
      <section id="about" style={{padding:'80px 1.5rem',background:'#0a1628'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Who We Are</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,3.5vw,52px)',fontWeight:600,color:'#fff',marginBottom:0}}>A Professional Firm, <span style={{color:'#c9a84c'}}>Built for India</span></h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center',marginTop:48}} className="about-grid">
            <div style={{position:'relative'}}>
              <div style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.2)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',padding:60}}>
                <img src="/logo.png" alt="Nyaya Grah" style={{width:'70%',opacity:0.9}} />
              </div>
              <div style={{position:'absolute',bottom:-20,right:-20,background:'#c9a84c',color:'#0a1628',borderRadius:12,padding:'16px 20px'}}>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:700,lineHeight:1}}>10K+</div>
                <div style={{fontSize:12,fontWeight:600}}>Happy Clients</div>
              </div>
            </div>
            <div>
              <p style={{fontSize:15,color:'#c8d4e0',lineHeight:1.8,marginBottom:20}}>
                <strong style={{color:'#c9a84c'}}>Nyaya Grah</strong> is a multi-disciplinary professional services firm headquartered in Rajasthan, with offices in Bikaner and Jaipur. We are a team of qualified Chartered Accountants (CA), Company Secretaries (CS), Cost & Management Accountants (CMA), and Advocates — working together to deliver end-to-end legal, financial, and compliance solutions to businesses across India.
              </p>
              <p style={{fontSize:15,color:'#8a9bb0',lineHeight:1.8,marginBottom:24}}>Our mission is to simplify the complex world of business regulations and make quality professional services accessible to startups, SMEs, individuals, and corporates — at every stage of their journey.</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:24}}>
                {[['CA','Chartered Accountants'],['CS','Company Secretaries'],['CMA','Cost Accountants'],['ADV','Advocates']].map(([t,s])=>(
                  <div key={t} style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:8,padding:'10px 16px',textAlign:'center'}}>
                    <div style={{fontSize:15,fontWeight:600,color:'#c9a84c'}}>{t}</div>
                    <div style={{fontSize:11,color:'#8a9bb0',marginTop:2}}>{s}</div>
                  </div>
                ))}
              </div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
                {['Pan India services from Rajasthan base','200+ legal, financial & compliance services','Dedicated relationship manager for each client','Transparent pricing with no hidden charges','Expert team with deep domain knowledge'].map(item=>(
                  <li key={item} style={{fontSize:14,color:'#c8d4e0',display:'flex',alignItems:'center',gap:10}}>
                    <span style={{width:20,height:20,borderRadius:'50%',background:'rgba(201,168,76,0.15)',border:'1px solid #c9a84c',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:10,color:'#c9a84c'}}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.about-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── PROCESS ──────────────────────────── */}
      <section style={{padding:'80px 1.5rem',background:'#0f1e35'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>How It Works</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,3.5vw,52px)',fontWeight:600,color:'#fff'}}>Get Started in <span style={{color:'#c9a84c'}}>4 Simple Steps</span></h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,marginTop:56,position:'relative'}} className="process-grid">
            <div style={{position:'absolute',top:32,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,#c9a84c,transparent)',opacity:0.3}}/>
            {[['1','Share Requirement','Call, WhatsApp, or fill the form. Free consultation always.'],['2','Expert Analysis','Our CA/CS/Advocate team reviews and provides best solution.'],['3','Document Collection','Submit documents digitally — we guide every step.'],['4','Delivery & Support','Work completed on time with full post-service support.']].map(([n,t,d])=>(
              <div key={n} style={{textAlign:'center',padding:'0 12px'}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontFamily:'Cormorant Garamond,serif',fontSize:24,fontWeight:700,color:'#c9a84c',position:'relative',zIndex:1}}>{n}</div>
                <div style={{fontSize:15,fontWeight:500,color:'#fff',marginBottom:8}}>{t}</div>
                <div style={{fontSize:12,color:'#8a9bb0',lineHeight:1.6}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.process-grid{grid-template-columns:1fr 1fr!important}}`}</style>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section id="reviews" style={{padding:'80px 1.5rem',background:'#0a1628'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Client Reviews</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,3.5vw,52px)',fontWeight:600,color:'#fff'}}>What Our Clients <span style={{color:'#c9a84c'}}>Say</span></h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:48}} className="tgrid">
            {[['R','Rahul Agarwal','Founder, TechStart Pvt. Ltd., Jaipur','"Nyaya Grah made our company registration process completely hassle-free. The team was professional, responsive, and delivered everything on time. Highly recommended for any startup!"'],['S','Sushma Mehta','Director, Mehta Enterprises, Bikaner','"Excellent GST and compliance support. Our CA at Nyaya Grah is always available and ensures we never miss a filing deadline. Best professional firm in Rajasthan!"'],['A','Amit Sharma','CEO, BrandBuild Co., Delhi','"Their trademark registration service was swift and accurate. The advocate team guided us through the entire process. We now have full IP protection for our brand."']].map(([init,name,role,text])=>(
              <div key={name} style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.15)',borderRadius:12,padding:28}}>
                <div style={{color:'#c9a84c',fontSize:14,marginBottom:14}}>★★★★★</div>
                <p style={{fontSize:14,color:'#c8d4e0',lineHeight:1.7,marginBottom:20,fontStyle:'italic'}}>{text}</p>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(201,168,76,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond,serif',fontSize:18,fontWeight:700,color:'#c9a84c'}}>{init}</div>
                  <div><div style={{fontSize:14,fontWeight:500,color:'#fff'}}>{name}</div><div style={{fontSize:11,color:'#8a9bb0'}}>{role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.tgrid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── WHY US ───────────────────────────── */}
      <section style={{padding:'80px 1.5rem',background:'#0f1e35'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Why Choose Us</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,3.5vw,52px)',fontWeight:600,color:'#fff'}}>The <span style={{color:'#c9a84c'}}>Nyaya Grah</span> Advantage</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:48}} className="wgrid">
            {[['🧑‍⚖️','Multi-Disciplinary Team','CA, CS, CMA and Advocates — all under one roof. You get comprehensive advice covering finance, legal, and compliance.'],['⚡','Fast Turnaround','Streamlined processes for quick delivery without compromising quality.'],['💎','Transparent Pricing','No hidden charges. Clear pricing quoted upfront — always.'],['🌏','Pan India Reach','Serving clients across all states from Bikaner and Jaipur offices with digital-first delivery.'],['🔒','Confidentiality Assured','Your business information is completely safe. Strict data privacy and confidentiality maintained.'],['🤝','Dedicated Support','A dedicated relationship manager ensures single point of contact for all queries.']].map(([icon,t,d])=>(
              <div key={t} className="why-card" style={{background:'#162440',border:'1px solid rgba(201,168,76,0.15)',borderRadius:12,padding:28}}>
                <div style={{fontSize:32,marginBottom:16}}>{icon}</div>
                <div style={{fontSize:17,fontWeight:600,color:'#c9a84c',marginBottom:10}}>{t}</div>
                <div style={{fontSize:13,color:'#8a9bb0',lineHeight:1.7}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.wgrid{grid-template-columns:1fr 1fr!important}}@media(max-width:600px){.wgrid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── CONTACT ──────────────────────────── */}
      <section id="contact" style={{padding:'80px 1.5rem',background:'#0f1e35'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Get In Touch</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,3.5vw,52px)',fontWeight:600,color:'#fff',marginBottom:8}}>Book a <span style={{color:'#c9a84c'}}>Free Consultation</span></h2>
          <p style={{fontSize:15,color:'#8a9bb0',maxWidth:540,lineHeight:1.7,marginBottom:0}}>Talk to our experts today — no obligation, no hidden fees.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,marginTop:48}} className="cgrid">
            <div style={{display:'flex',flexDirection:'column',gap:24}}>
              {[['📞','Phone / WhatsApp',<><a href="tel:+917878407950" style={{color:'#c9a84c',textDecoration:'none'}}>+91 78784 07950</a><br/><a href="tel:+916350136833" style={{color:'#c9a84c',textDecoration:'none'}}>+91 63501 36833</a></>],['✉️','Email',<a href="mailto:info@nyayagrah.com" style={{color:'#c9a84c',textDecoration:'none'}}>info@nyayagrah.com</a>],['📍','Bikaner Office','Opp. Vivekananda School, Murti Circle, JNV Colony, Bikaner, Rajasthan'],['📍','Jaipur Office','B-301, Maruti Nagar, Sanganer, Jaipur, Rajasthan']].map(([icon,label,val])=>(
                <div key={label} style={{display:'flex',gap:16,alignItems:'flex-start'}}>
                  <div style={{width:44,height:44,borderRadius:10,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{icon}</div>
                  <div><div style={{fontSize:11,color:'#8a9bb0',letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>{label}</div><div style={{fontSize:14,color:'#fff',lineHeight:1.6}}>{val}</div></div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <Field label="Full Name *" type="text" placeholder="Your name" required />
                <Field label="Mobile Number *" type="tel" placeholder="+91 XXXXX XXXXX" required />
              </div>
              <Field label="Email Address" type="email" placeholder="your@email.com" />
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:12,color:'#8a9bb0'}}>Service Required *</label>
                <select required style={inputStyle}>
                  <option value="">Select a service...</option>
                  {['Company Registration','LLP Registration','GST Registration / Filing','Income Tax Filing','Trademark Registration','Annual Compliance','FSSAI Registration','Legal Agreement / Notice','Virtual CFO Services','Digital Marketing','NGO / CSR','Other'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:12,color:'#8a9bb0'}}>Message</label>
                <textarea placeholder="Briefly describe your requirement..." style={{...inputStyle,resize:'vertical',minHeight:100}} />
              </div>
              <button type="submit" disabled={formStatus==='sending'} style={{background:formStatus==='sent'?'#1D9E75':'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:'14px 32px',borderRadius:8,fontWeight:500,fontSize:14,border:'none',cursor:'pointer',alignSelf:'flex-start',transition:'all 0.3s'}}>
                {formStatus==='sending'?'Sending...':formStatus==='sent'?'✓ Sent! We\'ll call you soon':'Send Inquiry →'}
              </button>
            </form>
          </div>
        </div>
        <style>{`@media(max-width:900px){.cgrid{grid-template-columns:1fr!important}}`}</style>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  )
}

const inputStyle = {background:'#162440',border:'1px solid rgba(201,168,76,0.2)',borderRadius:8,padding:'12px 16px',fontSize:14,color:'#fff',fontFamily:'DM Sans,sans-serif',outline:'none',width:'100%'}

function Field({label, ...props}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      <label style={{fontSize:12,color:'#8a9bb0'}}>{label}</label>
      <input {...props} style={inputStyle} />
    </div>
  )
}

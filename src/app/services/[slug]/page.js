import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import WhatsAppFloat from '../../../components/WhatsAppFloat'
import { getServiceBySlug, services } from '../../../data/services'

export async function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }))
}

export default function ServicePage({ params }) {
  const s = getServiceBySlug(params.slug)
  if (!s) return <div style={{background:'#0a1628',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#c9a84c',fontSize:24}}>Service Not Found</div>

  const related = services.filter(r => r.category === s.category && r.slug !== s.slug).slice(0, 4)

  return (
    <>
      <Navbar />
      <main style={{paddingTop:70,background:'#0a1628',minHeight:'100vh'}}>
        <div style={{background:'#0f1e35',borderBottom:'1px solid rgba(201,168,76,0.15)',padding:'14px 1.5rem'}}>
          <div style={{maxWidth:1400,margin:'0 auto',fontSize:12,color:'#8a9bb0',display:'flex',alignItems:'center',gap:8}}>
            <Link href="/" style={{color:'#c9a84c',textDecoration:'none'}}>Home</Link>
            <span>›</span>
            <Link href="/#services" style={{color:'#c9a84c',textDecoration:'none'}}>Services</Link>
            <span>›</span>
            <span style={{color:'#fff'}}>{s.title}</span>
          </div>
        </div>

        <div style={{background:'linear-gradient(135deg,#0f1e35 0%,#162440 100%)',borderBottom:'1px solid rgba(201,168,76,0.15)',padding:'60px 1.5rem'}}>
          <div style={{maxWidth:1400,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr auto',gap:40,alignItems:'start'}}>
            <div>
              <div style={{fontSize:40,marginBottom:16}}>{s.icon}</div>
              <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,4vw,56px)',fontWeight:600,color:'#fff',lineHeight:1.1,marginBottom:12}}>{s.title}</h1>
              <p style={{fontSize:16,color:'#c9a84c',fontStyle:'italic',marginBottom:20}}>{s.tagline}</p>
              <p style={{fontSize:15,color:'#c8d4e0',lineHeight:1.8,maxWidth:640}}>{s.description}</p>
              <div style={{display:'flex',gap:12,marginTop:28,flexWrap:'wrap'}}>
                <a href="/#contact" style={{background:'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:'13px 28px',borderRadius:8,fontWeight:500,fontSize:14,textDecoration:'none'}}>Get Started →</a>
                <a href={'https://wa.me/916350136833?text=I need help with ' + encodeURIComponent(s.title)} target="_blank" rel="noopener noreferrer" style={{background:'#25D366',color:'#fff',padding:'13px 28px',borderRadius:8,fontWeight:500,fontSize:14,textDecoration:'none'}}>WhatsApp Us</a>
              </div>
            </div>
            <div style={{background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:12,padding:'20px 28px',minWidth:200,textAlign:'center'}}>
              <div style={{fontSize:11,color:'#8a9bb0',letterSpacing:2,textTransform:'uppercase',marginBottom:8}}>Timeline</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:700,color:'#c9a84c'}}>{s.timeline}</div>
            </div>
          </div>
        </div>

        <div style={{maxWidth:1400,margin:'0 auto',padding:'60px 1.5rem',display:'grid',gridTemplateColumns:'1fr 340px',gap:40,alignItems:'start'}}>
          <div>
            <Section title="Key Benefits">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                {s.benefits.map((b,i) => (
                  <div key={i} style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.15)',borderRadius:10,padding:16,display:'flex',alignItems:'flex-start',gap:10}}>
                    <span style={{width:22,height:22,borderRadius:'50%',background:'rgba(201,168,76,0.15)',border:'1px solid #c9a84c',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:11,color:'#c9a84c'}}>✓</span>
                    <span style={{fontSize:13,color:'#c8d4e0',lineHeight:1.5}}>{b}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Documents Required">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {s.documents.map((d,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'#0f1e35',borderRadius:8,border:'1px solid rgba(201,168,76,0.1)'}}>
                    <span style={{fontSize:14}}>📄</span>
                    <span style={{fontSize:13,color:'#c8d4e0'}}>{d}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Step-by-Step Process">
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {s.process.map((step,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 20px',background:'#0f1e35',borderRadius:10,border:'1px solid rgba(201,168,76,0.1)'}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(201,168,76,0.12)',border:'1px solid rgba(201,168,76,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:'Cormorant Garamond,serif',fontSize:18,fontWeight:700,color:'#c9a84c'}}>{i+1}</div>
                    <span style={{fontSize:14,color:'#c8d4e0'}}>{step}</span>
                  </div>
                ))}
              </div>
            </Section>

            {s.faqs && s.faqs.length > 0 && (
              <Section title="Frequently Asked Questions">
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {s.faqs.map((faq,i) => (
                    <details key={i} style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.15)',borderRadius:10,overflow:'hidden'}}>
                      <summary style={{padding:'16px 20px',cursor:'pointer',fontSize:14,fontWeight:500,color:'#fff',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        {faq.q} <span style={{color:'#c9a84c',fontSize:18}}>+</span>
                      </summary>
                      <div style={{padding:'0 20px 16px',fontSize:13,color:'#8a9bb0',lineHeight:1.7}}>{faq.a}</div>
                    </details>
                  ))}
                </div>
              </Section>
            )}
          </div>

          <div style={{position:'sticky',top:90}}>
            <div style={{background:'linear-gradient(135deg,#0f1e35,#162440)',border:'1px solid rgba(201,168,76,0.25)',borderRadius:14,padding:28,marginBottom:20}}>
              <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:600,color:'#fff',marginBottom:8}}>Get Free Consultation</h3>
              <p style={{fontSize:13,color:'#8a9bb0',lineHeight:1.6,marginBottom:20}}>Talk to our expert team. No charges, no obligations.</p>
              <a href="/#contact" style={{display:'block',background:'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:'13px 20px',borderRadius:8,fontWeight:500,fontSize:14,textDecoration:'none',textAlign:'center',marginBottom:10}}>Book Free Consultation</a>
              <a href={'https://wa.me/916350136833?text=I need help with ' + encodeURIComponent(s.title)} target="_blank" rel="noopener noreferrer" style={{display:'block',background:'rgba(37,211,102,0.12)',color:'#25D366',border:'1px solid rgba(37,211,102,0.3)',padding:'12px 20px',borderRadius:8,fontWeight:500,fontSize:14,textDecoration:'none',textAlign:'center'}}>WhatsApp: +91 63501 36833</a>
            </div>

            {related.length > 0 && (
              <div style={{background:'#0f1e35',border:'1px solid rgba(201,168,76,0.15)',borderRadius:14,padding:24}}>
                <h4 style={{fontFamily:'Cormorant Garamond,serif',fontSize:18,fontWeight:600,color:'#c9a84c',marginBottom:16}}>Related Services</h4>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {related.map(r => (
                    <Link key={r.slug} href={'/services/' + r.slug} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#162440',borderRadius:8,textDecoration:'none',border:'1px solid rgba(201,168,76,0.1)'}}>
                      <span style={{fontSize:18}}>{r.icon}</span>
                      <span style={{fontSize:12,color:'#c8d4e0'}}>{r.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

function Section({ title, children }) {
  return (
    <div style={{marginBottom:36}}>
      <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:600,color:'#fff',marginBottom:20,paddingBottom:10,borderBottom:'1px solid rgba(201,168,76,0.15)'}}>{title}</h2>
      {children}
    </div>
  )
}

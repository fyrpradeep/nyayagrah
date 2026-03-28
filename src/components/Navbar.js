'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const navData = [
  {
    label: 'Registrations',
    cols: [
      {
        title: 'Company Registration',
        links: [
          { label: 'Private Limited Company', href: '/services/private-limited-company-registration' },
          { label: 'LLP Registration', href: '/services/llp-registration' },
          { label: 'One Person Company (OPC)', href: '/services/one-person-company' },
          { label: 'Partnership Firm', href: '/services/partnership-firm-registration' },
          { label: 'Sole Proprietorship', href: '/services/sole-proprietorship-registration' },
          { label: 'Startup India Registration', href: '/services/startup-india-registration' },
          { label: 'Nidhi Company', href: '/services/nidhi-company-registration' },
          { label: 'Section 8 Company', href: '/services/section-8-company-registration' },
          { label: 'Virtual Office', href: '/services/virtual-office' },
        ]
      },
      {
        title: 'NGO',
        links: [
          { label: 'NGO Registration', href: '/services/ngo-registration' },
          { label: 'Trust Registration', href: '/services/trust-registration' },
          { label: 'Society Registration', href: '/services/society-registration' },
          { label: '12A & 80G Registration', href: '/services/12a-80g-registration' },
          { label: 'FCRA Registration', href: '/services/fcra-registration' },
        ]
      },
      {
        title: 'Licenses & Certifications',
        links: [
          { label: 'FSSAI Registration', href: '/services/fssai-registration' },
          { label: 'ISO Certification', href: '/services/iso-certification' },
          { label: 'Import Export Code (IEC)', href: '/services/import-export-code' },
          { label: 'Digital Signature (DSC)', href: '/services/digital-signature-certificate' },
          { label: 'MSME / Udyam Registration', href: '/services/msme-registration' },
        ]
      },
    ]
  },
  {
    label: 'Compliance',
    cols: [
      {
        title: 'Annual Compliance',
        links: [
          { label: 'Private Limited Compliance', href: '/services/private-limited-company-compliance' },
          { label: 'LLP Annual Compliance', href: '/services/llp-compliance' },
          { label: 'EPF Registration', href: '/services/epf-registration' },
          { label: 'Virtual CFO Services', href: '/services/virtual-cfo-services' },
        ]
      },
      {
        title: 'MCA Services',
        links: [
          { label: 'Change Company Name', href: '/services/private-limited-company-compliance' },
          { label: 'Close Private Limited Company', href: '/services/private-limited-company-compliance' },
          { label: 'Change in Director', href: '/services/private-limited-company-compliance' },
          { label: 'DIR-3 KYC', href: '/services/private-limited-company-compliance' },
        ]
      },
    ]
  },
  {
    label: 'IPR',
    cols: [
      {
        title: 'Trademark',
        links: [
          { label: 'Trademark Registration', href: '/services/trademark-registration' },
          { label: 'Trademark Renewal', href: '/services/trademark-registration' },
          { label: 'Trademark Objection', href: '/services/trademark-registration' },
          { label: 'Trademark Opposition', href: '/services/trademark-registration' },
          { label: 'International Trademark', href: '/services/trademark-registration' },
          { label: 'Trademark Infringement', href: '/services/trademark-registration' },
        ]
      },
      {
        title: 'Other IP',
        links: [
          { label: 'Copyright Registration', href: '/services/copyright-registration' },
          { label: 'Patent Registration', href: '/services/patent-registration' },
          { label: 'Design Registration', href: '/services/design-registration' },
        ]
      },
    ]
  },
  {
    label: 'Taxation',
    cols: [
      {
        title: 'GST',
        links: [
          { label: 'GST Registration', href: '/services/gst-registration' },
          { label: 'GST Return Filing', href: '/services/gst-return-filing' },
          { label: 'GSTR-9 Annual Return', href: '/services/gst-return-filing' },
          { label: 'Cancel GST Registration', href: '/services/gst-registration' },
          { label: 'E-Way Bill Registration', href: '/services/gst-registration' },
        ]
      },
      {
        title: 'Income Tax',
        links: [
          { label: 'Income Tax Return Filing', href: '/services/income-tax-filing' },
          { label: 'TDS Return Filing', href: '/services/tds-return-filing' },
          { label: 'ITR 1 Filing', href: '/services/income-tax-filing' },
          { label: 'ITR 2 Filing', href: '/services/income-tax-filing' },
          { label: 'PF Return', href: '/services/tds-return-filing' },
        ]
      },
    ]
  },
  {
    label: 'More',
    cols: [
      {
        title: 'Legal',
        links: [
          { label: 'NDA Drafting', href: '/services/nda-drafting' },
          { label: 'MOU Drafting', href: '/services/mou-drafting' },
          { label: 'Legal Notice', href: '/services/legal-notice' },
          { label: 'CSR Registration', href: '/services/csr-registration' },
        ]
      },
      {
        title: 'Digital Services',
        links: [
          { label: 'Digital Marketing', href: '/services/digital-marketing' },
          { label: 'Web Designing', href: '/services/web-designing' },
        ]
      },
    ]
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(null)

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        background:'rgba(10,22,40,0.97)',
        backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(201,168,76,0.2)',
      }}>
        <div style={{maxWidth:1400,margin:'0 auto',padding:'0 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:70}}>
          {/* Logo */}
          <Link href="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none'}}>
            <img src="/logo.png" alt="Nyaya Grah Logo" style={{height:48,width:48,borderRadius:8,objectFit:'cover'}} />
            <div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:700,color:'#c9a84c',lineHeight:1.1}}>Nyaya Grah</div>
              <div style={{fontSize:10,color:'#8a9bb0',letterSpacing:2,textTransform:'uppercase'}}>Legal & Business Solutions</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul style={{display:'flex',alignItems:'center',listStyle:'none',gap:0}} className="desktop-nav">
            {navData.map((item) => (
              <li key={item.label} className="nav-item" style={{position:'relative'}}>
                <button className="nav-link-btn">
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
                <div className="mega-dropdown">
                  <div style={{display:'grid',gridTemplateColumns:`repeat(${item.cols.length},1fr)`,gap:'0 24px',minWidth: item.cols.length > 2 ? 600 : 400}}>
                    {item.cols.map(col => (
                      <div key={col.title}>
                        <div style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'#c9a84c',fontWeight:500,padding:'8px 10px 4px'}}>{col.title}</div>
                        {col.links.map(link => (
                          <Link key={link.label} href={link.href} className="mega-link">{link.label}</Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
            <li><Link href="/blog" className="nav-link-plain">Blog</Link></li>
            <li><Link href="/#contact" className="btn-cta">Free Consultation</Link></li>
          </ul>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="hamburger" aria-label="Menu">
            <span style={{width:24,height:2,background:'#c9a84c',borderRadius:2,display:'block',transition:'0.3s',transform:mobileOpen?'rotate(45deg) translate(5px,5px)':'none'}}></span>
            <span style={{width:24,height:2,background:'#c9a84c',borderRadius:2,display:'block',transition:'0.3s',opacity:mobileOpen?0:1}}></span>
            <span style={{width:24,height:2,background:'#c9a84c',borderRadius:2,display:'block',transition:'0.3s',transform:mobileOpen?'rotate(-45deg) translate(5px,-5px)':'none'}}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{position:'fixed',top:70,left:0,right:0,bottom:0,background:'#0f1e35',zIndex:999,overflowY:'auto',padding:20}}>
          {navData.map((item) => (
            <div key={item.label}>
              <button onClick={() => setOpenMobile(openMobile===item.label?null:item.label)}
                style={{width:'100%',textAlign:'left',background:'none',border:'none',color:'#c9a84c',fontSize:13,letterSpacing:2,textTransform:'uppercase',padding:'14px 0 8px',borderTop:'1px solid rgba(201,168,76,0.15)',cursor:'pointer',fontFamily:'DM Sans,sans-serif',display:'flex',justifyContent:'space-between'}}>
                {item.label} <span>{openMobile===item.label?'▲':'▼'}</span>
              </button>
              {openMobile===item.label && item.cols.map(col => (
                <div key={col.title} style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:'#8a9bb0',letterSpacing:1.5,textTransform:'uppercase',padding:'6px 8px'}}>{col.title}</div>
                  {col.links.map(link => (
                    <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                      style={{display:'block',padding:'8px 12px',fontSize:13,color:'#c8d4e0',textDecoration:'none',borderRadius:6}}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <div style={{borderTop:'1px solid rgba(201,168,76,0.15)',marginTop:8,paddingTop:12}}>
            <Link href="/blog" onClick={() => setMobileOpen(false)} style={{display:'block',padding:'10px 0',color:'#c8d4e0',fontSize:13,textDecoration:'none'}}>Blog</Link>
            <Link href="/#contact" onClick={() => setMobileOpen(false)} style={{display:'block',marginTop:8,background:'linear-gradient(135deg,#c9a84c,#8a6f2e)',color:'#0a1628',padding:'12px 20px',borderRadius:8,textAlign:'center',fontWeight:500,fontSize:14,textDecoration:'none'}}>Free Consultation</Link>
          </div>
        </div>
      )}

      <NavStyles />
    </>
  )
}

function NavStyles() {
  return (
    <style suppressHydrationWarning>{`
      .desktop-nav { display: flex; }
      .nav-link-btn {
        padding: 0 14px; height: 70px;
        display: flex; align-items: center; gap: 4px;
        font-size: 13px; font-weight: 500; color: #c8d4e0;
        background: none; border: none; cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        white-space: nowrap;
      }
      .nav-link-btn:hover { color: #c9a84c; border-bottom-color: #c9a84c; }
      .nav-item:hover .nav-link-btn { color: #c9a84c; border-bottom-color: #c9a84c; }
      .nav-link-plain {
        padding: 0 14px; height: 70px;
        display: flex; align-items: center;
        font-size: 13px; font-weight: 500; color: #c8d4e0;
        text-decoration: none; border-bottom: 2px solid transparent;
        transition: all 0.2s; white-space: nowrap;
      }
      .nav-link-plain:hover { color: #c9a84c; border-bottom-color: #c9a84c; }
      .btn-cta {
        background: linear-gradient(135deg, #c9a84c, #8a6f2e);
        color: #0a1628 !important; padding: 8px 18px;
        border-radius: 6px; font-weight: 500; font-size: 13px;
        text-decoration: none; margin-left: 8px; white-space: nowrap;
        transition: opacity 0.2s;
      }
      .btn-cta:hover { opacity: 0.9; }
      .mega-dropdown {
        display: none; position: absolute; top: 70px; left: 0;
        background: #0f1e35; border: 1px solid rgba(201,168,76,0.2);
        border-radius: 12px; padding: 20px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        z-index: 100;
      }
      .nav-item:hover .mega-dropdown { display: block; }
      .mega-link {
        display: block; padding: 7px 10px;
        font-size: 12px; color: #c8d4e0;
        text-decoration: none; border-radius: 6px; transition: all 0.15s;
      }
      .mega-link:hover { background: rgba(201,168,76,0.1); color: #c9a84c; }
      .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
      @media (max-width: 1100px) {
        .desktop-nav { display: none !important; }
        .hamburger { display: flex !important; }
      }
    `}</style>
  )
}

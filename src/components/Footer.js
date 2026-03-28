'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer suppressHydrationWarning style={{background:'#0a1628',borderTop:'1px solid rgba(201,168,76,0.2)',padding:'60px 1.5rem 0'}}>
      <div style={{maxWidth:1400,margin:'0 auto'}}>
        <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr',gap:40,paddingBottom:48,borderBottom:'1px solid rgba(201,168,76,0.15)'}}>

          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <img src="/logo.png" alt="Nyaya Grah" style={{width:44,height:44,borderRadius:6,objectFit:'cover'}} />
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:20,fontWeight:700,color:'#c9a84c'}}>Nyaya Grah</div>
            </div>
            <p style={{fontSize:13,color:'#8a9bb0',lineHeight:1.8,marginBottom:20}}>
              A multi-disciplinary professional firm with CA, CS, CMA and Advocate teams — delivering 200+ legal, financial and compliance services across India.
            </p>
            <div style={{fontSize:13,color:'#c8d4e0',lineHeight:2}}>
              📞 <a href="tel:+917878407950" style={{color:'#c9a84c',textDecoration:'none'}}>+91 78784 07950</a> | <a href="tel:+916350136833" style={{color:'#c9a84c',textDecoration:'none'}}>+91 63501 36833</a><br/>
              ✉️ <a href="mailto:info@nyayagrah.com" style={{color:'#c9a84c',textDecoration:'none'}}>info@nyayagrah.com</a><br/>
              📍 Bikaner & Jaipur, Rajasthan
            </div>
          </div>

          <FooterCol title="Registrations" links={[
            {label:'Private Limited Company', href:'/services/private-limited-company-registration'},
            {label:'LLP Registration', href:'/services/llp-registration'},
            {label:'OPC Registration', href:'/services/one-person-company'},
            {label:'Partnership Firm', href:'/services/partnership-firm-registration'},
            {label:'Startup India', href:'/services/startup-india-registration'},
            {label:'NGO Registration', href:'/services/ngo-registration'},
            {label:'FSSAI Registration', href:'/services/fssai-registration'},
            {label:'ISO Certification', href:'/services/iso-certification'},
            {label:'Import Export Code', href:'/services/import-export-code'},
            {label:'Virtual Office', href:'/services/virtual-office'},
          ]} />

          <FooterCol title="Compliance & Tax" links={[
            {label:'Annual Compliance', href:'/services/private-limited-company-compliance'},
            {label:'LLP Compliance', href:'/services/llp-compliance'},
            {label:'GST Registration', href:'/services/gst-registration'},
            {label:'GST Return Filing', href:'/services/gst-return-filing'},
            {label:'Income Tax Filing', href:'/services/income-tax-filing'},
            {label:'TDS Return Filing', href:'/services/tds-return-filing'},
            {label:'MSME Registration', href:'/services/msme-registration'},
            {label:'EPF Registration', href:'/services/epf-registration'},
            {label:'Virtual CFO', href:'/services/virtual-cfo-services'},
          ]} />

          <FooterCol title="IPR & Legal" links={[
            {label:'Trademark Registration', href:'/services/trademark-registration'},
            {label:'Copyright Registration', href:'/services/copyright-registration'},
            {label:'Patent Registration', href:'/services/patent-registration'},
            {label:'Design Registration', href:'/services/design-registration'},
            {label:'NDA Drafting', href:'/services/nda-drafting'},
            {label:'MOU Drafting', href:'/services/mou-drafting'},
            {label:'Legal Notice', href:'/services/legal-notice'},
            {label:'CSR Registration', href:'/services/csr-registration'},
            {label:'12A & 80G', href:'/services/12a-80g-registration'},
          ]} />

          <FooterCol title="Company" links={[
            {label:'About Us', href:'/#about'},
            {label:'All Services', href:'/#services'},
            {label:'Reviews', href:'/#reviews'},
            {label:'Blog', href:'/blog'},
            {label:'Contact Us', href:'/#contact'},
            {label:'Digital Marketing', href:'/services/digital-marketing'},
            {label:'Web Designing', href:'/services/web-designing'},
            {label:'Privacy Policy', href:'/privacy-policy'},
            {label:'Terms of Use', href:'/terms'},
          ]} />
        </div>

        <div style={{padding:'20px 0',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div style={{fontSize:12,color:'#8a9bb0'}}>© 2025 Nyaya Grah. All Rights Reserved.</div>
          <div style={{display:'flex',gap:20}}>
            {[{label:'Privacy Policy',href:'/privacy-policy'},{label:'Terms',href:'/terms'},{label:'Refund Policy',href:'/refund-policy'}].map(l=>(
              <Link key={l.label} href={l.href} style={{fontSize:12,color:'#8a9bb0',textDecoration:'none'}}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 style={{fontFamily:'Cormorant Garamond,serif',fontSize:16,fontWeight:600,color:'#c9a84c',marginBottom:14,paddingBottom:8,borderBottom:'1px solid rgba(201,168,76,0.15)'}}>
        {title}
      </h4>
      <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:6}}>
        {links.map(l => (
          <li key={l.label}>
            <Link href={l.href} className="footer-link" style={{fontSize:12,color:'#8a9bb0',textDecoration:'none',display:'block'}}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

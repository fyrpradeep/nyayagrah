import './globals.css'

export const metadata = {
  title: 'Nyaya Grah | Legal & Business Solutions Pan India',
  description: 'Nyaya Grah – India\'s trusted CA, CS, CMA & Advocate firm. Company Registration, GST, Trademark, Compliance, Legal Agreements and 200+ services across India.',
  keywords: 'company registration, GST filing, trademark, legal services India, CA firm Bikaner Jaipur',
  openGraph: {
    title: 'Nyaya Grah | Legal & Business Solutions',
    description: 'CA, CS, CMA & Advocate team — 200+ services Pan India',
    url: 'https://www.nyayagrah.com',
    siteName: 'Nyaya Grah',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

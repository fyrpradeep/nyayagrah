# Nyaya Grah — Website Setup Guide

## Project Structure
```
nyayagrah/
├── public/
│   └── logo.png              ← Your logo file (already added)
├── src/
│   ├── app/
│   │   ├── page.js           ← Homepage
│   │   ├── layout.js         ← Root layout
│   │   ├── globals.css       ← Global styles
│   │   ├── services/
│   │   │   └── [slug]/
│   │   │       └── page.js   ← Individual service pages (auto-generated)
│   │   ├── blog/
│   │   │   └── page.js       ← Blog listing + admin post
│   │   └── admin/
│   │       └── page.js       ← Admin dashboard
│   ├── components/
│   │   ├── Navbar.js         ← Navigation with mega menus
│   │   ├── Footer.js         ← Footer with all service links
│   │   └── WhatsAppFloat.js  ← WhatsApp button
│   └── data/
│       └── services.js       ← ALL services data (edit here)
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Setup Instructions

### Step 1: Install Node.js
Download from https://nodejs.org (version 18+)

### Step 2: Install Dependencies
```bash
cd nyayagrah
npm install
```

### Step 3: Run Locally
```bash
npm run dev
```
Open http://localhost:3000

### Step 4: Build for Production
```bash
npm run build
npm start
```

## Deploy to Vercel (Free — www.nyayagrah.com)

1. Create account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Run: `vercel` in project folder
4. Follow prompts — it will deploy automatically
5. Add custom domain in Vercel dashboard:
   - Go to Project → Settings → Domains
   - Add: www.nyayagrah.com
   - Update DNS at your domain registrar

## Admin Panel
- URL: www.nyayagrah.com/admin
- Password: **nyayagrah2025**
- Change password in: `src/app/admin/page.js` and `src/app/blog/page.js`
  - Find: `const ADMIN_PASS = 'nyayagrah2025'`
  - Change to your password

## Admin Features
✅ Dashboard — overview of all stats
✅ Settings — update phone, WhatsApp, email, addresses
✅ Blog Posts — view and delete posts
✅ Write Blog — publish new articles with category

## Adding More Services
Edit `src/data/services.js` — add a new object following the same format:
```js
{
  slug: "your-service-slug",
  title: "Your Service Title",
  category: "registration", // registration, compliance, tax, ipr, legal, digital, ngo
  icon: "🏢",
  tagline: "Short tagline",
  description: "Full description",
  benefits: ["benefit 1", "benefit 2"],
  documents: ["doc 1", "doc 2"],
  process: ["step 1", "step 2"],
  timeline: "7-10 Working Days",
  faqs: [{ q: "Question?", a: "Answer." }],
}
```

## Pages Available
- `/` — Homepage
- `/services/[slug]` — Individual service pages (auto for all services in data file)
- `/blog` — Blog listing
- `/admin` — Admin dashboard

## Support
📞 Developer contact: info@nyayagrah.com

# ⚖️ Jurix Frontend

Modern, sleek frontend for **Jurix** - AI Legal Document Generation System for Uzbekistan.

## 🚀 Features

- **Beautiful Landing Page** - Eye-catching hero section with gradients and animations
- **Document Generation** - Support for 5+ legal document types
- **Bilingual Support** - Full Uzbek and Russian language support
- **Modern UI** - Built with Next.js 15, React 19, and Tailwind CSS 4
- **Responsive Design** - Works perfectly on all devices
- **API Integration** - Ready to connect with Django backend

## 📋 Supported Document Types

1. **🏠 Lease Agreements** - Rental contracts with comprehensive terms
2. **🔒 Non-Disclosure Agreements (NDAs)** - Protect confidential information
3. **📝 Service Contracts** - General contracts for various purposes
4. **⚖️ Wills & Testaments** - Asset distribution and executor appointment
5. **🏛️ Court Petitions** - Applications for court proceedings

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS 4
- **TypeScript:** Full type safety
- **Fonts:** Geist Sans & Geist Mono

## 📦 Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Update `.env.local` with your backend URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## 🏃 Running the App

### Development Mode
```bash
npm run dev
```

Visit `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## 🌐 Backend Integration

The frontend expects a Django backend with the following endpoint:

### POST /api/generate
**Request:**
```json
{
  "documentType": "lease_agreement",
  "language": "uzbek",
  "formData": {
    "landlord": "Ali Valiyev",
    "tenant": "V. Ivanov",
    "address": "123 Main St, Tashkent",
    "rent": "1000000",
    "duration": "1 year"
  }
}
```

**Response Options:**
1. **Direct PDF:** Returns PDF file with `Content-Type: application/pdf`
2. **JSON with URL:** Returns `{ "url": "https://..." }`

## 📁 Project Structure

```
jurix-frontend/
├── src/
│   ├── app/
│   │   ├── generate/        # Document generation page
│   │   ├── globals.css      # Global styles & animations
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── lib/
│   │   └── api.ts           # API utilities
│   └── types/
│       └── index.ts         # TypeScript types
├── public/                  # Static assets
└── package.json
```

## 🎨 Design Features

- **Gradient Backgrounds** - Purple/indigo theme
- **Glass Morphism** - Frosted glass effects
- **Smooth Animations** - Hover effects and transitions
- **Responsive Layout** - Mobile-first design
- **Modern Typography** - Geist font family

## ⚖️ Legal Compliance

The frontend includes:
- ⚠️ Legal disclaimers (no substitute for professional advice)
- 🤖 AI-generated content labels (Uzbekistan regulation compliance)
- 🔒 Privacy notices (data not stored, HTTPS encryption)

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Alternative Platforms
- Netlify
- AWS Amplify
- Cloud Run

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (required)

### Customization
- **Colors:** Edit `src/app/globals.css`
- **Document types:** Edit `src/app/generate/page.tsx`
- **API logic:** Edit `src/lib/api.ts`

## 📝 TODO for Production

- [ ] Connect to real Django backend
- [ ] Add proper error handling UI
- [ ] Implement PDF preview modal
- [ ] Add loading skeletons
- [ ] Implement analytics
- [ ] Add multi-language UI (currently English only)
- [ ] Implement document history (requires backend)
- [ ] Add user authentication (optional)

## 🏆 Hackathon Notes

This project was built for a hackathon with focus on:
- ✅ Speed of development
- ✅ Visual impact and modern design
- ✅ Clean, maintainable code
- ✅ Legal compliance and ethics
- ✅ User experience

## 📄 License

This is a hackathon prototype. All rights reserved.

---

**🤖 Powered by AI • Made for Uzbekistan**

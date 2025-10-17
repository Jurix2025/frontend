# ⚖️ Jurix Frontend

Modern, sleek frontend for **Jurix** - AI Legal Document Generation System for Uzbekistan.

## 🚀 Features

### Document Generation
- **Live PDF Preview** - Real-time PDF preview as you fill the form (split-screen view)
- **Client-Side PDF Generation** - Fast PDF generation using @react-pdf/renderer
- **5+ Document Types** - Lease agreements, NDAs, service contracts, wills, court petitions
- **Bilingual Support** - Full Uzbek and Russian language support
- **Instant Download** - Download generated PDFs directly from the browser

### Document Analysis
- **Drag & Drop Upload** - Easy document upload interface
- **AI-Powered Analysis** - Extract key insights from legal documents
- **Sentiment-Based Insights** - Color-coded insights (red for risks, green for positive, yellow for warnings)
- **Summary Generation** - Get concise summaries of complex legal documents
- **Risk Identification** - Automatically identify potential legal risks and gaps

### Technical Features
- **Modern UI** - Built with Next.js 15, React 19, and Tailwind CSS 4
- **Responsive Design** - Works perfectly on all devices
- **API Integration** - Ready to connect with backend (OpenAI or custom API)

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
- **PDF Generation:** @react-pdf/renderer (client-side)
- **File Upload:** react-dropzone (drag & drop)
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

The frontend expects a backend with the following endpoints:

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

### POST /api/analyze
**Request:**
- `Content-Type: multipart/form-data`
- Field: `document` (PDF, DOC, DOCX, or TXT file)

**Response:**
```json
{
  "summary": "Brief summary of the document...",
  "insights": [
    {
      "text": "Insight description",
      "sentiment": "positive" | "neutral" | "negative" | "warning",
      "category": "Category name"
    }
  ]
}
```

**Note:** The analyze endpoint should use OpenAI API (or similar) to extract and analyze document content.

## 📁 Project Structure

```
jurix-frontend/
├── src/
│   ├── app/
│   │   ├── generate/        # Document generation page (with live PDF preview)
│   │   ├── analyze/         # Document analysis page (drag & drop upload)
│   │   ├── globals.css      # Global styles & animations
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── PDFTemplate.tsx  # PDF document template component
│   │   └── PDFPreview.tsx   # Live PDF preview component
│   ├── lib/
│   │   └── api.ts           # API utilities (generate & analyze)
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

### Completed ✅
- [x] Live PDF preview with split-screen view
- [x] Client-side PDF generation
- [x] Document analysis page with drag & drop
- [x] Sentiment-based color-coded insights
- [x] API integration layer for analysis

### Remaining
- [ ] Connect to real backend API (generate & analyze endpoints)
- [ ] Add proper error handling UI with toast notifications
- [ ] Add loading skeletons for better UX
- [ ] Implement analytics (Google Analytics or PostHog)
- [ ] Add multi-language UI labels (currently English only, documents support Uzbek/Russian)
- [ ] Implement document history (requires backend + auth)
- [ ] Add user authentication (optional for hackathon, required for production)
- [ ] Add export functionality for analysis reports (PDF/JSON)
- [ ] Implement file size validation and progress bars for uploads

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

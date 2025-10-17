# 🚀 Jurix Frontend - Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend Django API running (or URL to deployed backend)

## Step 1: Install Dependencies

```bash
cd jurix-frontend
npm install
```

## Step 2: Configure Environment

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, use your deployed Django backend URL:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Step 3: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 4: Test the Application

1. **Landing Page** (http://localhost:3000)
   - Should see beautiful gradient hero section
   - Click "Generate Document Now" button

2. **Generate Page** (http://localhost:3000/generate)
   - See 5 document type cards
   - Click any document type
   - Fill in the form
   - Select language (Uzbek/Russian)
   - Click "Generate Document"

3. **Expected Behavior**
   - Shows loading state with spinner
   - Makes POST request to `/api/generate`
   - Downloads PDF or shows error message

## Troubleshooting

### Issue: "Module not found" errors
**Solution:** Run `npm install` again

### Issue: API calls failing
**Solution:**
- Check that backend is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors
- Ensure Django has `django-cors-headers` configured

### Issue: Styles not loading
**Solution:**
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`

### Issue: TypeScript errors
**Solution:**
- Run type check: `npm run build`
- Fix any type errors shown

## Building for Production

```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
vercel
```

## Important Notes

### API Integration
The current implementation has a **mock** generate function that shows an alert. To connect to real backend:

1. Edit `src/app/generate/page.tsx`
2. Find the `handleGenerate` function
3. Replace the mock code with:

```typescript
const handleGenerate = async () => {
  setIsGenerating(true);

  try {
    const response = await generateDocument({
      documentType: formatDocumentType(selectedDoc!),
      language: language,
      formData: formData,
    });

    if (response.success && response.pdfData) {
      downloadPDF(response.pdfData, `${selectedDoc}_${Date.now()}.pdf`);
    } else if (response.success && response.documentUrl) {
      window.open(response.documentUrl, '_blank');
    } else {
      alert(`Error: ${response.error}`);
    }
  } catch (error) {
    alert(`Generation failed: ${error}`);
  } finally {
    setIsGenerating(false);
  }
};
```

4. Import the API functions at the top:
```typescript
import { generateDocument, downloadPDF, formatDocumentType } from '@/lib/api';
```

### Backend Requirements

Your Django backend must:
- Accept POST requests to `/api/generate`
- Accept JSON body with `documentType`, `language`, `formData`
- Return either:
  - PDF file directly (Content-Type: application/pdf)
  - JSON with URL: `{ "url": "https://..." }`
- Have CORS enabled for your frontend domain

Example Django CORS settings:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://jurix.vercel.app",  # Your deployed URL
]
```

## Features Implemented

✅ Modern landing page with animations
✅ Document type selection interface
✅ Dynamic forms for all 5 document types
✅ Language selection (Uzbek/Russian)
✅ Loading states and error handling
✅ Responsive design (mobile-friendly)
✅ Legal disclaimers and AI content labels
✅ API integration structure
✅ TypeScript types
✅ Clean, maintainable code

## Next Steps

1. **Connect Backend:** Hook up real Django API
2. **Test Generation:** Try generating each document type
3. **Review PDFs:** Check generated documents look correct
4. **Deploy:** Push to Vercel/Netlify
5. **Demo:** Prepare hackathon presentation

## Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] `NEXT_PUBLIC_API_URL` set in deployment platform
- [ ] Frontend builds without errors
- [ ] All document types tested
- [ ] Both languages tested
- [ ] Mobile responsiveness checked
- [ ] Legal disclaimers visible
- [ ] PDF downloads working

## Demo Script for Hackathon

1. **Open Landing Page**
   - "This is Jurix - AI Legal Document Generator for Uzbekistan"
   - Highlight beautiful UI and features section

2. **Click Generate**
   - "We support 5 document types"
   - Click on "Lease Agreement"

3. **Fill Form**
   - Select "Uzbek" language
   - Fill in sample data
   - "Form is simple and intuitive"

4. **Generate**
   - Click Generate
   - "AI generates document in seconds"
   - Download PDF

5. **Show PDF**
   - "Professional, properly formatted"
   - "Ready to review with lawyer"

6. **Highlight Compliance**
   - Point to disclaimer
   - Point to AI-generated label
   - "Fully compliant with regulations"

## Support

For issues or questions:
- Check console logs (F12 in browser)
- Verify all environment variables
- Ensure backend is running and accessible
- Test API endpoint directly with Postman

---

**Good luck with your hackathon! 🎉**

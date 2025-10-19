# Backend Communication Guide

## Overview

Your frontend (deployed to Azure) needs to communicate with your backend API at `http://34.56.99.80:8000`.

## Important Considerations

### Mixed Content Warning

⚠️ **Important**: Your Azure Web App will be served over HTTPS (https://jurix.azurewebsites.net), but your backend is HTTP (http://34.56.99.80:8000). This can cause "mixed content" warnings in browsers.

### Solutions

#### Option 1: Enable HTTPS on Backend (Recommended)

The best solution is to enable HTTPS on your backend server. You can:

1. Set up a reverse proxy (Nginx) with SSL certificate
2. Use a load balancer with SSL termination
3. Deploy backend behind Azure Application Gateway with SSL

#### Option 2: Use Next.js API Routes as Proxy (Quick Fix)

Create API routes in Next.js that proxy requests to the backend. This keeps all client requests to HTTPS.

Example: Create `/src/app/api/proxy/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://34.56.99.80:8000';

  try {
    const response = await fetch(`${backendUrl}/your-endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to communicate with backend' },
      { status: 500 }
    );
  }
}
```

Then update your frontend code to call `/api/proxy` instead of the backend directly.

#### Option 3: Disable HTTPS Redirect (Not Recommended for Production)

Only for testing/development:

```bash
az webapp update \
  --name jurix \
  --resource-group jurix \
  --https-only false
```

## Current Configuration

### Environment Variables

The following environment variables are configured in Azure Web App:

- `NEXT_PUBLIC_API_URL=http://34.56.99.80:8000` - Backend API endpoint
- `OPENAI_API_KEY=sk-proj-...` - OpenAI API key

### CORS Configuration

The Next.js configuration (`next.config.ts`) includes CORS headers to allow:
- All origins (*)
- GET, POST, PUT, DELETE, OPTIONS methods
- Content-Type and Authorization headers

### Backend Requirements

Ensure your backend (http://34.56.99.80:8000) has CORS enabled and allows requests from:
- `https://jurix.azurewebsites.net` (your production domain)
- `http://localhost:3000` (for local development)

Example backend CORS configuration (FastAPI):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://jurix.azurewebsites.net",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing Backend Communication

### 1. Test from Local Development

```bash
# Start the app locally
npm run dev

# The app should connect to http://34.56.99.80:8000
```

### 2. Test from Azure After Deployment

1. Open browser console: https://jurix.azurewebsites.net
2. Check for any CORS or mixed content errors
3. Monitor network requests in DevTools

### 3. Test API Connectivity from Azure

```bash
# SSH into the container and test
az webapp ssh --name jurix --resource-group jurix

# Inside container:
curl http://34.56.99.80:8000/health
```

## Troubleshooting

### Mixed Content Errors

If you see mixed content errors in browser console:

1. Check browser console for specific error messages
2. Verify backend is accessible: `curl http://34.56.99.80:8000`
3. Consider implementing Option 2 (API Proxy) above

### CORS Errors

If you see CORS errors:

1. Verify backend CORS configuration allows your frontend origin
2. Check that backend responds to OPTIONS preflight requests
3. Verify headers in browser DevTools Network tab

### Connection Timeouts

If requests timeout:

1. Check backend is running: `curl http://34.56.99.80:8000`
2. Verify Azure Web App can reach backend (firewall rules)
3. Check Azure Web App logs: `az webapp log tail --name jurix --resource-group jurix`

### Backend Returns 404

1. Verify the API endpoint exists on backend
2. Check the full URL being called (inspect Network tab)
3. Ensure `NEXT_PUBLIC_API_URL` is correctly set

## Security Recommendations

1. **Enable HTTPS on Backend**: Use SSL certificates (Let's Encrypt is free)
2. **Restrict CORS**: Only allow specific origins, not `*`
3. **API Authentication**: Use API keys or JWT tokens
4. **Rate Limiting**: Implement rate limiting on backend
5. **Environment Variables**: Never commit API keys to git

## Custom Domain (Optional)

If you have a custom domain:

1. Configure custom domain in Azure:
```bash
az webapp config hostname add \
  --webapp-name jurix \
  --resource-group jurix \
  --hostname yourdomain.com
```

2. Enable managed SSL certificate:
```bash
az webapp config ssl create \
  --name jurix \
  --resource-group jurix \
  --hostname yourdomain.com
```

3. Update backend CORS to allow your custom domain

## Monitoring

Monitor backend API calls:

```bash
# View application logs
az webapp log tail --name jurix --resource-group jurix

# View application insights (if enabled)
az monitor app-insights component show \
  --app your-app-insights \
  --resource-group jurix
```

## Next Steps

1. Deploy the frontend to Azure using `./deploy-azure.sh`
2. Test the deployment at https://jurix.azurewebsites.net
3. Verify backend communication works
4. If mixed content issues occur, implement API proxy pattern (Option 2)
5. Consider enabling HTTPS on backend for production use

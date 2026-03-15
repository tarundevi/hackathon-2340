# Deployment Guide: CS 2340 UML Collaboration Tool

This guide covers deployment of the UML collaboration tool to production using **Vercel** (Next.js frontend) and **Railway** (y-websocket server).

## Architecture Overview

The application consists of two main components:

1. **Frontend**: Next.js 14 app deployed on Vercel
2. **WebSocket Server**: y-websocket server deployed on Railway

Both communicate via WebSocket for real-time collaboration.

---

## Prerequisites

- GitHub repository with the codebase
- Vercel account (free tier available at vercel.com)
- Railway account (free tier available at railway.app)
- Google Cloud project with Gemini API enabled
- Gemini API key

---

## Step 1: Prepare Environment Variables

### 1.1 Create `.env.production` locally

Before deployment, create a `.env.production` file with production values:

```bash
# WebSocket server URL (set after Railway deployment)
NEXT_PUBLIC_WS_URL=wss://your-ws-server.railway.app

# Gemini API key for AI validation
GEMINI_API_KEY=your-gemini-api-key-here
```

### 1.2 Never commit `.env` files

Ensure `.env.production` is in `.gitignore`:

```bash
echo ".env.production" >> .gitignore
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "chore: ensure env files are not committed"
```

---

## Step 2: Deploy WebSocket Server to Railway

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select this repository

### 2.2 Configure Railway Service

1. Click "Add Service"
2. Select "GitHub Repo"
3. Select this repository
4. Railway auto-detects `ws-server/server.js` as the entry point

### 2.3 Set Railway Environment

In the Railway dashboard:

1. Go to your project → Variables
2. Railway automatically sets `PORT` (default 3000)
3. No additional env vars needed for the WS server

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Copy the deployment URL (e.g., `your-ws-server.railway.app`)
4. Note this for Vercel configuration

### 2.5 Verify Railway Deployment

Test the WebSocket server:

```bash
# From your local machine
npx wscat -c wss://your-ws-server.railway.app/test-room
```

If you see output, the WebSocket server is working.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Push to GitHub

Ensure your latest code is pushed to GitHub:

```bash
git add .
git commit -m "feat: final deployment package"
git push origin main
```

### 3.2 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js configuration

### 3.3 Configure Environment Variables

In the Vercel project settings:

1. Go to Settings → Environment Variables
2. Add the following:

```
NEXT_PUBLIC_WS_URL = wss://your-ws-server.railway.app
GEMINI_API_KEY = your-gemini-api-key-here
```

**Important**: `NEXT_PUBLIC_WS_URL` must have the `NEXT_PUBLIC_` prefix to be accessible in the browser.

### 3.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy (usually 1-2 minutes)
3. You'll receive a deployment URL (e.g., `uml-collab.vercel.app`)

### 3.5 Verify Vercel Deployment

1. Visit your Vercel deployment URL
2. You should see the Room Selector lobby
3. Create a new room to test

---

## Step 4: End-to-End Verification

### 4.1 Test Basic Functionality

1. **Create a room**: Visit your Vercel URL, create a new room
2. **Verify connection**: Check browser console for WebSocket connections
3. **Test collaboration**: Open two browser windows in the same room
4. **Add entity in Tab A**: Create a class in the DCD
5. **Verify in Tab B**: The class should appear in Tab B within 1-2 seconds
6. **Test AI validation**: Run AI check to verify Gemini API integration

### 4.2 Test with Different Networks

1. Deploy the app on Vercel
2. Open the URL from a phone on a different network
3. Open the URL on a desktop on the same network
4. Verify real-time sync works across different networks

### 4.3 Test Scenarios

1. Load Jordan scenario → verify all entities appear
2. Switch diagrams (UCD/DCD/SD) → verify diagram-specific entities
3. Run AI validation → should get results from Gemini API

### 4.4 Check Production Logs

**Vercel logs**:
- Vercel Dashboard → Your Project → Deployments → Logs

**Railway logs**:
- Railway Dashboard → Your Project → Logs
- Look for WebSocket connection messages

---

## Troubleshooting

### WebSocket Connection Fails

**Error**: `WebSocket is closed`

**Causes**:
- `NEXT_PUBLIC_WS_URL` not set or incorrect
- Railway server is down
- Firewall blocking WebSocket connections

**Solutions**:
1. Verify `NEXT_PUBLIC_WS_URL` in Vercel env vars
2. Check Railway deployment status
3. Test connectivity: `npx wscat -c wss://your-server.railway.app/test`

### Gemini API Errors

**Error**: `API key not valid`

**Causes**:
- `GEMINI_API_KEY` not set
- API key expired or invalid
- Gemini API not enabled in Google Cloud

**Solutions**:
1. Verify `GEMINI_API_KEY` in Vercel env vars (check it's not truncated)
2. Go to [Google Cloud Console](https://console.cloud.google.com)
3. Ensure Gemini API is enabled
4. Generate a new API key if needed

### Slow Real-Time Sync

**Causes**:
- Network latency
- Too many entities (100+)
- Browser CPU throttling

**Solutions**:
1. Test from a faster network
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check browser CPU usage (DevTools → Performance)

### Build Fails on Vercel

**Common Issues**:
- TypeScript errors in components
- Missing dependencies
- Build script error

**Solution**:
```bash
# Test build locally
npm run build

# If fails, fix errors then:
git add .
git commit -m "fix: build errors"
git push origin main
```

---

## Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push origin main
```

Vercel will auto-redeploy.

### Monitor Costs

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Railway**: Free tier includes $5/month credit
- **Gemini API**: Pay-as-you-go (typically <$1/month for class usage)

### Scaling Notes

For 100+ concurrent users:
- Consider scaling Railway (add more nodes)
- Ensure Gemini API quota is sufficient
- Monitor Vercel deployment analytics

---

## Rollback

If you need to rollback to a previous deployment:

**Vercel**:
1. Go to Deployments
2. Click the deployment you want to rollback to
3. Click "Promote to Production"

**Railway**:
1. Go to Deployments
2. Select a previous deployment
3. Railway will redeploy

---

## Domain Setup (Optional)

### Add Custom Domain to Vercel

1. Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `uml-collab.gatech.edu`)
3. Update DNS records per Vercel instructions
4. Vercel will provision SSL certificate automatically

---

## Support

For issues:
1. Check Vercel logs: Dashboard → Deployments → Logs
2. Check Railway logs: Dashboard → Logs
3. Check browser console for client-side errors (F12)
4. Check network tab for failed WebSocket connections

---

## Summary

| Component | Platform | Status |
|-----------|----------|--------|
| Frontend | Vercel | Deployed |
| WebSocket Server | Railway | Deployed |
| AI Engine | Google Gemini | Integrated |
| SSL/TLS | Vercel (auto) | Enabled |

Your UML collaboration tool is now live and ready for use!

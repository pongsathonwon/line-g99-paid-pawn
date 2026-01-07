# Deployment Guide - LINE G99 Pawn Payment App (POC)

## Quick Start - Vercel Deployment

This guide covers deploying the LINE LIFF application to Vercel for POC testing.

### Prerequisites

- GitHub account
- Vercel account (free tier - sign up at [vercel.com](https://vercel.com))
- LINE Developers account with LIFF app configured

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

If your code isn't already on GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin dev
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Select your repository: `line-g99-paid-pawn`
4. Vercel will auto-detect it as a Vite project

### Step 3: Configure Build Settings

Vercel should automatically detect these settings from [vercel.json](vercel.json):

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_LIFF_ID` | `2008362552-k7e4Yw0N` | Production, Preview, Development |
| `VITE_BASE_URL` | `https://g99pawnpay.golden99.co.th/pawn-online-api` | Production, Preview, Development |
| `VITE_APP_VERSION` | `1.0.2-poc` | Production, Preview, Development |

> **Note**: Apply to all environments (Production, Preview, Development) for consistent behavior

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build completion
3. You'll receive a URL like: `https://your-app-name.vercel.app`

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From the project root directory:

```bash
# First deployment (creates project)
vercel

# Production deployment
vercel --prod
```

### Step 4: Set Environment Variables via CLI

```bash
vercel env add VITE_LIFF_ID
# Enter: 2008362552-k7e4Yw0N
# Select: Production, Preview, Development

vercel env add VITE_BASE_URL
# Enter: https://g99pawnpay.golden99.co.th/pawn-online-api
# Select: Production, Preview, Development

vercel env add VITE_APP_VERSION
# Enter: 1.0.2-poc
# Select: Production, Preview, Development
```

---

## Step 6: Update LINE Developers Console

**CRITICAL**: After deployment, you must update your LIFF app settings.

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Navigate to your LIFF app (LIFF ID: `2008362552-k7e4Yw0N`)
3. Update **"Endpoint URL"** with your Vercel URL:
   ```
   https://your-app-name.vercel.app
   ```
4. Verify the following settings:
   - **Size**: Full
   - **Scope**: `profile`, `openid` (add others as needed)
   - **Bot link feature**: Configure based on your requirements
5. Click **"Update"**

---

## Post-Deployment Verification

### Checklist

- [ ] Open your Vercel deployment URL in a browser
- [ ] Check browser console - no LIFF initialization errors
- [ ] Verify environment variables loaded (check Network tab → API calls should go to correct BASE_URL)
- [ ] Test SPA routing - navigate between pages, refresh should work
- [ ] Open LINE app on mobile
- [ ] Access your LIFF app from LINE
- [ ] Test login flow
- [ ] Test payment flow (if applicable in POC)

### Troubleshooting

**Issue**: "LIFF ID is not registered"
- **Solution**: Ensure LIFF Endpoint URL in LINE Developers Console matches your Vercel URL exactly

**Issue**: "API requests failing (404/CORS)"
- **Solution**: Verify `VITE_BASE_URL` is set correctly in Vercel environment variables

**Issue**: "Blank page after refresh"
- **Solution**: Ensure [vercel.json](vercel.json) has the SPA rewrite rule (should be auto-included)

**Issue**: "Build fails on Vercel but works locally"
- **Solution**: Check for case-sensitive import issues (Windows is case-insensitive, Linux is not)
  - Ensure all imports match actual file names exactly: `@/component/ui/Toast/ToastContainer`

---

## Continuous Deployment

Once set up, Vercel automatically deploys:

- **Production**: Every push to `main` branch → `https://your-app.vercel.app`
- **Preview**: Every push to other branches → `https://your-app-git-branch-name.vercel.app`

### Enable Auto-Deploy

In Vercel Dashboard:
1. Go to **Project Settings** → **Git**
2. Ensure "Production Branch" is set to `main` (or your preferred branch)
3. Enable preview deployments for all branches

---

## Rollback Strategy

If something goes wrong:

1. Go to Vercel Dashboard → **Deployments**
2. Find the last working deployment
3. Click **"Promote to Production"**
4. Rollback is instant (zero downtime)

---

## Performance Optimization (Optional)

### Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Update [src/main.tsx](src/main.tsx):

```typescript
import { Analytics } from '@vercel/analytics/react';

// ... existing code ...

root.render(
  <React.StrictMode>
    <ToastContextProvider>
      {/* ... other providers ... */}
    </ToastContextProvider>
    <Analytics /> {/* Add this */}
  </React.StrictMode>
);
```

Redeploy to see analytics in Vercel Dashboard.

---

## Custom Domain (Optional)

To use a custom domain instead of `vercel.app`:

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `pawn-poc.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update LINE LIFF Endpoint URL to new domain

---

## Cost Estimate

**Vercel Hobby (Free) Tier**:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Free for POC use

**When to Upgrade**:
- Bandwidth exceeds 100GB/month
- Need team collaboration features
- Need password-protected deployments
- Require commercial support

---

## Additional Resources

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vite.dev/guide/static-deploy.html)
- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [Troubleshooting Guide](https://vercel.com/support)

---

## Support

For issues with:
- **Vercel Deployment**: Check [Vercel Status](https://vercel-status.com) or contact Vercel support
- **LINE LIFF**: Refer to [LINE Developers FAQ](https://developers.line.biz/en/faq/)
- **This Application**: Contact the development team

---

**Last Updated**: 2026-01-07
**App Version**: 1.0.2-poc

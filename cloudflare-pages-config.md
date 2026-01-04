# Cloudflare Pages Configuration Guide

## Quick Setup Steps:

### 1. Connect GitHub Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select **GitHub** and authorize Cloudflare
5. Select your repository: `oliver273/oliverseosite`
6. Click **Begin setup**

### 2. Build Settings

**For this static HTML site, use these settings:**

- **Project name:** `oliverseosite` (or your preferred name)
- **Production branch:** `main`
- **Build command:** (leave empty - no build needed for static HTML)
- **Build output directory:** `/` (root directory)
- **Root directory:** (leave empty or set to `/`)

### 3. Environment Variables

No environment variables needed for this static site.

### 4. Custom Domain (Optional)

After deployment:
1. Go to your project settings
2. Click **Custom domains**
3. Add your domain (e.g., `oliverseo.com`)
4. Follow DNS setup instructions

### 5. Manual Deployment Trigger

If auto-deploy isn't working:

1. Go to your Cloudflare Pages project
2. Click **Deployments** tab
3. Click **Retry deployment** on the latest deployment
4. Or click **Create deployment** → **Deploy from Git** → Select `main` branch

## Troubleshooting

### If deployments aren't triggering:

1. **Check GitHub connection:**
   - Go to Pages → Settings → Builds & deployments
   - Verify GitHub is connected
   - Reconnect if needed

2. **Check build settings:**
   - Build command should be EMPTY (no build needed)
   - Output directory should be `/` or root

3. **Check file structure:**
   - Make sure `index.html` is in the root directory
   - All HTML files should be accessible

4. **Manual trigger:**
   - Go to Deployments → Create deployment
   - Select branch: `main`
   - Click Deploy

### Common Issues:

- **"Build failed"** → Check build logs, make sure build command is empty
- **"No files found"** → Check output directory is set to `/`
- **"404 errors"** → Make sure `index.html` exists in root

## Your Site Structure:

```
/
├── index.html (main entry point)
├── dashboard-fixed.html
├── viewer.html
├── reddit-outreach-tool.html
├── portfolio.html
├── website-design.html
├── article-writing.html
└── ... (all other files)
```

## After Setup:

Your site will be available at:
- `https://[project-name].pages.dev`
- Or your custom domain if configured

Deployments will automatically trigger on every push to `main` branch.






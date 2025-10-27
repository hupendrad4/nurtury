# QuoriumAgro - Deployment Guide

This guide covers deploying the QuoriumAgro platform to production.

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Mobile    │────▶│     API     │────▶│  Database   │
│  (Expo)     │     │  (NestJS)   │     │ (Postgres)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
┌─────────────┐            │             ┌─────────────┐
│     Web     │────────────┘             │   Storage   │
│  (Next.js)  │                          │    (S3)     │
└─────────────┘                          └─────────────┘
```

## Deployment Options

### Option 1: Recommended Stack

- **API**: Railway / Render / Fly.io
- **Web**: Vercel
- **Database**: Railway PostgreSQL / Supabase
- **Storage**: AWS S3 / Cloudflare R2
- **Search**: Meilisearch Cloud
- **Mobile**: EAS Build + App Stores

### Option 2: All-in-One

- **Everything**: AWS (EC2, RDS, S3, CloudFront)
- **Container**: Docker + Docker Compose
- **Orchestration**: AWS ECS / Kubernetes

## 1. Database Setup

### Using Railway

1. Create a new project on [Railway](https://railway.app)
2. Add PostgreSQL service
3. Copy the connection string
4. Update `DATABASE_URL` in production environment

### Using Supabase

1. Create project on [Supabase](https://supabase.com)
2. Get connection string from Settings → Database
3. Update `DATABASE_URL`

## 2. API Deployment

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Link to project:
```bash
railway link
```

4. Set environment variables:
```bash
railway variables set DATABASE_URL=your_database_url
railway variables set JWT_SECRET=your_jwt_secret
# ... set all required variables
```

5. Deploy:
```bash
cd apps/api
railway up
```

### Deploy to Render

1. Create account on [Render](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `cd apps/api && pnpm install && pnpm build`
   - Start Command: `cd apps/api && pnpm start:prod`
   - Add environment variables

### Deploy to Fly.io

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login:
```bash
fly auth login
```

3. Create app:
```bash
cd apps/api
fly launch
```

4. Set secrets:
```bash
fly secrets set DATABASE_URL=your_database_url
fly secrets set JWT_SECRET=your_jwt_secret
```

5. Deploy:
```bash
fly deploy
```

## 3. Web Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd apps/web
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your API URL
   - Other public environment variables

4. Deploy to production:
```bash
vercel --prod
```

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build:
```bash
cd apps/web
pnpm build
```

3. Deploy:
```bash
netlify deploy --prod
```

## 4. Storage Setup

### AWS S3

1. Create S3 bucket
2. Configure CORS:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. Create IAM user with S3 permissions
4. Update environment variables:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=quoriumagro-prod
```

### Cloudflare R2

1. Create R2 bucket
2. Create API token
3. Update environment variables:
```env
STORAGE_ENDPOINT=your-account-id.r2.cloudflarestorage.com
STORAGE_ACCESS_KEY=your_key
STORAGE_SECRET_KEY=your_secret
STORAGE_BUCKET=quoriumagro
```

## 5. Mobile App Deployment

### Build with EAS

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login:
```bash
eas login
```

3. Configure:
```bash
cd apps/mobile
eas build:configure
```

4. Build for Android:
```bash
eas build --platform android --profile production
```

5. Build for iOS:
```bash
eas build --platform ios --profile production
```

### Submit to App Stores

**Google Play Store:**
```bash
eas submit --platform android
```

**Apple App Store:**
```bash
eas submit --platform ios
```

## 6. Environment Variables

### Production Environment Variables

Create `.env.production` with:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=strong-random-secret-min-32-chars
JWT_REFRESH_SECRET=another-strong-random-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API
API_URL=https://api.quoriumagro.com
API_PORT=3001
CORS_ORIGIN=https://quoriumagro.com,https://www.quoriumagro.com

# Storage (AWS S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=quoriumagro-prod

# Stripe
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email (Resend)
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@quoriumagro.com

# Meilisearch
MEILISEARCH_HOST=https://your-instance.meilisearch.io
MEILISEARCH_API_KEY=your_key

# Sentry (optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Node Environment
NODE_ENV=production
```

## 7. Database Migrations

Run migrations in production:

```bash
# Using Railway
railway run pnpm db:migrate

# Using Fly.io
fly ssh console
cd apps/api
pnpm prisma migrate deploy

# Using Render (in build command)
pnpm prisma migrate deploy
```

## 8. Monitoring & Logging

### Sentry Setup

1. Create project on [Sentry](https://sentry.io)
2. Install SDK:
```bash
pnpm add @sentry/node @sentry/nextjs
```

3. Configure in API and Web apps

### Logging

API uses Pino for structured logging. In production:

```typescript
// apps/api/src/main.ts
app.useLogger(app.get(Logger));
```

Logs are automatically sent to stdout for collection by your hosting provider.

## 9. SSL/TLS Certificates

Most hosting providers (Vercel, Railway, Render) provide automatic SSL certificates.

For custom domains:
1. Add domain to hosting provider
2. Update DNS records
3. SSL certificate is automatically provisioned

## 10. CDN Setup

### Cloudflare

1. Add site to Cloudflare
2. Update nameservers
3. Enable:
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - Caching rules

### CloudFront (AWS)

1. Create CloudFront distribution
2. Origin: Your web app URL
3. Configure caching behaviors
4. Add custom domain

## 11. Backup Strategy

### Database Backups

**Railway**: Automatic daily backups

**Supabase**: Automatic backups included

**Custom**: Set up pg_dump cron job:
```bash
0 2 * * * pg_dump $DATABASE_URL > backup-$(date +\%Y\%m\%d).sql
```

### Storage Backups

Enable versioning on S3 bucket:
```bash
aws s3api put-bucket-versioning \
  --bucket quoriumagro-prod \
  --versioning-configuration Status=Enabled
```

## 12. Performance Optimization

### API
- Enable Redis caching
- Use connection pooling
- Implement rate limiting
- Enable compression

### Web
- Enable Next.js Image Optimization
- Use CDN for static assets
- Implement ISR (Incremental Static Regeneration)
- Enable Brotli compression

### Database
- Add appropriate indexes
- Use connection pooling
- Regular VACUUM and ANALYZE

## 13. Security Checklist

- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable database SSL connections
- [ ] Set up firewall rules
- [ ] Enable DDoS protection (Cloudflare)
- [ ] Regular security updates
- [ ] Implement CSP headers

## 14. Post-Deployment

1. **Test all endpoints**: Use Postman or similar
2. **Test payment flows**: Stripe and Razorpay
3. **Test mobile apps**: On real devices
4. **Monitor logs**: Check for errors
5. **Set up alerts**: For downtime and errors
6. **Load testing**: Use k6 or Artillery
7. **SEO**: Submit sitemap to Google

## 15. Rollback Strategy

### API Rollback

**Railway**:
```bash
railway rollback
```

**Render**: Use dashboard to rollback to previous deployment

**Fly.io**:
```bash
fly releases
fly releases rollback <version>
```

### Web Rollback

**Vercel**:
```bash
vercel rollback
```

Or use dashboard to rollback to previous deployment.

## Support

For deployment issues:
- Check hosting provider documentation
- Review application logs
- Contact support@quoriumagro.com

---

**Good luck with your deployment! 🚀**

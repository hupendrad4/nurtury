# QuoriumAgro - Complete Setup Guide

This guide will walk you through setting up the QuoriumAgro e-commerce platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** 8.x or higher (`npm install -g pnpm`)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

## Step-by-Step Setup

### 1. Clone the Repository

```bash
cd /home/aumni/Downloads/Nurtury
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all apps and packages in the monorepo.

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following (minimum required):

```env
# Database
DATABASE_URL=postgresql://quoriumagro:quoriumagro@localhost:5432/quoriumagro?schema=public

# JWT Secrets (generate strong secrets for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# API Configuration
API_PORT=3001
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# Storage (MinIO for local development)
STORAGE_ENDPOINT=localhost
STORAGE_PORT=9000
STORAGE_USE_SSL=false
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_BUCKET=quoriumagro
```

### 4. Start Docker Services

Start PostgreSQL, MinIO, Meilisearch, and Redis:

```bash
pnpm docker:up
```

Or using Make:

```bash
make docker-up
```

Verify services are running:

```bash
docker ps
```

You should see 4 containers running:
- `quoriumagro-postgres`
- `quoriumagro-minio`
- `quoriumagro-meilisearch`
- `quoriumagro-redis`

### 5. Run Database Migrations

```bash
pnpm db:migrate
```

This will create all database tables using Prisma.

### 6. Seed the Database

```bash
pnpm db:seed
```

This will populate the database with:
- Admin and customer test accounts
- 7 product categories
- 20+ sample products with variants
- Banners, coupons, and sample reviews

**Test Credentials:**

Admin:
- Email: `admin@quoriumagro.com`
- Password: `Admin123!`

Customer:
- Email: `customer@example.com`
- Password: `Customer123!`

### 7. Start Development Servers

```bash
pnpm dev
```

This will start all applications concurrently:

- **API (NestJS)**: http://localhost:3001
- **Web (Next.js)**: http://localhost:3000
- **Mobile (Expo)**: Expo Dev Server (scan QR code)

### 8. Access the Applications

#### API Documentation (Swagger)
Open http://localhost:3001/docs in your browser to explore the API endpoints.

#### Web Application
Open http://localhost:3000 in your browser.

#### Mobile Application
1. Install Expo Go on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan the QR code displayed in your terminal
3. The app will load on your device

#### MinIO Console (Storage)
Open http://localhost:9001 in your browser.
- Username: `minioadmin`
- Password: `minioadmin`

#### Prisma Studio (Database GUI)
```bash
pnpm db:studio
```
Opens at http://localhost:5555

## Quick Commands Reference

```bash
# Development
pnpm dev                  # Start all apps
pnpm build                # Build all apps
pnpm lint                 # Lint code
pnpm typecheck            # Type check
pnpm test                 # Run tests

# Database
pnpm db:migrate           # Run migrations
pnpm db:reset             # Reset database
pnpm db:seed              # Seed data
pnpm db:studio            # Open Prisma Studio

# Docker
pnpm docker:up            # Start services
pnpm docker:down          # Stop services
pnpm docker:logs          # View logs

# Complete Setup
pnpm setup                # Install + Docker + Migrate + Seed
```

## Testing the Application

### 1. Test the API

Visit http://localhost:3001/docs and try these endpoints:

**Health Check:**
```
GET /health
```

**Get Products:**
```
GET /products
```

**Register User:**
```
POST /auth/register
{
  "email": "test@example.com",
  "password": "Test123!",
  "firstName": "Test",
  "lastName": "User"
}
```

### 2. Test the Web App

1. Visit http://localhost:3000
2. Browse products
3. Click on a product to view details
4. Add items to cart
5. Sign in with test credentials
6. Complete checkout flow

### 3. Test the Mobile App

1. Open Expo Go on your phone
2. Scan the QR code
3. Navigate through the app:
   - Home tab: View banners and featured products
   - Products tab: Browse and search products
   - Cart tab: View cart items
   - Profile tab: Sign in and manage account

## Payment Integration Setup

### Stripe (Global Payments)

1. Sign up at https://stripe.com
2. Get your test API keys from the Dashboard
3. Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### Razorpay (India Payments)

1. Sign up at https://razorpay.com
2. Get your test API keys
3. Add to `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
```

## Troubleshooting

### Port Already in Use

If ports 3000, 3001, 5432, 9000, or 7700 are already in use:

1. Stop the conflicting service
2. Or change the port in `.env` and `docker-compose.yml`

### Docker Services Not Starting

```bash
# Stop all containers
pnpm docker:down

# Remove volumes and restart
docker-compose down -v
pnpm docker:up
```

### Database Connection Error

1. Ensure PostgreSQL container is running:
```bash
docker ps | grep postgres
```

2. Check DATABASE_URL in `.env` matches the container configuration

### Prisma Migration Errors

```bash
# Reset database and re-run migrations
pnpm db:reset
pnpm db:migrate
pnpm db:seed
```

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules
pnpm install
```

## Next Steps

1. **Customize Branding**: Update colors, logo, and content
2. **Add Products**: Use the admin dashboard or Prisma Studio
3. **Configure Payments**: Set up Stripe/Razorpay webhooks
4. **Set Up Email**: Configure SMTP or Resend for transactional emails
5. **Deploy**: Follow deployment guides for production

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

## Support

For issues or questions:
- Check the [README.md](./README.md)
- Open an issue on GitHub
- Email: support@quoriumagro.com

---

**Happy Coding! 🌱**

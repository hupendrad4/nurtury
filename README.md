# QuoriumAgro - We Grow Roots 🌱

Production-ready, cross-platform e-commerce application for selling nursery products: ornamental plants, medicinal plants, gardening tools, fertilizers, soils, pots, seeds, and more.

## 🚀 Features

- **Cross-platform**: iOS, Android, and Web
- **Full e-commerce**: Product catalog, cart, checkout, orders, payments
- **Payment Integration**: Stripe (global) and Razorpay (India)
- **Admin Dashboard**: Product management, orders, inventory, analytics
- **Authentication**: JWT + OAuth (Google/Apple)
- **Search**: Full-text search with Meilisearch
- **Storage**: S3-compatible (MinIO locally, AWS S3 in production)
- **Notifications**: Push notifications via FCM
- **PWA**: Installable web app with offline support

## 📦 Tech Stack

### Frontend
- **Mobile**: React Native (Expo) + NativeWind
- **Web**: Next.js 14 (App Router) + Tailwind CSS
- **State**: React Query + Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **API**: NestJS (TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Search**: Meilisearch
- **Cache**: Redis
- **Storage**: MinIO (local) / AWS S3 (production)

### DevOps
- **Monorepo**: Turborepo + pnpm workspaces
- **Containers**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Installation

1. **Clone and install dependencies**:
```bash
cd /home/aumni/Downloads/Nurtury
pnpm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Docker services** (Postgres, MinIO, Meilisearch, Redis):
```bash
pnpm docker:up
# or
make docker-up
```

4. **Run database migrations and seed**:
```bash
pnpm db:migrate
pnpm db:seed
```

5. **Start development servers**:
```bash
pnpm dev
```

This will start:
- **API**: http://localhost:3001
- **Web**: http://localhost:3000
- **Mobile**: Expo Dev Server (scan QR code)
- **API Docs**: http://localhost:3001/docs

### Test Credentials

**Admin**:
- Email: `admin@quoriumagro.com`
- Password: `Admin123!`

**Customer**:
- Email: `customer@example.com`
- Password: `Customer123!`

## 📁 Project Structure

```
Nurtury/
├── apps/
│   ├── api/              # NestJS API
│   ├── mobile/           # React Native (Expo)
│   └── web/              # Next.js Web & Admin
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── config/           # Shared configs (ESLint, etc.)
│   └── tsconfig/         # Shared TypeScript configs
├── docker-compose.yml    # Local development services
├── turbo.json            # Turborepo configuration
└── package.json          # Root package.json
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev                  # Start all apps in dev mode
pnpm build                # Build all apps
pnpm lint                 # Lint all code
pnpm typecheck            # Type check all code
pnpm test                 # Run tests

# Database
pnpm db:migrate           # Run Prisma migrations
pnpm db:reset             # Reset database
pnpm db:seed              # Seed database with sample data
pnpm db:studio            # Open Prisma Studio

# Docker
pnpm docker:up            # Start Docker services
pnpm docker:down          # Stop Docker services
pnpm docker:logs          # View Docker logs

# Complete setup
pnpm setup                # Install + Docker + Migrate + Seed
```

## 🌐 API Documentation

Once the API is running, visit:
- **Swagger UI**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/health

### Key Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `POST /cart/items` - Add to cart
- `POST /orders` - Create order
- `POST /payments/stripe/create-intent` - Create Stripe payment
- `POST /payments/razorpay/create-order` - Create Razorpay order

## 🎨 Brand Guidelines

- **Primary Color**: #1B5E20 (Dark Green)
- **Accent Color**: #66BB6A (Leaf Green)
- **Typography**: Clean, modern sans-serif
- **Logo**: Leaf/roots symbol with "QuoriumAgro" text
- **Tagline**: "We Grow Roots"

## 📱 Mobile Development

### Run on Device/Simulator

```bash
cd apps/mobile

# iOS
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build
eas build --platform android
eas build --platform ios
```

## 🌍 Deployment

### API (NestJS)

Deploy to Railway, Render, or Fly.io:

```bash
# Build
cd apps/api
pnpm build

# Start production
pnpm start:prod
```

### Web (Next.js)

Deploy to Vercel:

```bash
cd apps/web
vercel
```

Or build and deploy anywhere:

```bash
pnpm build
pnpm start
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe API key
- `RAZORPAY_KEY_ID` - Razorpay key
- `STORAGE_*` - MinIO/S3 configuration

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 📊 Database Schema

See `apps/api/prisma/schema.prisma` for the complete database schema.

Key models:
- User, Session, Address
- Category, Product, ProductVariant
- Cart, CartItem
- Order, OrderItem, Payment
- Review, Coupon, Banner
- Notification, WishlistItem

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support, email support@quoriumagro.com or open an issue.

---

**Built with ❤️ by the QuoriumAgro Team**

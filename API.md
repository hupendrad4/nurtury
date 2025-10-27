# QuoriumAgro API Documentation

Base URL: `http://localhost:3001` (development) | `https://api.quoriumagro.com` (production)

## Authentication

Most endpoints require authentication via JWT Bearer token.

```http
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210"
}

Response: 201 Created
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

Response: 200 OK
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200 OK
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200 OK
```

### Products

#### Get All Products
```http
GET /products?page=1&limit=20&categoryId=xxx&sortBy=price-asc

Response: 200 OK
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

#### Search Products
```http
GET /products/search?q=aloe&minPrice=100&maxPrice=500

Response: 200 OK
{
  "data": [...],
  "total": 10,
  ...
}
```

#### Get Product by ID
```http
GET /products/:id

Response: 200 OK
{
  "id": "...",
  "name": "Aloe Vera Plant",
  "description": "...",
  "basePrice": 249,
  "variants": [...],
  "reviews": [...]
}
```

#### Get Product by Slug
```http
GET /products/slug/:slug

Response: 200 OK
```

### Categories

#### Get All Categories
```http
GET /categories

Response: 200 OK
[
  {
    "id": "...",
    "name": "Ornamental Plants",
    "slug": "ornamental-plants",
    "children": [...]
  }
]
```

### Cart

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "...",
  "items": [...],
  "subtotal": 1000,
  "tax": 180,
  "total": 1180
}
```

#### Add Item to Cart
```http
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "variantId": "...",
  "quantity": 2
}

Response: 200 OK
```

#### Update Cart Item
```http
PUT /cart/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}

Response: 200 OK
```

#### Remove Cart Item
```http
DELETE /cart/items/:id
Authorization: Bearer <token>

Response: 200 OK
```

### Orders

#### Get User Orders
```http
GET /orders
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "...",
    "orderNumber": "ORD-123456",
    "status": "DELIVERED",
    "total": 1180,
    "items": [...]
  }
]
```

#### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <token>

Response: 200 OK
```

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddressId": "...",
  "paymentMethod": "STRIPE",
  "items": [...]
}

Response: 201 Created
```

### Payments

#### Create Stripe Payment Intent
```http
POST /payments/stripe/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "..."
}

Response: 200 OK
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

#### Create Razorpay Order
```http
POST /payments/razorpay/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "..."
}

Response: 200 OK
{
  "id": "order_xxx",
  "amount": 118000,
  "currency": "INR"
}
```

### User Profile

#### Get Profile
```http
GET /users/me
Authorization: Bearer <token>

Response: 200 OK
```

#### Update Profile
```http
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe"
}

Response: 200 OK
```

#### Get Addresses
```http
GET /users/me/addresses
Authorization: Bearer <token>

Response: 200 OK
```

#### Create Address
```http
POST /users/me/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "+919876543210",
  "addressLine1": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "isDefault": true
}

Response: 201 Created
```

### Wishlist

#### Get Wishlist
```http
GET /wishlist
Authorization: Bearer <token>

Response: 200 OK
```

#### Add to Wishlist
```http
POST /wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "..."
}

Response: 201 Created
```

#### Remove from Wishlist
```http
DELETE /wishlist/:productId
Authorization: Bearer <token>

Response: 200 OK
```

### Reviews

#### Get Product Reviews
```http
GET /reviews/products/:productId

Response: 200 OK
```

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "...",
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Very healthy plant..."
}

Response: 201 Created
```

### Admin (Requires ADMIN/MANAGER role)

#### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "totalOrders": 1234,
  "totalRevenue": 567890,
  "totalUsers": 5678,
  "totalProducts": 234
}
```

#### Create Product
```http
POST /admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Plant",
  "slug": "new-plant",
  "description": "...",
  "categoryId": "...",
  "basePrice": 299,
  ...
}

Response: 201 Created
```

## Error Responses

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 95
  - `X-RateLimit-Reset`: 1234567890

## Pagination

List endpoints support pagination:

```http
GET /products?page=1&limit=20
```

Response includes:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

## Filtering & Sorting

### Products
- `categoryId` - Filter by category
- `minPrice` / `maxPrice` - Price range
- `isMedicinal` - Filter medicinal plants
- `sortBy` - `price-asc`, `price-desc`, `name`, `rating`, `newest`

### Orders
- `status` - Filter by order status
- `startDate` / `endDate` - Date range

---

For interactive API documentation, visit: http://localhost:3001/docs

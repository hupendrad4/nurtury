# 🚀 Quick Start Guide - Authentication & Add to Cart

## ⚠️ IMPORTANT: Authentication Required

**Add to Cart requires you to be logged in!** This is a security feature to track user carts and orders.

---

## 🔐 Step-by-Step: Complete Flow

### **Step 1: Start Both Servers**

```bash
# Terminal 1 - Start Backend API
cd apps/api
pnpm dev
# Should run on http://localhost:3001

# Terminal 2 - Start Frontend
cd apps/web
pnpm dev
# Should run on http://localhost:6002
```

### **Step 2: Seed Database (First Time Only)**

```bash
# In Terminal 1 (or new terminal)
cd apps/api
pnpm prisma db push
pnpm prisma db seed
```

This creates:
- ✅ Test customer account
- ✅ Admin account
- ✅ 15+ products with variants
- ✅ Categories
- ✅ Coupons

---

## 🎯 **OPTION A: Quick Login (Recommended)**

### Use Pre-Created Test Account:

1. **Open**: http://localhost:6002/login
2. **Quick Login Buttons** are provided on the login page!
   - Click the **"Customer Account"** button (blue box)
   - Email & password auto-fill: `customer@example.com` / `Customer123!`
3. Click **"Sign in"**
4. ✅ You're now logged in!
5. **Header shows**: Your name & Logout button
6. **Now Add to Cart works!**

### Test Add to Cart:
```
1. Go to http://localhost:6002/products
2. Click any product
3. Click "Add to Cart"
4. ✅ GREEN toast appears: "Added to cart successfully!"
5. ✅ Cart icon shows red badge with number
6. ✅ Click cart icon to see items
```

---

## 🎯 **OPTION B: Register New Account**

### Create Your Own Account:

1. **Open**: http://localhost:6002/register
2. **Fill the form**:
   - First Name: Your name
   - Last Name: Your surname
   - Email: your@email.com
   - Phone: +91 9876543210 (optional)
   - Password: Min. 8 characters
   - Confirm Password: Same as above
3. ✅ Check "I agree to Terms and Conditions"
4. Click **"Create Account"**
5. ✅ Auto-logged in and redirected to home
6. **Header shows**: Your name & Logout button
7. **Now Add to Cart works!**

---

## 📊 Authentication Status Indicators

### **When Logged OUT:**
```
Header shows:
├── Login button (white border)
├── Register button (white background)
└── Cart icon (but Add to Cart won't work)
```

### **When Logged IN:**
```
Header shows:
├── Your name (e.g., "John")
├── Logout button
├── Cart icon with badge
└── My Orders link (mobile menu)
```

---

## 🛒 Complete Cart Flow (After Login)

### 1. **Add to Cart**
```
✅ Browse products
✅ Click "Add to Cart"
✅ See success toast (green)
✅ Cart badge updates immediately
```

### 2. **View Cart**
```
✅ Click cart icon in header
✅ Sidebar slides from right
✅ See all items
✅ Adjust quantities
✅ Click "Proceed to Checkout"
```

### 3. **Checkout**
```
✅ Add/select delivery address
✅ Choose payment method (Razorpay/COD)
✅ Click "Place Order"
```

### 4. **Success**
```
✅ See order confirmation
✅ Get unique Order ID
✅ View in "My Orders"
```

---

## 🔓 Logout

**To logout:**
1. Click **"Logout"** in header
2. ✅ Redirected to home page
3. ✅ Header shows Login/Register buttons again
4. ✅ Cart is cleared from view
5. ✅ Add to Cart will require login again

---

## 🐛 Troubleshooting

### **Problem: Add to Cart shows RED error toast**

**Error Message**: "Please login to add items to cart"

**Solution**:
1. ✅ You're not logged in
2. ✅ Will auto-redirect to login page in 1.5 seconds
3. ✅ Or manually go to http://localhost:6002/login
4. ✅ Login and try again

### **Problem: Login page doesn't work**

**Check**:
1. ✅ Backend running on port 3001?
2. ✅ Database seeded?
3. ✅ Check browser console for errors
4. ✅ Check backend terminal for API errors

### **Problem: "Invalid credentials" error**

**Solution**:
1. ✅ Make sure database is seeded
2. ✅ Use exact credentials:
   - Email: `customer@example.com`
   - Password: `Customer123!`
3. ✅ Or create new account via Register

---

## 📝 Test Credentials

### Pre-seeded Accounts:

**Customer Account** (for shopping):
```
Email: customer@example.com
Password: Customer123!
```

**Admin Account** (for management):
```
Email: admin@quoriumagro.com
Password: Admin123!
```

---

## ✅ Success Checklist

Verify everything works:

- [ ] Backend running on localhost:3001
- [ ] Frontend running on localhost:6002
- [ ] Database seeded successfully
- [ ] Can open login page
- [ ] Can login with test account
- [ ] Header shows user name after login
- [ ] Add to Cart shows GREEN success toast
- [ ] Cart icon badge shows number
- [ ] Cart dropdown opens with items
- [ ] Can proceed to checkout
- [ ] Can logout successfully

---

## 🎉 You're Ready!

**Complete User Journey:**
```
1. Register/Login
   ↓
2. Browse Products
   ↓
3. Add to Cart (works now!)
   ↓
4. View Cart
   ↓
5. Checkout
   ↓
6. Place Order
   ↓
7. View Orders
   ↓
8. Logout
```

**Start here**: http://localhost:6002/login

**Quick test**: Use the blue "Customer Account" button on login page!

---

## 🆘 Still Not Working?

Run these commands in order:

```bash
# 1. Stop all servers (Ctrl+C in both terminals)

# 2. Reset database
cd apps/api
pnpm prisma db push --force-reset
pnpm prisma db seed

# 3. Start backend
pnpm dev

# 4. In new terminal, start frontend
cd apps/web
pnpm dev

# 5. Open http://localhost:6002/login
# 6. Click "Customer Account" button (blue box)
# 7. Click "Sign in"
# 8. Go to Products and click "Add to Cart"
# 9. Should work! ✅
```

---

**The Add to Cart button NOW WORKS after login! 🎊**


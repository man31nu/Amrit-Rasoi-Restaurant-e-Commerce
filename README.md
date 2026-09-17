# 🍛 Amrit Rasoi – Full Stack Restaurant E-Commerce Application

Amrit Rasoi is a modern **full-stack restaurant e-commerce web application** built using **Angular 19, Node.js, Express, PostgreSQL, and Razorpay Payment Integration** with secure payments and a premium UI experience.

It allows users to browse menu items, filter by category/search, add items to cart, apply promo coupons, place orders, and pay securely using **Razorpay**, along with an admin dashboard for managing products, categories, coupons, and orders.

---

# 🚀 Features

### 🍽️ E-Commerce & Ordering
- Browse menu items & filter by categories
- Real-time search & sorting
- Dynamic Shopping Cart & Checkout
- Promo Coupon validation & discount calculation
- Live Order Tracking & status updates

### 🔐 Authentication System
- Secure User Registration & Login
- JWT Token-based Authentication
- Role-based Access Control (User / Admin)
- Angular HTTP Interceptor for auth header & error handling

### 💳 Payment Integration
- Razorpay Payment Gateway integration
- Order creation & payment verification
- Webhook support for automated order status updates

### 🎨 Modern Angular UI
- Angular 19 Standalone Components
- Responsive design with dark/light theme toggle
- RxJS State Services (`AuthService`, `CartService`, `ProductService`, `OrderService`, `CouponService`)

### 🛠️ Admin Dashboard
- Product CRUD operations
- Order management & status update
- Coupon management

---

# 🛠️ Tech Stack

## Frontend (`frontend-angular`)
- **Framework**: Angular 19 (Standalone Components)
- **Language**: TypeScript
- **Reactive Programming**: RxJS & Signals
- **HTTP**: `@angular/common/http` with Interceptors
- **Build Tool**: Angular CLI

## Backend (`backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (native `pg` pool client)
- **Database Scripts**: Custom SQL schema & seed script (`setupDb.js`)
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **Payments**: Razorpay Node SDK

---

# 📦 Installation & Setup

## 1. Clone Repository
```bash
git clone https://github.com/man31nu/Amrit-Rasoi-Restaurant-e-Commerce.git
cd Amrit-Rasoi-Restaurant-e-Commerce
```

## 2. Configure Backend Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/amrit_rasoi

# JWT Secret Key
JWT_SECRET=supersecretjwtkey123456

# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_Td1GJRwld5ekBz
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

## 3. Database Setup (PostgreSQL)

Make sure PostgreSQL is running locally or provide a cloud database URI (Neon/Supabase) in `.env`, then run:

```bash
cd backend
npm run db:setup
```

## 4. Install Dependencies & Run

### Backend API (`http://localhost:5000`)
```bash
cd backend
npm install
npm run dev
```

### Frontend Angular (`http://localhost:4200`)
```bash
cd frontend-angular
npm install
npm start
```

---

# 📁 Project Structure

```
Amrit-Rasoi-Restaurant-e-Commerce/
├── backend/
│   ├── api/
│   │   ├── config/          # Cloudinary & PostgreSQL pool connection
│   │   ├── controllers/     # Auth, Cart, Coupon, Order, Product, Review controllers
│   │   ├── middlewares/     # JWT authentication & Error middlewares
│   │   ├── models/          # SQL database models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic & Database queries
│   │   └── utils/           # Logger & status codes
│   ├── prisma/              # SQL schema & seed data script (schema_and_data.sql)
│   ├── scripts/             # Database initialization script (setupDb.js)
│   ├── server.js            # Express server entry point
│   └── package.json
├── frontend-angular/
│   ├── src/
│   │   ├── app/
│   │   │   ├── Modules/     # Admin, Auth, Cart, Checkout, Core, Home, Menu, Orders
│   │   │   ├── guards/      # Auth & Admin guards
│   │   │   ├── interceptors/# HTTP Auth & Error interceptors
│   │   │   └── services/    # API & state services
│   │   ├── environments/    # Development & production configuration
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
├── vercel.json
└── README.md
```

---

# 🚢 Deployment

- **Frontend (`frontend-angular`)**: Deployed on Vercel / Netlify
- **Backend (`backend`)**: Deployed on Render / Railway
- **Database**: Managed PostgreSQL (Neon / Supabase)

---

# 📜 License
ISC License

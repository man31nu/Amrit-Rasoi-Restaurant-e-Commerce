# 🍛 Amrit Rasoi – Full Stack Restaurant E-Commerce Application

Amrit Rasoi is a modern **full-stack restaurant e-commerce web application** built using **Angular 19, Node.js, Express, PostgreSQL (Neon DB), Google OAuth 2.0, and Razorpay Payment Integration** with secure payments and a premium UI experience.

---

## 🌐 Live Deployments

- **Frontend Application**: [https://amrit-rasoi-restaurant-e-commerce.vercel.app](https://amrit-rasoi-restaurant-e-commerce.vercel.app)
- **Backend API Service**: `https://amrit-rasoi-restaurant-e-commerce-1.onrender.com`

---

## 🚀 Key Features

### 🍽️ E-Commerce & Interactive Menu
- **Interactive Food Catalog**: Filter dishes by categories, dietary emblems (Veg / Non-Veg), spice levels (`Mild`, `Medium`, `Spicy`), price sorting (`Low to High`, `High to Low`), and newest arrivals.
- **Real-Time Dish Search**: Search dishes instantly with live client-side filtering.
- **Dish Details & Review System**: View detailed descriptions, preparation time, spice levels, and community reviews with star ratings (1-5 stars) and comments.
- **Dynamic Shopping Cart**: Reactive cart management with Angular Signals (`CartService`), quantity controls, and local state persistence.
- **Promo Coupon Engine**: Backend coupon validation (e.g. `WELCOME20`) with automated discount calculations.

### 🔐 Multi-Provider Authentication & User Security
- **Email / Password Authentication**: Secure User Registration & Login with `bcrypt` password hashing and signed JWT tokens.
- **Google OAuth 2.0 Integration**: Native Google Sign-In using Google Identity Services (GSI) SDK on the frontend and `google-auth-library` ID token verification on the backend.
- **User Profile Management**: Atomic user profile updates (`UserModel.updateProfile` using SQL `COALESCE`) for profile details without re-entering passwords.
- **Role-Based Access Control (RBAC)**: Role protection (`admin` vs `customer` / `user`) enforced across backend routes and Angular Auth Guards.
- **Angular HTTP Interceptors**: `AuthInterceptor` automatically attaches Bearer tokens; `ErrorInterceptor` handles 401/403 authorization failures gracefully.

### 💳 Backend-Driven Payment Gateway
- **Razorpay Integration**: Backend-driven checkout flow (`OrderService.js` & `order.service.ts`) where `razorpayKeyId` is fetched dynamically from the order creation response — zero hardcoded credentials on the frontend.
- **Order Tracking Stepper**: Track live order status stages (`Pending` → `Paid` → `Preparing` → `Out for Delivery` → `Delivered` / `Cancelled`).

### 🛠️ Admin Management & Analytics
- **Analytics Dashboard**: Real-time sales metrics including total revenue, order counts, active customers, and 7-day sales metrics.
- **Order Operations**: View all customer orders, filter by status, and update order statuses in real-time.
- **User Management**: Inspect registered users and toggle Admin/User roles.
- **Dish & Product Management**: Create and edit menu items with image URLs, category assignments, and pricing.

### ⏱️ Timestamp Localization & Dynamic Theming
- **Unix Epoch Storage**: Timestamps are stored and queried as Unix Epoch milliseconds (`(EXTRACT(EPOCH FROM created_at) * 1000)::bigint`).
- **Indian Standard Time (IST) Formatting**: Dates across orders, user profiles, and reviews are formatted in Indian Standard Time (`Asia/Kolkata`) with 12-hour AM/PM (`17 Sep 2026, 4:27 AM`) using Angular's built-in `DatePipe`.
- **Dark / Light Theme**: Built-in toggle supporting OS preferences, Signal state management (`ThemeService`), `localStorage` persistence, and smooth CSS transitions.

---

## 🛠️ Tech Stack

### Frontend (`frontend-angular`)
- **Framework**: Angular 19 (Standalone Components)
- **Language**: TypeScript
- **State Management**: Angular Signals & RxJS
- **Styling**: Tailwind CSS v4 & Glassmorphic CSS
- **Integrations**: Google Identity Services (GSI) SDK, Razorpay Checkout SDK

### Backend (`backend`)
- **Runtime**: Node.js & Express.js REST API
- **Database**: PostgreSQL on **Neon Database** (Native `pg` Connection Pool with SSL)
- **Authentication**: `jsonwebtoken` (JWT), `bcryptjs`, `google-auth-library`
- **Payment SDK**: `razorpay` Node SDK

---

## 📦 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/man31nu/Amrit-Rasoi-Restaurant-e-Commerce.git
cd Amrit-Rasoi-Restaurant-e-Commerce
```

### 2. Backend Configuration
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development

# Neon PostgreSQL Database URI
DATABASE_URL=postgresql://username:password@your-database-host.neon.tech/amrit_rasoi?sslmode=require

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key

# Razorpay Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Database Initialization
```bash
cd backend
npm run db:setup
```

### 4. Run Development Servers

#### Backend API (`http://localhost:5000`)
```bash
cd backend
npm install
npm run dev
```

#### Frontend Angular (`http://localhost:4200`)
```bash
cd frontend-angular
npm install
npm start
```

---

## 📁 Project Structure

```
Amrit-Rasoi-Restaurant-e-Commerce/
├── backend/
│   ├── api/
│   │   ├── config/          # PostgreSQL pool connection & credentials
│   │   ├── controllers/     # Auth, Cart, Coupon, Order, Product, Review controllers
│   │   ├── middlewares/     # JWT verification & error middlewares
│   │   ├── models/          # SQL database access models (UserModel, OrderModel, etc.)
│   │   ├── routes/          # Express API route endpoints
│   │   └── services/        # Business logic & Razorpay/Google authentication services
│   ├── prisma/              # PostgreSQL schema definition (schema_and_data.sql)
│   ├── scripts/             # DB setup script (setupDb.js)
│   ├── server.js            # Express server entry point
│   └── package.json
├── frontend-angular/
│   ├── src/
│   │   ├── app/
│   │   │   ├── Modules/     # Admin, Auth, Cart, Core, Home, Menu, Orders, Shared, User
│   │   │   ├── guards/      # Auth & Admin route guards
│   │   │   ├── interceptors/# HTTP Auth & Error interceptors
│   │   │   ├── models/      # TypeScript interfaces (User, Order, Product, Review)
│   │   │   └── services/    # Signals & RxJS state services (Auth, Cart, GoogleAuth, Theme)
│   │   ├── environments/    # Production & Development environment configs
│   │   └── styles.css       # Design tokens & global Dark mode overrides
│   ├── angular.json
│   └── package.json
├── vercel.json              # Vercel SPA build & API proxy rewrite configuration
└── README.md
```

---

## 🚢 Deployment Architecture

- **Frontend SPA**: Deployed on **Vercel** with automatic `/api/*` rewrites to Render backend.
- **Backend API**: Deployed on **Render** as a Node.js Web Service.
- **Database**: Cloud Serverless **Neon PostgreSQL**.

---

## 📜 License
ISC License

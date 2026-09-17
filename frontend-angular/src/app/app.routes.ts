import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./Modules/home/home.component').then(m => m.HomeComponent),
    title: 'Amrit Rasoi - Delicious Food Delivered',
  },
  {
    path: 'about',
    loadComponent: () => import('./Modules/info/about/about.component').then(m => m.AboutComponent),
    title: 'Our Story - Amrit Rasoi',
  },
  {
    path: 'contact',
    loadComponent: () => import('./Modules/info/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact Us - Amrit Rasoi',
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./Modules/menu/product-details/product-details.component').then(m => m.ProductDetailsComponent),
    title: 'Dish Details - Amrit Rasoi',
  },
  {
    path: 'cart',
    loadComponent: () => import('./Modules/cart/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard],
    title: 'Your Cart - Amrit Rasoi',
  },
  {
    path: 'orders',
    loadComponent: () => import('./Modules/orders/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard],
    title: 'Your Orders - Amrit Rasoi',
  },
  {
    path: 'profile',
    loadComponent: () => import('./Modules/user/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Profile - Amrit Rasoi',
  },
  {
    path: 'success',
    loadComponent: () => import('./Modules/orders/success/success.component').then(m => m.SuccessComponent),
    canActivate: [authGuard],
    title: 'Order Confirmed - Amrit Rasoi',
  },
  {
    path: 'admin',
    loadComponent: () => import('./Modules/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard],
    title: 'Admin Dashboard - Amrit Rasoi',
  },
  {
    path: 'admin/products/add',
    loadComponent: () => import('./Modules/admin/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [adminGuard],
    title: 'Add Dish - Admin',
  },
  {
    path: 'admin/products/edit/:id',
    loadComponent: () => import('./Modules/admin/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [adminGuard],
    title: 'Edit Dish - Admin',
  },
  {
    path: 'login',
    loadComponent: () => import('./Modules/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Sign In - Amrit Rasoi',
  },
  {
    path: 'signup',
    loadComponent: () => import('./Modules/auth/signup/signup.component').then(m => m.SignupComponent),
    title: 'Create Account - Amrit Rasoi',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

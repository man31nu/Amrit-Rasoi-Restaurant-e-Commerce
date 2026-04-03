import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { fetchCart } from './store/cartSlice'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import SuccessPage from './pages/SuccessPage'
import OrdersPage from './pages/OrdersPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductForm from './pages/admin/ProductForm'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PageWrapper from './components/PageWrapper'

const Footer = () => (
  <footer className="bg-gray-900 text-white py-8 border-t border-white/5">
    <div className="container mx-auto px-6 text-center text-gray-400 text-lg">
      &copy; 2026 Amrit Rasoi - by Mannu Yadav . All culinary rights reserved.
    </div>
  </footer>
)

export default function App() {
  const { user } = useAppSelector(s => s.auth)
  const { items } = useAppSelector(s => s.cart)
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    if (user) {
      dispatch(fetchCart())
    }
  }, [user, dispatch])



  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      <Toaster position="bottom-right" />
      <Navbar />

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            <Route path="/product/:id" element={<PageWrapper><ProductDetailsPage /></PageWrapper>} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <PageWrapper><CartPage /></PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/success" element={
              <ProtectedRoute>
                <PageWrapper><SuccessPage /></PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <PageWrapper><OrdersPage /></PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <PageWrapper><ProfilePage /></PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <PageWrapper><AdminDashboard /></PageWrapper>
              </AdminRoute>
            } />
            <Route path="/admin/products/add" element={
              <AdminRoute>
                <PageWrapper><ProductForm /></PageWrapper>
              </AdminRoute>
            } />
            <Route path="/admin/products/edit/:id" element={
              <AdminRoute>
                <PageWrapper><ProductForm /></PageWrapper>
              </AdminRoute>
            } />
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/signup" element={user ? <Navigate to="/" replace /> : <PageWrapper><SignupPage /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Floating Cart Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {items.reduce((acc, item) => acc + item.quantity, 0) > 0 && location.pathname !== '/cart' && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 20 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to="/cart"
                className="bg-orange-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <ShoppingCart className="w-7 h-7 relative z-10" />
                <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-orange-600">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}

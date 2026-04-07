import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, LogOut, Menu, X, UtensilsCrossed, Settings, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const [actualScrolled, setActualScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setActualScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkHeaderPage = location.pathname === '/' || location.pathname === '/about';
  const isScrolled = actualScrolled || !isDarkHeaderPage;

  // Close menus on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-600/30 group-hover:rotate-12 transition-transform duration-300">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <span className={`text-2xl font-black tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            Amrit<span className="text-orange-600">Rasoi</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`font-bold transition-colors ${
              location.pathname === '/' 
                ? 'text-orange-600' 
                : isScrolled ? 'text-gray-600 hover:text-orange-600' : 'text-gray-200 hover:text-white'
            }`}
          >
            Menu
          </Link>
          <Link 
            to="/about" 
            className={`font-bold transition-colors ${
              location.pathname === '/about' 
                ? 'text-orange-600' 
                : isScrolled ? 'text-gray-600 hover:text-orange-600' : 'text-gray-200 hover:text-white'
            }`}
          >
            Our Story
          </Link>
          <Link 
            to="/contact" 
            className={`font-bold transition-colors ${
              location.pathname === '/contact' 
                ? 'text-orange-600' 
                : isScrolled ? 'text-gray-600 hover:text-orange-600' : 'text-gray-200 hover:text-white'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <Link 
            to="/cart" 
            className={`relative p-2 rounded-xl transition-all ${
              isScrolled ? 'bg-gray-100 text-gray-900 hover:bg-orange-50' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-orange-600/40"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl border transition-all ${
                  isScrolled 
                    ? 'border-gray-200 bg-white hover:border-orange-200' 
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <p className="text-xs font-medium opacity-60">Welcome back,</p>
                  <p className="text-sm font-bold">{user.name.split(' ')[0]}</p>
                </div>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-50">
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="p-2">
                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors">
                             <ShieldCheck className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                       <Link to="/orders" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors">
                          <ShoppingBag className="w-4 h-4" /> My Orders
                       </Link>
                       <Link to="/profile" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors">
                          <User className="w-4 h-4" /> Profile
                       </Link>
                       <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
                       >
                          <LogOut className="w-4 h-4" /> Logout
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
               <Link 
                to="/login"
                className={`font-bold text-sm px-4 py-2 transition-colors ${isScrolled ? 'text-gray-600 hover:text-orange-600' : 'text-gray-300 hover:text-white'}`}
              >
                Login
              </Link>
              <Link 
                to="/signup"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
           {/* Cart Link (Mobile) */}
           <Link 
            to="/cart" 
            className={`relative p-2 rounded-xl h-10 w-10 flex items-center justify-center ${
              isScrolled ? 'bg-gray-100 text-gray-900' : 'bg-white/10 text-white'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-xl transition-colors ${
              isScrolled ? 'text-gray-900 bg-gray-100' : 'text-white bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col p-8 overflow-y-auto"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-gray-900">
                  Amrit<span className="text-orange-600">Rasoi</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-gray-100 text-gray-900 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-6 mb-12">
              {[
                { name: 'Menu', path: '/' },
                { name: 'Our Story', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    className={`text-4xl font-black transition-colors ${
                      location.pathname === link.path ? 'text-orange-600' : 'text-gray-900 hover:text-orange-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Auth/Profile Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto border-t border-gray-100 pt-8"
            >
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {user.role === 'admin' && (
                      <Link to="/admin" className="col-span-2 flex items-center justify-center gap-3 p-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                        <ShieldCheck className="w-6 h-6" /> Admin Panel
                      </Link>
                    )}
                    <Link to="/orders" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl text-gray-600 font-bold hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100">
                      <ShoppingBag className="w-6 h-6" />
                      <span className="text-xs">Orders</span>
                    </Link>
                    <Link to="/profile" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl text-gray-600 font-bold hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100">
                      <User className="w-6 h-6" />
                      <span className="text-xs">Profile</span>
                    </Link>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-600 p-5 rounded-2xl font-bold text-lg hover:bg-red-100 transition-all"
                  >
                    <LogOut className="w-6 h-6" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/signup" 
                    className="bg-orange-600 text-white p-5 rounded-2xl font-bold text-xl text-center shadow-xl shadow-orange-600/20"
                  >
                    Join Now
                  </Link>
                  <Link 
                    to="/login" 
                    className="bg-gray-100 text-gray-900 p-5 rounded-2xl font-bold text-xl text-center border border-gray-200"
                  >
                    Login
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

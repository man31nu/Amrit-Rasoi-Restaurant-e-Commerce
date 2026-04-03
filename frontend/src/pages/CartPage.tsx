import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateQuantity, removeFromCart, clearCart } from '../store/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { items, loading: cartLoading } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      return;
    }

    try {
      setCheckoutLoading(true);

      // 1. Create order on backend
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: total
      };

      const { data } = await api.post('/orders/create', orderData);

      // 2. Initialize Razorpay
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: data.amount,
        currency: data.currency,
        name: 'RestaurantX',
        description: 'Quality Food Delivery',
        image: '/logo.svg', // Replace with your logo
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/orders/verify', {
              ...response,
              dbOrderId: data.dbOrderId
            });

            if (verifyRes.data.success) {
              toast.success('Payment Successful! Check your email for confirmation.');
              dispatch(clearCart());
              navigate('/');
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#EA580C', // orange-600
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout initialization failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center bg-gray-50/50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-orange-200 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-white p-12 rounded-[3.5rem] shadow-2xl border border-orange-100/50">
            <div className="bg-orange-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform">
              <ShoppingBag className="w-12 h-12 text-orange-600" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Your cart is <span className="text-orange-600">empty</span></h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
              Hungry? We've got thousands of delicious dishes waiting for you.
              Let's find your first meal!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-orange-600/20 transition-all hover:shadow-orange-600/40 active:scale-95 group"
            >
              Start Ordering <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-30 grayscale pointer-events-none mt-12 max-w-4xl mx-auto">
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50/50">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">
          Your <span className="text-orange-600">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: index * 0.05,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    x: -20,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center gap-4 sm:gap-6 group relative overflow-hidden"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden flex-shrink-0 relative">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">{item.product.category}</p>
                        <h3 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">{item.product.name}</h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Per Item</span>
                        <span className="text-xl font-black text-gray-900">
                          ₹{item.product.price.toFixed(0)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 bg-gray-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: Math.max(0, item.quantity - 1) }))}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-white rounded-xl shadow-sm transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="font-black text-gray-900 min-w-[20px] text-center text-lg">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity + 1 }))}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-white rounded-xl shadow-sm transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">
                    {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[10px] text-orange-600 font-medium">Free delivery on orders over ₹500.00</p>
                )}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-orange-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className={`w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20 transition-all hover:shadow-orange-600/40 active:scale-95 ${checkoutLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {checkoutLoading ? 'Processing...' : 'Checkout'} <CreditCard className="w-6 h-6" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

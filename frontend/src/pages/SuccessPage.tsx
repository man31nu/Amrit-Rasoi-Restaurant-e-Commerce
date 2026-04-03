import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { clearCart } from '../store/cartSlice';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Clear cart on successful payment
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50/50">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-green-600/5 text-center border border-gray-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Order <span className="text-green-600">Successful!</span>
          </h1>
          
          <p className="text-gray-500 mb-8 text-lg">
            Thank you for your purchase. Your delicious meal is being prepared 
            and will be on its way shortly.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100 flex flex-col gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
            <p className="font-mono text-sm text-gray-600 truncate">{sessionId || 'ORD-SYNCING...'}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" /> View My Orders
            </Link>
            <Link
              to="/"
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              Back to Menu <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Clock, CheckCircle, ArrowLeft, Plus, Minus, ChefHat } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity }));
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: 'spring',
              damping: 20,
              stiffness: 100
            }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-600/5 border border-gray-100 group">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto aspect-square object-cover"
              />
            </div>
            
            {/* Overlay Badges */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute top-8 left-8 flex flex-col gap-3"
            >
               <span className="bg-white/90 backdrop-blur-xl px-6 py-2.5 rounded-2xl text-orange-600 font-black text-xs shadow-xl uppercase tracking-[0.2em] border border-orange-100/50">
                 {product.category}
               </span>
               <div className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xl">
                 <Star className="w-4 h-4 fill-orange-500 text-orange-500" /> 4.9 <span className="opacity-50 font-medium">Rating</span>
               </div>
            </motion.div>
          </motion.div>

          {/* Details Section */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-4 text-gray-400 mb-6 h-6">
                 <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                   <CheckCircle className="w-3.5 h-3.5" /> In Stock
                 </span>
                 <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                 <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                   <Clock className="w-3.5 h-3.5" /> 20-30 min
                 </span>
              </div>

              <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-[0.9]">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pricing</span>
                <span className="text-5xl font-black text-orange-600 tracking-tighter">
                  ₹{product.price.toFixed(0)}
                </span>
              </div>

              <div className="bg-gray-50/50 border border-gray-100 p-8 rounded-[2.5rem] mb-10 relative overflow-hidden">
                <h3 className="font-black text-gray-900 mb-4 uppercase text-[10px] tracking-[0.3em] opacity-40">Culinary Notes</h3>
                <p className="text-gray-500 leading-relaxed text-lg font-medium relative z-10">
                  {product.description}
                </p>
                <ChefHat className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-100/50 -rotate-12" />
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-gray-100 w-full sm:w-auto shadow-sm">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-600 hover:text-orange-600 rounded-2xl transition-all"
                  >
                    <Minus className="w-6 h-6" />
                  </motion.button>
                  <span className="font-black text-2xl text-gray-900 w-10 text-center">{quantity}</span>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-600 hover:text-orange-600 rounded-2xl transition-all"
                  >
                    <Plus className="w-6 h-6" />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(234, 88, 12, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 px-10 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all"
                >
                  Add to Cart <ShoppingCart className="w-7 h-7" />
                </motion.button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-2 gap-6 mt-16">
                 <div className="flex flex-col gap-4 p-8 rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
                   <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                     🚚
                   </div>
                   <div>
                     <h4 className="font-black text-gray-900 text-sm uppercase tracking-tighter">Express Delivery</h4>
                     <p className="text-xs text-gray-400 font-bold">Free on orders above ₹500</p>
                   </div>
                 </div>
                 <div className="flex flex-col gap-4 p-8 rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
                   <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                     🌿
                   </div>
                   <div>
                     <h4 className="font-black text-gray-900 text-sm uppercase tracking-tighter">Organic Choice</h4>
                     <p className="text-xs text-gray-400 font-bold">100% Fresh Ingredients</p>
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ 
        duration: 0.6,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-shadow duration-500 border border-gray-100/50 group relative"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-orange-600 shadow-sm border border-orange-100"
        >
          {product.category}
        </motion.div>

        <div className="absolute top-4 right-4 bg-orange-600 text-white p-2 rounded-2xl shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Star className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Price</span>
            <span className="text-2xl font-black text-gray-900">
              ₹{product.price.toFixed(0)}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-orange-600 text-white rounded-2xl transition-colors shadow-xl shadow-gray-200 hover:shadow-orange-200 group/btn"
          >
            <Plus className="w-6 h-6 transition-transform group-hover/btn:rotate-90" />
          </motion.button>
        </div>
      </div>

      {/* Popular Tag */}
      {index < 3 && (
        <div className="absolute -right-12 top-6 bg-yellow-400 text-yellow-900 text-[10px] font-black px-12 py-1 rotate-45 shadow-sm">
          POPULAR
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;

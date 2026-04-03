import React from 'react';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm h-[420px] animate-pulse border border-gray-100 flex flex-col">
            <div className="bg-gray-200 h-48 w-full"></div>
            <div className="p-5 flex-grow space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-7 w-3/5 bg-gray-200 rounded-lg"></div>
                <div className="h-7 w-1/4 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                <div className="h-4 w-4/5 bg-gray-100 rounded-md"></div>
              </div>
              <div className="pt-6 mt-auto border-t border-gray-50 flex justify-between items-center">
                <div className="h-4 w-1/3 bg-gray-100 rounded-full"></div>
                <div className="h-11 w-24 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🍽️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-500">Try selecting a different category or refining your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;

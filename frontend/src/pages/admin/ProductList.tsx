import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, Box, Search, Filter, MoreVertical, IndianRupee } from 'lucide-react';
import api from '../../services/api';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error: any) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to retire this creation from the menu?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Creation retired successfully');
        fetchProducts();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Retirement failed');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full"
        />
        <p className="text-gray-500 font-bold animate-pulse">Curating your menu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Menu <span className="text-orange-600">Inventory</span>
          </h2>
          <p className="text-gray-500 font-medium mt-1">Manage your artisanal culinary offerings.</p>
        </div>
        <Link
          to="/admin/products/add"
          className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:shadow-2xl hover:shadow-orange-600/20 active:scale-95 transition-all w-fit"
        >
          <Plus className="w-5 h-5" /> Add New Creation
        </Link>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or category..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-bold text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl px-8 py-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 leading-none">{products.length}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Items Total</div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-gray-50 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Creation Details</th>
                  <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Investment (₹)</th>
                  <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, idx) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-orange-50/30 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-lg leading-tight">{product.name}</div>
                            <div className="text-xs text-gray-400 font-bold mt-1 max-w-xs truncate">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1 font-black text-gray-900">
                          <span className="text-orange-600">₹</span>{product.price}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Refine Creation"
                          >
                            <Edit2 size={20} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(product.id)}
                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Retire Creation"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[2rem] flex items-center justify-center mb-6">
              <Box className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Inventory Empty</h3>
            <p className="text-gray-500 font-medium max-w-sm">No culinary creations found. Start adding your first artisanal dish to the menu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

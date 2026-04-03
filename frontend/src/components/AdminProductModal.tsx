import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Pizza', 'Burgers', 'Salads'];

const AdminProductModal: React.FC<AdminProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
      });
      setImagePreview(product.imageUrl);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: CATEGORIES[0],
      });
      setImagePreview(null);
      setImage(null);
    }
  }, [product, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (image) {
      data.append('image', image);
    }

    try {
      setLoading(true);
      if (product) {
        await api.put(`/products/${product.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">
              {product ? 'Edit' : 'Add'} <span className="text-orange-600">Product</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side: Inputs */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Classic Wagyu Burger"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 outline-none focus:ring-2 focus:ring-orange-600/20 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="12.99"
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 outline-none focus:ring-2 focus:ring-orange-600/20 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 outline-none focus:ring-2 focus:ring-orange-600/20 transition-all font-bold appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell your customers about this dish..."
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 outline-none focus:ring-2 focus:ring-orange-600/20 transition-all font-medium resize-none"
                  />
                </div>
              </div>

              {/* Right Side: Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                <div className="relative group">
                  <div className={`w-full aspect-square rounded-[2rem] border-4 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-orange-600/20' : 'border-gray-100 hover:border-orange-600/20 hover:bg-orange-50/50'}`}>
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-bold flex items-center gap-2 cursor-pointer">
                            <Upload className="w-5 h-5" /> Change Image
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center px-6">
                        <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8 text-orange-600" />
                        </div>
                        <p className="font-bold text-gray-900 mb-1">Click to upload</p>
                        <p className="text-xs text-gray-400">High quality JPG or PNG (Max 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-900 py-5 rounded-[1.5rem] font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                type="submit"
                className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-[1.5rem] font-bold shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminProductModal;

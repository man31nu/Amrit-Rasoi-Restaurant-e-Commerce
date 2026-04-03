import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Upload, X, Save, ArrowLeft, Utensils, IndianRupee, Tag, FileText } from 'lucide-react';
import api from '../../services/api';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        category: data.category,
      });
      setPreview(data.imageUrl);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch product');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (image) {
      data.append('image', image);
    }

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created successfully');
      }
      navigate('/admin'); // Navigate back to main dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isEdit ? 'Refine' : 'Add New'} <span className="text-orange-600">Creation</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Crafting premium culinary experiences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <motion.form 
              onSubmit={handleSubmit}
              className="bg-white rounded-[2.5rem] shadow-xl shadow-orange-900/5 p-8 md:p-10 border border-gray-100 space-y-8"
            >
              <div className="space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest pl-1">
                    <Utensils className="w-4 h-4 text-orange-500" />
                    Dish Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Truffle Infused Paneer"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Categories & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest pl-1">
                      <Tag className="w-4 h-4 text-orange-500" />
                      Category
                    </label>
                    <select
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select Genre</option>
                      <option value="Veg Main Course">Veg Main Course</option>
                      <option value="Non-Veg Main Course">Non-Veg Main Course</option>
                      <option value="Pizza">Artisan Pizza</option>
                      <option value="Burgers">Gourmet Burgers</option>
                      <option value="Desserts">Sweet Delights</option>
                      <option value="Drinks">Premium Spirits</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest pl-1">
                      <IndianRupee className="w-4 h-4 text-orange-500" />
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Amount in ₹"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-gray-800"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest pl-1">
                    <FileText className="w-4 h-4 text-orange-500" />
                    The Story (Description)
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the craft, the ingredients, and the passion..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-gray-800 placeholder:text-gray-300 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-5 rounded-[2rem] font-black text-lg hover:shadow-2xl hover:shadow-orange-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Save className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      {isEdit ? 'Update Creation' : 'Publish Dish'}
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>

          {/* Right Sidebar - Image Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-orange-900/5 border border-gray-100">
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-6">
                Culinary Visual
              </label>
              
              <div className="relative group overflow-hidden rounded-[2rem] border-2 border-dashed border-gray-100 hover:border-orange-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                />
                
                {preview ? (
                  <div className="relative aspect-square">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white p-3 rounded-full text-gray-900 font-bold flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Change Image
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-gray-900 font-bold">Select Dish Image</p>
                    <p className="text-gray-400 text-sm mt-1">High-quality JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                  <p className="text-sm font-medium text-orange-900/70 italic text-center">
                    "Visuals determine 80% of culinary desire. Shoot for beauty."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductForm;

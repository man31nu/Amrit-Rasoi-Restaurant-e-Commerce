import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Save, Camera, CheckCircle2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateUser } from '../store/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const { data } = await api.put('/auth/profile', updateData);
      
      dispatch(updateUser({
        name: data.name,
        email: data.email,
      }));
      
      toast.success('Profile updated successfully', {
        icon: <CheckCircle2 className="text-green-500" />,
      });
      
      // Clear password fields
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(true);
      // Artificial delay for better UX feel
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Left Column: Avatar & Summary */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-inner">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-gray-600 hover:text-orange-600 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-gray-500 text-sm mb-6 uppercase tracking-widest font-bold">Member since 2026</p>
              
              <div className="flex flex-col gap-3">
                 <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-tighter mb-1">Total Orders</p>
                    <p className="text-2xl font-black text-gray-900">12</p>
                 </div>
                 <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-tighter mb-1">Account Status</p>
                    <p className="text-2xl font-black text-gray-900">Verified</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account <span className="text-orange-600">Settings</span></h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-600/20 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-600/20 transition-all cursor-not-allowed opacity-70"
                        placeholder="john@example.com"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-600/20 transition-all"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Shipping Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-600/20 transition-all resize-none"
                        placeholder="Your residential address..."
                      />
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Security</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 font-bold focus:ring-2 focus:ring-orange-600/20 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 font-bold focus:ring-2 focus:ring-orange-600/20 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-black px-10 py-5 rounded-[1.5rem] shadow-2xl shadow-orange-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                  >
                    {loading ? (
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <><Save className="w-5 h-5" /> Save Changes</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;

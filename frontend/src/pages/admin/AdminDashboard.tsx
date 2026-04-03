import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBox, FiShoppingBag, FiUsers, FiPieChart, FiArrowRight } from 'react-icons/fi';
import ProductList from './ProductList';
import AdminOrderList from './AdminOrderList';
import AdminUserList from './AdminUserList';
import AdminAnalytics from './AdminAnalytics';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users' | 'stats'>('stats');

  const menuItems = [
    { id: 'stats', label: 'Overview', icon: <FiPieChart /> },
    { id: 'products', label: 'Inventory', icon: <FiBox /> },
    { id: 'orders', label: 'Live Orders', icon: <FiShoppingBag /> },
    { id: 'users', label: 'User Roles', icon: <FiUsers /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <FiPieChart className="text-white text-xl" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">RESTO<span className="text-orange-600 text-[10px] align-top ml-1">ADMIN</span></span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Management Portal</p>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full group flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all relative overflow-hidden ${
                activeTab === item.id
                  ? 'text-orange-600 bg-orange-50/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1.5 h-6 bg-orange-600 rounded-r-full"
                />
              )}
              <span className={`text-xl transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-orange-600' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {activeTab === item.id && <FiArrowRight className="text-orange-400" />}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-gray-900 rounded-[2rem] p-6 relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">System Status</p>
               <h4 className="text-white font-black text-lg mb-4">All Systems Live</h4>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                 <span className="text-green-400 text-xs font-bold">Encrypted Connection</span>
               </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md px-10 py-6 border-b border-gray-100 flex justify-between items-center z-20">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              <span>Admin</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-orange-600">{activeTab}</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col text-right">
               <span className="text-sm font-bold text-gray-900">John Admin</span>
               <span className="text-[10px] font-bold text-green-600 uppercase">Superuser</span>
             </div>
             <div className="w-12 h-12 bg-gray-100 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center font-black text-gray-500">JA</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'products' && <ProductList />}
              {activeTab === 'orders' && <AdminOrderList />}
              {activeTab === 'users' && <AdminUserList />}
              {activeTab === 'stats' && <AdminAnalytics />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

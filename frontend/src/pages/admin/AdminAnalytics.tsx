import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign, FiCalendar } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  salesByDate: Record<string, number>;
}

const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/orders/analytics');
        setData(res.data);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-white rounded-[2.5rem] animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: 'Total Revenue', value: `₹${data.totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: data.totalOrders.toString(), icon: <FiShoppingBag />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Active Users', value: data.activeUsers.toString(), icon: <FiUsers />, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  // Prepare chart data
  const chartDates = Object.keys(data.salesByDate).sort();
  const maxSale = Math.max(...Object.values(data.salesByDate), 100);

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl hover:shadow-orange-600/5 transition-all"
          >
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs font-bold text-green-600">
                <FiTrendingUp /> Live Data
              </div>
            </div>
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Trends Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">
              <FiCalendar /> Latest 7 Days
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Sales <span className="text-orange-600">Trends</span></h3>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Daily Sale</p>
             <p className="text-xl font-black text-gray-900">₹{(data.totalRevenue / 7).toFixed(0)}</p>
          </div>
        </div>

        <div className="flex items-end justify-between h-64 gap-4 px-4 border-b border-gray-100 pb-2">
          {chartDates.length > 0 ? (
            chartDates.map((date, idx) => {
              const value = data.salesByDate[date];
              const height = (value / maxSale) * 100;
              return (
                <div key={date} className="flex-1 flex flex-col items-center group relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: "circOut" }}
                    className="w-full max-w-[40px] bg-gray-100 group-hover:bg-orange-600 rounded-t-xl transition-colors relative"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl">
                      ₹{value.toLocaleString()}
                    </div>
                  </motion.div>
                  <span className="text-[9px] font-black text-gray-400 mt-4 uppercase rotate-45 sm:rotate-0 pt-2 lg:pt-0">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center text-gray-300 font-bold italic">
              No sales data for the last 7 days.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;

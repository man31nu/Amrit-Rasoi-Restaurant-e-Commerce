import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Package, Clock, CheckCircle, ExternalLink, Truck, MapPin, UtensilsCrossed } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const StatusStepper = ({ currentStatus }: { currentStatus: string }) => {
  const steps = [
    { id: 'paid', label: 'Confirmed', icon: CheckCircle },
    { id: 'preparing', label: 'Kitchen', icon: UtensilsCrossed },
    { id: 'out-for-delivery', label: 'Shipping', icon: Truck },
    { id: 'delivered', label: 'Arrived', icon: MapPin },
  ];

  if (currentStatus === 'cancelled') {
    return (
      <div className="py-6 px-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 mb-6">
        <Package className="w-5 h-5" />
        <span className="font-bold text-sm">This order has been cancelled and refunded.</span>
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.id === currentStatus);
  // Handle pending or unknown statuses as index 0 (if paid/preparing/etc hasn't happened yet)
  const activeIdx = currentIdx === -1 ? (currentStatus === 'pending' ? -1 : 0) : currentIdx;

  return (
    <div className="py-10 px-2 lg:px-6 relative mb-4">
      <div className="absolute top-[48px] left-10 right-10 h-[2px] bg-gray-100 -z-0">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: activeIdx < 0 ? 0 : `${(activeIdx / (steps.length - 1)) * 100}%` }}
          className="h-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.3)]"
          transition={{ duration: 1.5, ease: "circOut" }}
        />
      </div>
      
      <div className="relative flex justify-between z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= activeIdx;
          const isActive = idx === activeIdx;

          return (
            <div key={idx} className="flex flex-col items-center gap-3">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#ea580c' : '#ffffff',
                  borderColor: isCompleted ? '#ea580c' : '#f3f4f6',
                  scale: isActive ? [1, 1.15, 1] : 1,
                  boxShadow: isActive ? '0 0 20px rgba(234,88,12,0.2)' : '0 10px 15px -3px rgba(0,0,0,0.02)'
                }}
                transition={{
                  scale: isActive ? { repeat: Infinity, duration: 2 } : { duration: 0.3 }
                }}
                className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-colors`}
              >
                <Icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-gray-300'}`} />
              </motion.div>
              <div className="flex flex-col items-center">
                <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[0.1em] text-center ${
                  isCompleted ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-dot" 
                    className="w-1 h-1 bg-orange-600 rounded-full mt-1" 
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 animate-pulse">Your Orders</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100 p-8 rounded-full mb-6">
          <Package className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">No orders yet</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          You haven't placed any orders yet. Once you do, they will appear here!
        </p>
        <Link 
          to="/"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95"
        >
           Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50/50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center justify-between mb-10">
           <h1 className="text-4xl font-black text-gray-900 tracking-tight">
             Your <span className="text-orange-600">Orders</span>
           </h1>
           <span className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 shadow-sm">
             Total: {orders.length}
           </span>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-orange-600/5 transition-all group"
            >
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                       <ShoppingBag className="w-7 h-7 text-orange-600" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                       <div className="flex items-center gap-2 text-gray-900 font-bold">
                          <Clock className="w-4 h-4 text-orange-500" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                             month: 'long',
                             day: 'numeric',
                             year: 'numeric'
                          })}
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-6">
                    <div className="text-right">
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                       <p className="text-2xl font-black text-orange-600">${order.totalAmount.toFixed(2)}</p>
                    </div>
                 </div>
              </div>

              <StatusStepper currentStatus={order.status} />

              <div className="space-y-4">
                 {order.items.map((item: any) => (
                   <div key={item.id} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl overflow-hidden grayscale group-hover/item:grayscale-0 transition-all duration-500">
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="font-bold text-gray-900">{item.product.name}</p>
                            <p className="text-xs text-gray-500">{item.quantity} x ${item.price.toFixed(2)}</p>
                         </div>
                      </div>
                      <Link to={`/product/${item.productId}`} className="p-2 text-gray-300 hover:text-orange-600 transition-colors">
                         <ExternalLink className="w-4 h-4" />
                      </Link>
                   </div>
                 ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                 <button className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Order Details <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

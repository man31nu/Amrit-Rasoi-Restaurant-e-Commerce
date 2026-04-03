import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiPackage, FiTruck, FiXCircle } from 'react-icons/fi';

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/all');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock className="text-orange-500" />;
      case 'paid': return <FiCheckCircle className="text-blue-500" />;
      case 'preparing': return <FiPackage className="text-purple-500" />;
      case 'out-for-delivery': return <FiTruck className="text-indigo-500" />;
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiClock />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider";
    switch (status) {
      case 'pending': return `${base} bg-orange-100 text-orange-700`;
      case 'paid': return `${base} bg-blue-100 text-blue-700`;
      case 'preparing': return `${base} bg-purple-100 text-purple-700`;
      case 'out-for-delivery': return `${base} bg-indigo-100 text-indigo-700`;
      case 'delivered': return `${base} bg-green-100 text-green-700`;
      case 'cancelled': return `${base} bg-red-100 text-red-700`;
      default: return `${base} bg-gray-100 text-gray-700`;
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading orders...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Items</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-400">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{order.user?.name}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {order.items.map((item: any) => (
                      <span key={item.id} className="text-xs text-gray-600">
                        {item.quantity}x {item.product?.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  ₹{order.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="text-sm border border-gray-200 rounded-lg p-1 outline-none focus:border-orange-500"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="preparing">Preparing</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;

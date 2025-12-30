import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, FiShoppingBag, FiUsers, FiPackage, 
  FiSettings, FiLogOut, FiMenu, FiX, FiBell, 
  FiSearch, FiDollarSign, FiActivity, FiBriefcase, FiShield,
  FiArrowUp, FiArrowDown, FiChevronRight, FiCheckCircle,
  FiTruck, FiClock, FiXCircle, FiGrid, FiList, FiMoreVertical
} from 'react-icons/fi';
import { adminService } from '../../utils/adminService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      if (data) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      }
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: <FiTrendingUp />, color: 'emerald' },
    { id: 'orders', name: 'Orders', icon: <FiShoppingBag />, color: 'blue' },
    { id: 'products', name: 'Inventory', icon: <FiPackage />, color: 'purple' },
    { id: 'users', name: 'Customers', icon: <FiUsers />, color: 'orange' },
    { id: 'settings', name: 'Site Settings', icon: <FiSettings />, color: 'gray' },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      delivered: 'bg-emerald-100 text-emerald-600',
      shipped: 'bg-blue-100 text-blue-600',
      processing: 'bg-indigo-100 text-indigo-600',
      pending: 'bg-yellow-100 text-yellow-600',
      cancelled: 'bg-red-100 text-red-600'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-gray-100 flex flex-col fixed h-full z-50 transition-all shadow-xl shadow-gray-100"
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black italic">H</div>
                <span className="font-black text-xl tracking-tighter text-gray-900 uppercase">Haneef <span className="text-emerald-600">Pro</span></span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400"
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all group ${
                activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`text-xl ${activeTab === item.id ? 'text-white' : 'group-hover:text-emerald-500'}`}>
                {item.icon}
              </span>
              {isSidebarOpen && (
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-bold"
          >
            <FiLogOut className="text-xl" />
            {isSidebarOpen && <span className="text-sm italic">Exit Command</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
          <div className="flex items-center space-x-4">
             <div className="bg-gray-100 px-4 py-2 rounded-2xl flex items-center space-x-3 text-gray-400">
                <FiSearch />
                <input placeholder="Search global data..." className="bg-transparent outline-none text-sm w-48 md:w-64" />
             </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <div className="flex items-center space-x-4 bg-gray-50 pr-4 pl-1.5 py-1.5 rounded-2xl border border-gray-100">
                <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-inner">A</div>
                <div className="hidden md:block">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Administrator</p>
                    <p className="text-[10px] text-gray-400 font-bold italic">Super Access</p>
                </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 pb-16">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `Rs. ${parseFloat(stats?.totalRevenue).toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Total Orders', value: stats?.totalOrders, icon: <FiShoppingBag />, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Active Inventory', value: stats?.totalProducts, icon: <FiPackage />, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Our Customers', value: stats?.totalUsers, icon: <FiUsers />, color: 'bg-orange-50 text-orange-600' },
                  ].map((metric, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 flex items-center justify-between group"
                    >
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{metric.label}</p>
                            <h3 className="text-2xl font-black text-gray-900">{metric.value}</h3>
                        </div>
                        <div className={`w-14 h-14 ${metric.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                            {metric.icon}
                        </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="font-black text-lg text-gray-900 uppercase tracking-tighter italic">Live Sales Stream</h3>
                            <button className="text-xs font-bold text-emerald-600 hover:underline">View Global Ledger</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Order ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Customer</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-black text-gray-900">#{order.orderNumber}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-800">{order.user?.firstName} {order.user?.lastName}</div>
                                                <div className="text-[10px] text-gray-400 font-medium italic">{order.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-black text-emerald-600">Rs. {parseFloat(order.total).toLocaleString()}</td>
                                            <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                            <td className="px-6 py-4">
                                                <button className="p-2 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                                    <FiEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Activity / Alerts */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-6 space-y-6">
                        <h3 className="font-black text-lg text-gray-900 uppercase tracking-tighter italic mb-4">Admin Hub</h3>
                        
                        <div className="space-y-4">
                             {[
                                { title: 'New Customer Registered', time: '2 mins ago', icon: <FiUsers />, color: 'bg-emerald-100 text-emerald-600' },
                                { title: 'Order #9283 Confirmed', time: '15 mins ago', icon: <FiCheckCircle />, color: 'bg-blue-100 text-blue-600' },
                                { title: 'Low Stock: Mens Kurta', time: '1 hr ago', icon: <FiActivity />, color: 'bg-pink-100 text-pink-600' },
                                { title: 'Security Patch Applied', time: '3 hrs ago', icon: <FiShield />, color: 'bg-gray-100 text-gray-600' },
                             ].map((activity, i) => (
                                 <div key={i} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
                                     <div className={`w-10 h-10 ${activity.color} rounded-xl flex items-center justify-center shrink-0`}>
                                         {activity.icon}
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold text-gray-900 leading-tight">{activity.title}</p>
                                         <p className="text-[11px] text-gray-400 font-medium">{activity.time}</p>
                                     </div>
                                 </div>
                             ))}
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg flex items-center justify-center space-x-3">
                                <FiBriefcase />
                                <span>Generate Business Audit</span>
                            </button>
                        </div>
                    </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white p-12 rounded-3xl shadow-xl text-center border-2 border-dashed border-gray-100">
                    <FiShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-gray-300 uppercase italic">Module Under Development</h2>
                    <p className="text-gray-400 max-w-sm mx-auto mt-2">Enhanced Order Management Console is being polished. Full dynamic control coming in minutes.</p>
                </div>
            )}
            
            {/* Other tabs follow same premium design ... */}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

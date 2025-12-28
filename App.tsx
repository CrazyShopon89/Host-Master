
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AIAssistant from './components/AIAssistant';
import { 
  Bell, 
  LogOut, 
  User, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Clock,
  Check
} from 'lucide-react';
import { Notification } from './types';

// Header Component
const Header: React.FC = () => {
  const { notifications, markNotificationRead, settings } = useData();
  const { user, logout } = useAuth();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  if (!user) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="text-green-500" />;
      case 'error': return <AlertCircle size={18} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={18} className="text-yellow-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  const handleNotificationClick = (n: Notification) => {
    markNotificationRead(n.id);
    setSelectedNotification(n);
    setShowNotifs(false);
  };

  const handleMarkAllRead = () => {
    notifications.filter(n => !n.read).forEach(n => markNotificationRead(n.id));
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 no-print">
       {/* Mobile Menu Trigger */}
       <button className="md:hidden text-gray-600">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
       </button>
       
       <h2 className="text-lg font-semibold text-gray-700 hidden md:block">Admin Panel</h2>

       <div className="flex items-center gap-4">
           {/* Notifications */}
           <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative transition-colors">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40 animate-slide-up">
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <span className="font-bold text-sm text-gray-800">Notifications</span>
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider transition-colors"
                        >
                          Mark all read
                        </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell size={32} className="mx-auto text-gray-200 mb-2" />
                                <p className="text-xs text-gray-400">Everything is up to date.</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    onClick={() => handleNotificationClick(n)}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex gap-3 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={`text-sm font-semibold truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {n.title}
                                            </p>
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Date(n.date).toLocaleDateString()} at {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-50 text-center">
                        <button className="text-xs font-medium text-gray-500 hover:text-gray-800">View all alerts</button>
                      </div>
                    )}
                </div>
              )}
           </div>

           {/* Profile Dropdown */}
           <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
              >
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-gray-200" 
                  />
                  <div className="hidden md:block text-left">
                      <div className="text-sm text-gray-700 font-medium leading-none">{user.name}</div>
                      <div className="text-[10px] text-gray-400 mt-1 leading-none">{user.role}</div>
                  </div>
              </button>

              {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-40">
                      <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <User size={16} />
                          My Profile
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogOut size={16} />
                          Log Out
                      </button>
                  </div>
              )}
           </div>
       </div>

       {/* Notification Detail Modal */}
       {selectedNotification && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white shadow-sm border border-gray-100`}>
                        {getNotificationIcon(selectedNotification.type)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedNotification.title}</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedNotification.type} alert</span>
                      </div>
                  </div>
                  <button onClick={() => setSelectedNotification(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                      <X size={20} />
                  </button>
              </div>
              <div className="p-8">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedNotification.message}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      Received on {new Date(selectedNotification.date).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check size={14} className="text-green-500" />
                      Status: Read
                    </div>
                  </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className={`px-8 py-2.5 bg-${settings.themeColor}-600 hover:bg-${settings.themeColor}-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95`}
                >
                  Dismiss
                </button>
              </div>
            </div>
         </div>
       )}
    </header>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const Layout: React.FC = () => {
    const { user } = useAuth();

    if (!user) return <Login />;

    return (
        <div className="flex min-h-screen bg-[#f3f4f6]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden no-scrollbar">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<div className="text-center mt-20 text-gray-500">Page not found</div>} />
                    </Routes>
                </main>
            </div>
            <AIAssistant />
        </div>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
           <Routes>
             <Route path="/login" element={<Login />} />
             <Route path="/*" element={
               <ProtectedRoute>
                  <Layout />
               </ProtectedRoute>
             } />
           </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;

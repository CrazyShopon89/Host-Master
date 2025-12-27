import React from 'react';
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
import { Bell, LogOut, User } from 'lucide-react';

// Header Component
const Header: React.FC = () => {
  const { notifications, markNotificationRead, settings } = useData();
  const { user, logout } = useAuth();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [showNotifs, setShowNotifs] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40">
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                        <span className="font-semibold text-sm">Notifications</span>
                        <span className="text-xs text-gray-400">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-xs text-gray-400">No notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    onClick={() => markNotificationRead(n.id)}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${!n.read ? `bg-${settings.themeColor}-50/50` : ''}`}
                                >
                                    <p className={`text-sm ${n.type === 'error' ? 'text-red-600' : n.type === 'warning' ? 'text-yellow-600' : 'text-gray-800'}`}>
                                        {n.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{n.message}</p>
                                </div>
                            ))
                        )}
                    </div>
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
                <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
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
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Save, Camera } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { settings } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        currentPassword: '',
        newPassword: ''
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
    });
    alert('Profile updated successfully!');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className={`h-32 bg-${settings.themeColor}-600 w-full`}></div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
             <img 
                src={formData.avatar || user.avatar} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
             />
             <div className="absolute bottom-0 right-0 left-24">
                <button className="bg-white p-2 rounded-full shadow border border-gray-200 text-gray-600 hover:text-indigo-600">
                    <Camera size={18} />
                </button>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        type="text" 
                        className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                        type="email" 
                        className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Profile Image URL</label>
                    <input 
                        type="text" 
                        className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.avatar}
                        onChange={e => setFormData({...formData, avatar: e.target.value})}
                    />
                </div>
             </div>

             <div className="border-t border-gray-100 pt-6">
                 <h3 className="text-md font-semibold text-gray-800 mb-4">Security</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Current Password</label>
                        <input 
                            type="password" 
                            className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.currentPassword}
                            onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <input 
                            type="password" 
                            className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.newPassword}
                            onChange={e => setFormData({...formData, newPassword: e.target.value})}
                        />
                    </div>
                 </div>
             </div>

             <div className="flex justify-end pt-4">
                 <button 
                    type="submit"
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-colors bg-${settings.themeColor}-600 hover:bg-${settings.themeColor}-700`}
                 >
                    <Save size={18} />
                    Save Changes
                 </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
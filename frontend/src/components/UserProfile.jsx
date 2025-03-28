import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';

export const UserProfile = ({ user, onLogout }) => {
  return (
    <div className="text-center">
      <div className="mx-auto w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User size={64} className="text-blue-500" />
        )}
      </div>
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      
      <div className="mt-6 space-y-4">
        <button 
          className="w-full flex items-center justify-center py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          <Settings size={18} className="mr-2" /> Edit Profile
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          <LogOut size={18} className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};
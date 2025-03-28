import React, { useState } from 'react';
import axios from 'axios';

export const ProfileSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    profileImage: user.profileImage
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');
    
    try {
      await axios.put('/api/user/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};
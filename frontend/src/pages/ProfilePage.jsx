import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { 
  Settings, 
  LogOut, 
  DollarSign, 
  TrendingUp, 
  CreditCard 
} from 'lucide-react';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a simple abstract financial visualization
    const group = new THREE.Group();
    
    // Create multiple geometric shapes representing financial data
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.ConeGeometry(0.5, 1, 4),
      new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32)
    ];

    geometries.forEach((geometry, index) => {
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00,  // Bright green to match the design
        transparent: true,
        opacity: 0.7
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position shapes in a visually interesting way
      mesh.position.x = (index - 1) * 2;
      mesh.position.y = Math.sin(index) * 0.5;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      group.add(mesh);
    });

    scene.add(group);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the entire group
      group.rotation.y += 0.01;
      group.rotation.x += 0.005;
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#121317] min-h-screen text-white flex">
      {/* Sidebar */}
      <div className="w-[280px] bg-[#1C1D22] p-6 flex flex-col">
        {/* Profile Circle */}
        <div className="w-40 h-40 rounded-full border-4 border-green-500 mx-auto mb-6"></div>
        
        {/* Profile Actions */}
        <div className="space-y-4 mt-6">
          <button className="w-full bg-[#2C2D33] text-white py-3 rounded-lg flex items-center justify-center hover:bg-[#3C3D43] transition">
            <Settings className="mr-2" size={20} /> Edit Profile
          </button>
          <button 
            onClick={handleLogout}
            className="w-full bg-[#2C2D33] text-white py-3 rounded-lg flex items-center justify-center hover:bg-[#3C3D43] transition"
          >
            <LogOut className="mr-2" size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-8">
        {/* Financial Summary */}
        <div className="bg-[#1C1D22] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Financial Summary</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#2C2D33] rounded-2xl p-4 text-center">
              <DollarSign className="mx-auto mb-2 text-green-500" size={32} />
              <p className="text-gray-400 mb-2">Total Income</p>
              <h3 className="text-2xl font-bold">${user.totalIncome ? user.totalIncome.toLocaleString() : 0}</h3>
            </div>
            <div className="bg-[#2C2D33] rounded-2xl p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-blue-500" size={32} />
              <p className="text-gray-400 mb-2">Net Worth</p>
              <h3 className="text-2xl font-bold">${user.netWorth ? user.netWorth.toLocaleString() : 0}</h3>
            </div>
            <div className="bg-[#2C2D33] rounded-2xl p-4 text-center">
              <CreditCard className="mx-auto mb-2 text-purple-500" size={32} />
              <p className="text-gray-400 mb-2">Expenses</p>
              <h3 className="text-2xl font-bold">${user.totalExpenses ? user.totalExpenses.toLocaleString() : 0}</h3>
            </div>
          </div>
        </div>

        {/* 3D Visualization */}
        <div className="bg-[#1C1D22] rounded-2xl h-[400px] overflow-hidden">
          <ThreeScene />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

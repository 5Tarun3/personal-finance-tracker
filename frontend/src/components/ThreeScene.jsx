import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  useEffect(() => {
    // Check if mount ref exists
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    
    // Store renderer reference
    rendererRef.current = renderer;

    // Renderer setup
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
        color: 0x00ff00,  // Bright green
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

    // Cleanup function
    return () => {
      // Safely remove renderer and dispose resources
      if (mountRef.current && rendererRef.current) {
        try {
          // Remove renderer's canvas
          if (rendererRef.current.domElement) {
            mountRef.current.removeChild(rendererRef.current.domElement);
          }
          
          // Dispose renderer and related resources
          rendererRef.current.dispose();
          
          // Clear references
          rendererRef.current = null;
        } catch (error) {
          console.error('Error cleaning up ThreeScene:', error);
        }
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;
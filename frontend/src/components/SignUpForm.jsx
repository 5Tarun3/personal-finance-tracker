import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../assets/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaGoogle } from "react-icons/fa";
import "../styles/Auth.css"; // We'll create a new CSS file for all auth components

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <p className="auth-subtitle">Start tracking your finances today</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleRegister} className="auth-form">
        <div className="input-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group">
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group">
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit" className="auth-button">
          <FaUserPlus className="button-icon" /> Sign Up
        </button>
      </form>
      
      <div className="auth-divider">
        <span>or</span>
      </div>
      
      <button className="google-button">
        <FaGoogle className="button-icon" /> Continue with Google
      </button>
      
      <p className="auth-redirect">
        Already have an account? <span onClick={() => navigate("/login")}>Log In</span>
      </p>
    </div>
  );
};

export default SignUpForm;
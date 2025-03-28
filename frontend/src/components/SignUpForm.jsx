import React, { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../assets/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaGoogle } from "react-icons/fa";
import axios from "axios"; // Import axios for making API requests
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Register user in the backend
      await axios.post("http://localhost:5000/api/users/register", { 
        name: user.displayName, 
        email: user.email, 
        password: password,
        passwordCheck: password,
        googleLogin: false // Use the provided password for normal sign-up
      });

      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { displayName, email } = user;

      // Register user in the backend
      await axios.post("http://localhost:5000/api/users/register", { 
        name: displayName, 
        email: email, 
        password: "e23Dk2kd2&i4o5$",
        passwordCheck: "e23Dk2kd2&i4o5$",
        googleLogin: true // Set a default password for Google sign-up
      });

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
      
      <button className="google-button" onClick={handleGoogleSignIn}>
        <FaGoogle className="button-icon" /> Continue with Google
      </button>
      
      <p className="auth-redirect">
        Already have an account? <span onClick={() => navigate("/login")}>Log In</span>
      </p>
    </div>
  );
};

export default SignUpForm;

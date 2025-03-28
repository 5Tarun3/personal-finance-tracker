import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../assets/firebaseconfig";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle, FaSignInAlt, FaLock } from "react-icons/fa";
import "../styles/Auth.css";
import axios from "axios";

const EnhancedLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      console.log("Token set in local storage:", token); // Debugging log for token
      navigate("/dashboard");
    } catch (error) {
      setError(error.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;
      
      // Send user data to backend
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password: "e23Dk2kd2&i4o5$",
        googleLogin: true,
        name: displayName,

      });

      const token = response.data.token; // Use the token from the backend
      localStorage.setItem("token", token);      

      navigate("/dashboard");
    } catch (error) {
      setError(error.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Access your financial dashboard</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleLogin} className="auth-form">
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
        
        <div className="forgot-password">
          <span onClick={() => navigate("/reset-password")}>Forgot Password?</span>
        </div>
        
        <button 
          type="submit" 
          className="auth-button" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <FaSignInAlt className="button-icon" /> Sign In
            </>
          )}
        </button>
      </form>
      
      <div className="auth-divider">
        <span>or</span>
      </div>
      
      <button 
        className="google-button" 
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <FaGoogle className="button-icon" /> Continue with Google
      </button>
      
      <p className="auth-redirect">
        Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span>
      </p>
    </div>
  );
};

export default EnhancedLogin;

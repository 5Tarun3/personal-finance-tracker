// SignUpForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {motion} from 'framer-motion';
import { Link,useNavigate } from 'react-router-dom';

const StyledWrapper = styled.div`
  .form-container {
    width: 350px;
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
    color: rgba(198, 158, 30, 1);
    animation: travelBorder 5s infinite;
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    color: rgba(198, 158, 30, 1);
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    position: relative;
    margin-top: 20px; /* Increased padding */
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: rgba(198, 158, 30, 1);
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: none;
    padding: 0.75rem; /* Increased padding */
    line-height: 1.25rem;
    background-color: rgba(31, 41, 55, 1);
    color: rgba(198, 158, 30, 1);
    border: 2px solid transparent; // Initial transparent border for animation base
    transition: border-color 0.3s ease; // Smooth transition for border color
  }


  .sign {
    display: block;
    margin-top: 1.25rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    text-align: center;
    width: 100%;
    background-color: rgba(66, 25, 117, 0.88);
    color: rgba(197, 197, 197, 0.8);
    border: 2px solid transparent;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    transition: border-color 0.3s ease;
    animation: travelBorder 5s infinite;
    &:hover{
    transform: scale(1.07);
    color:rgba(198, 158, 30, 1);
    background-color: rgba(28, 5, 57, 1);
    }
    &:active{
    transform: translateY(3px);
    background-color: rgba(28, 5, 57, 1);
    }
  }

  /* Animation for the input borders */
  @keyframes travelBorder {
    0% { border-color: rgba(66, 9, 136, 1); }
    20% { border-color: rgba(67, 7, 141, 1)}
    30% { border-color: rgba(47, 7, 97, 1); }
    60% { border-color: rgba(0, 0, 0, 1); }
    80% { border-color: rgba(51, 10, 101, 1); }
    100% { border-color: rgba(63, 16, 120, 1); }
  }

  .input-group input {
    animation: travelBorder 5s infinite; /* Continuous animation */
  }
`;

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordCheck: ''
  });
  const navigate = useNavigate();
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.passwordCheck) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('User registered successfully');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    }
  };

  return (
    <StyledWrapper>
    <div className="form-container" style={{ backgroundColor: 'rgba(17, 24, 39, 1)' }}>

        <h1 className="title" style={{ color: 'rgba(198, 158, 30, 1)' }}>Sign Up</h1>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <input placeholder="Username" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ backgroundColor: 'rgba(31, 41, 55, 1)', color: 'rgba(198, 158, 30, 1)' }} />

          </div>
          <div className="input-group">
            <input placeholder="email" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ backgroundColor: 'rgba(31, 41, 55, 1)', color: 'rgba(198, 158, 30, 1)' }} />

          </div>
          <div className="input-group">
            <input placeholder="password" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required style={{ backgroundColor: 'rgba(31, 41, 55, 1)', color: 'rgba(198, 158, 30, 1)' }} />

            </div>
            <div className="input-group">
            <input placeholder="re-enter password" type="password" id="passwordCheck" name="passwordCheck" value={formData.passwordCheck} onChange={handleChange} required style={{ backgroundColor: 'rgba(31, 41, 55, 1)', color: 'rgba(198, 158, 30, 1)' }} />

            </div>
            <button type="submit" className="sign" style={{ backgroundColor: 'rgba(66, 25, 117, 0.88)', color: 'rgba(198, 158, 30, 1)' }}>Sign Up</button>

            <p className="pt-3">Already have an account? <Link to="/login" className="text-gold-300 hover:underline">Log in</Link></p>

          </form>
        </div>
      </StyledWrapper>
    );
   };
   
   export default SignUpForm;

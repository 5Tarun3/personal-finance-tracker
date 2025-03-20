import React, { useState } from 'react';
import './index.css';
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseconfig"; // Import auth
import { signOut, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; 
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Profile = () => {
    // Editable states
    const [username, setUsername] = useState("Derrick Richard");
    const [theme, setTheme] = useState("Light");
    const [notifications, setNotifications] = useState("Enabled");

    const [originalPassword, setOriginalPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordResetError, setPasswordResetError] = useState('');

    const navigate = useNavigate();
    
    const handleLogout = () => {
        signOut(auth).then(() => { // Sign out using Firebase
            localStorage.removeItem('token');
            navigate("/login");
            // Dispatch a custom event to notify NavBar of logout
            window.dispatchEvent(new Event('logout'));
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordResetError("New passwords do not match.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            setPasswordResetError("User not authenticated.");
            return;
        }

        const credential = EmailAuthProvider.credential(user.email, originalPassword);
        try {
            await reauthenticateWithCredential(user, credential);
            await user.updatePassword(newPassword);
            alert("Password changed successfully!");
            setOriginalPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordResetError("Failed to change password. Please check your original password.");
        }
    };

    const usageData = [
        { label: 'Jan', value: 5000 },
        { label: 'Feb', value: 7500 },
        { label: 'Mar', value: 8000 },
        { label: 'Apr', value: 6500 },
        { label: 'May', value: 9000 },
    ];

    // Chart.js Data Configuration
    const chartData = {
        labels: usageData.map(data => data.label),
        datasets: [
            {
                label: 'Usage Trend',
                data: usageData.map(data => data.value),
                fill: true, // Enabling the fill effect
                backgroundColor: 'rgba(255, 215, 0, 0.2)', // Light yellow color for fill
                borderColor: '#FFD700',
                borderWidth: 2,
                pointRadius: 5,
                tension: 0.3
            }
        ]
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => `$${context.raw}`
                }
            }
        },
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Usage Value ($)'
                }
            }
        }
    };

    return (
        <div style={{ marginBottom:'7.5%',marginTop:'56%',width: '100%', height: '100%', background: '#111', color: '#fff', fontFamily: 'Arial' }}>
            {/* Profile Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', width: '100%' }}>
                
                {/* Profile Details */}
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: 1, background: '#222', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)' }}>
                        <h2 style={{ color: '#FFD700' }}>User Details</h2>
                        <p><strong>Username:</strong> <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '300px' ,background: 'transparent', color: '#FFD700', border: 'none', fontSize: '16px' }} /></p>
                        <p><strong>Email:</strong> derrickrds@gmail.com</p>
                        <p><strong>Account Created:</strong> January 2025</p>
                        <p>Reset Password:</p>
                        <div>
                            <input
                                type="password"
                                placeholder="Enter original password"
                                value={originalPassword}
                                onChange={(e) => setOriginalPassword(e.target.value)}
                                style={{ background: 'transparent', color: '#FFD700', border: '1px solid #FFD700', fontSize: '16px', padding: '5px', margin: '5px 0' }}
                            />
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ background: 'transparent', color: '#FFD700', border: '1px solid #FFD700', fontSize: '16px', padding: '5px', margin: '5px 0' }}
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ background: 'transparent', color: '#FFD700', border: '1px solid #FFD700', fontSize: '16px', padding: '5px', margin: '5px 0' }}
                            />
                            {passwordResetError && <p style={{ color: 'red' }}>{passwordResetError}</p>}
                            <button onClick={handlePasswordReset} style={{ backgroundColor: '#FFD700', color: '#111', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div style={{ flex: 1, background: '#222', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)' }}>
                        <h2 style={{ color: '#FFD700' }}>User Preferences</h2>
                        <p>Theme: <button onClick={() => setTheme(theme === "Light" ? "Dark" : "Light")} style={{ background: 'transparent', border: '1px solid #FFD700', color: '#FFD700', padding: '5px', borderRadius: '5px' }}>{theme}</button></p>
                        <p>Notifications: <button onClick={() => setNotifications(notifications === "Enabled" ? "Disabled" : "Enabled")} style={{ background: 'transparent', border: '1px solid #FFD700', color: '#FFD700', padding: '5px', borderRadius: '5px' }}>{notifications}</button></p>
                    </div>
                </div>

                {/* Usage Statistics */}
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ flex: 1, background: '#222', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)' }}>
                        <h2 style={{ color: '#FFD700' }}>Usage Statistics</h2>
                        <p>Amount Moved: <strong>$25,000</strong></p>
                        <p>Days Used: <strong>450</strong></p>
                    </div>

                    {/* Usage Trend */}
                    <div style={{ flex: 2, background: '#222', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)' }}>
                        <h2 style={{ color: '#FFD700' }}>Usage Trend</h2>
                        <Line data={chartData} options={options} />
                    </div>                
                </div>

                {/* Logout Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <button onClick={handleLogout} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

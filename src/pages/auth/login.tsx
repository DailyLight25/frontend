import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Heart } from 'lucide-react';
import AuthForm from '../../components/AuthForm';
import apiService from '../../services/apiService'; // Import your apiService

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (data: any) => {
  try {
    // Call your backend login endpoint
    const response = await apiService.post('users/token/', data);

    // Save tokens in localStorage (or cookies if you prefer)
    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);

    // On success, redirect to dashboard
    navigate('/home');
  } catch (error: any) {
    console.error("Login failed:", error);
    alert("Invalid credentials or account not active.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 light-rays">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8 group">
          <Heart className="h-10 w-10 text-blue-800 group-hover:text-yellow-500 transition-colors duration-300" />
          <div className="font-secondary font-bold text-2xl">
            <span className="text-blue-800">Daylight</span>
            <span className="text-yellow-500">25</span>
          </div>
        </Link>

        <AuthForm type="login" onSubmit={handleLogin} />

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Link 
            to="/home" 
            className="text-sm text-gray-500 hover:text-blue-800 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
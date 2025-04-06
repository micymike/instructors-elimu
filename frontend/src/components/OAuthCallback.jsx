import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
          throw new Error('No token found');
        }

        // Verify token with backend
        const response = await axios.get(`${API_URL}/auth/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.user) {
          // Store token and user info
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          toast.success(`Welcome, ${response.data.user.name}!`);
          
          // Redirect based on user role
          if (response.data.user.role === 'instructor') {
            navigate('/instructor/dashboard');
          } else {
            navigate('/login');
          }
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('OAuth Callback Error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
        <p>Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndRedirect = async () => {
      // Extract token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Remove token from URL
        window.history.replaceState({}, document.title, '/dashboard');

        // Verify token
        const response = await axios.get(`${API_URL}/auth/verify-token`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Store token and user info
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Show brief loading/success message
        toast.success('Authentication successful!', {
          duration: 1500
        });

        // Redirect after a short delay
        setTimeout(() => {
          if (response.data.user.role === 'instructor') {
            navigate('/instructor/dashboard');
          } else {
            navigate('/login');
          }
        }, 1500);

      } catch (error) {
        console.error('Authentication error:', error);
        toast.error('Authentication failed. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    verifyAndRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center">
        <div className="animate-pulse">
          <svg className="mx-auto h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-white">Authenticating...</h2>
          <p className="mt-2 text-white">Redirecting to your dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default AuthRedirect;

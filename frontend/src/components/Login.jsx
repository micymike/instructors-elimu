import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Testimonial from '../components/ui/Testimonial';
import BlobButton from './ui/BlobButton';

const API_URL = import.meta.env.VITE_API_URL || 'https://centralize-auth-elimu.onrender.com';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch(`${API_URL}/auth/login/instructor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      console.log('Full Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      });

      const data = await response.json();
      console.log('Server Response:', data); // Debugging response
  
      if (response.ok && data.access_token) {
        const { access_token: token, user } = data;
  
        // Prepare user data
        const userData = {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || credentials.email,
          status: user?.status || 'pending',
          isVerified: user?.isVerified || false,
          role: user?.role || 'instructor',
          ...user,
        };
  
        // Save token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
  
        // Redirect to the dashboard
        navigate('/instructor/dashboard');
      } else {
        // Handle server errors or missing token
        setError(data?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login Error:', err);
  
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: name === 'email' ? value.trim() : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Login</h1>
        <form onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-blue-600 mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full bg-white pl-10 pr-4 py-3 rounded-lg border border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-blue-600 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full bg-white pl-10 pr-12 py-3 rounded-lg border border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
          <BlobButton
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-2 rounded shadow"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </BlobButton>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/instructorsform" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

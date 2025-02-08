import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';
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
      // Detailed logging of login attempt
      console.group('Login Attempt');
      console.log('Credentials:', {
        email: credentials.email,
        passwordLength: credentials.password.length
      });

      // Log existing authentication state
      const existingToken = localStorage.getItem('token');
      const existingUser = localStorage.getItem('user');
      console.log('Existing Authentication:', {
        token: existingToken ? 'Present' : 'Not Found',
        user: existingUser ? JSON.parse(existingUser) : 'Not Found'
      });
      console.groupEnd();

      // Attempt login
      const data = await authAPI.login(credentials);
  
      console.log('Login Response:', data);
  
      // Prepare user data with fallback values
      const userData = {
        firstName: data?.user?.firstName || '',
        lastName: data?.user?.lastName || '',
        email: data?.user?.email || credentials.email,
        status: data?.user?.status || 'pending',
        isVerified: data?.user?.isVerified || false,
        role: data?.user?.role || 'instructor',
        ...data?.user,
      };
  
      // Save user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userToken', data.token);  // Additional storage for compatibility
  
      // Show success toast
      toast.success('Login successful!');
  
      // Redirect based on role
      if (userData.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Comprehensive error logging
      console.group('Login Error');
      console.error('Full Error Details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      console.groupEnd();
  
      // Clear authentication state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
  
      // Determine error message
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please check your credentials and try again.';
      
      // Update UI with error
      setError(errorMessage);
      toast.error(errorMessage);
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
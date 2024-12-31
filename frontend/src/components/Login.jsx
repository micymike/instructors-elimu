import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Testimonial from '../components/ui/Testimonial';
import BlobButton from './ui/BlobButton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
  
      const data = await response.json();
      console.log(data); // Log the response to check the structure
  
      if (!response.ok) {
        // Handle non-200 HTTP status codes (e.g., 401, 400, etc.)
        const errorMessage = data.message || 'Something went wrong. Please try again.';
        setError(errorMessage);
        return;
      }
  
      if (data.success && data.data.access_token) {
        // Store the token in localStorage
        localStorage.setItem('token', data.data.access_token);
  
        // Prepare user data
        const userData = {
          firstName: data.data.instructor?.firstName || '',
          lastName: data.data.instructor?.lastName || '',
          email: data.data.instructor?.email || credentials.email,
          status: data.data.instructor?.status || 'pending',
          isVerified: data.data.instructor?.isVerified || false,
          role: data.data.instructor?.role || 'instructor',
          ...data.data.instructor
        };
  
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
  
        // Redirect to dashboard
        navigate('/instructor/dashboard');
      } else {
        // Handle missing token or unsuccessful login
        setError('Token not received. Please try again.');
      }
    } catch (err) {
      // Catch any errors that occur during the fetch or other operations
      console.error('Login error:', err);
  
      // Differentiate between network errors and unexpected errors
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: name === 'email' ? value.trim() : value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-600">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to continue your teaching journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full bg-white pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                             focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
                             transition duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full bg-white pl-10 pr-12 py-3 rounded-lg border border-gray-300 
                             focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
                             transition duration-200"
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

              <div className="flex items-center justify-between">
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
                className="w-full"
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
                  <a href="/instructorsform" className="font-medium text-blue-600 hover:text-blue-500">
                    Register here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Image & Testimonials Section */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{ backgroundImage: "url('/images/teacher-background.jpg')" }} />
        <Testimonial />
      </div>
    </div>
  );
};

export default Login;

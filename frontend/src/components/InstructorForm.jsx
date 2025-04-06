import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Briefcase, FileText, Award, Globe, MessageCircle, 
  Star, ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff 
} from 'lucide-react';
import Testimonial from './ui/Testimonial';
import BlobButton from './ui/BlobButton';
import axios from 'axios';
import { toast } from 'react-hot-toast';
//import { API_URL } from '../config';

const API_URL = import.meta.env.VITE_BACKEND_URL
// Move InputField outside the main component
const InputField = ({ 
  label, 
  icon: Icon, 
  type, 
  name, 
  value, 
  onChange, 
  required,
  showPasswordToggle, 
  onTogglePassword, 
  showPassword 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        {type === 'textarea' ? (
          <textarea
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            rows={4}
            className="block w-full pl-10 pr-3 py-2 text-gray-900 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     hover:border-blue-400 transition-colors duration-200
                     bg-white/50 backdrop-blur-sm
                     shadow-sm"
          />
        ) : (
          <input
            type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            className="block w-full pl-10 pr-10 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     hover:border-blue-400 transition-colors duration-200
                     bg-white/50 backdrop-blur-sm
                     shadow-sm"
          />
        )}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 
                     hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

const InstructorForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cv: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cv' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('password', formData.password);
      formDataToSubmit.append('role', 'instructor');
      formDataToSubmit.append('instructorStatus', 'pending');
      
      if (formData.cv) {
        formDataToSubmit.append('cv', formData.cv);
      }

      const response = await axios.post(`${API_URL}/auth/register/instructor`, 
        formDataToSubmit, 
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': 'https://elimu-instructor-fr.onrender.com'
          }
        }
      );
      
      toast.success('Instructor registration submitted successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-gradient-to-br from-white to-blue-50">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">Become an Instructor</h1>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Join our community of expert instructors and share your knowledge with students worldwide.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-lg bg-white/30 p-6 rounded-xl shadow-xl">
            <InputField
              label="Full Name"
              icon={User}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Email"
              icon={Mail}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Password"
              icon={Lock}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
              required
            />

            <InputField
              label="Confirm Password"
              icon={Lock}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPasswordToggle={true}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              showPassword={showConfirmPassword}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Upload CV
              </label>
              <input
                type="file"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <BlobButton 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Submitting...' : 'Register as Instructor'}
            </BlobButton>
          </form>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-blue-600 to-blue-800">
        <Testimonial />
      </div>
    </div>
  );
};

export default InstructorForm;

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
import { API_URL } from '../config';
import { authAPI } from '../services/api';

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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    expertise: '',
    bio: '',
    education: '',
    experience: '',
    teachingAreas: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({

      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authAPI.register(formData);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                icon={User}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                icon={User}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <InputField
              label="Email"
              icon={Mail}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
            />

            <InputField
              label="Phone Number"
              icon={MessageCircle}
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />

            <InputField
              label="Area of Expertise"
              icon={Briefcase}
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
            />

            <InputField
              label="Bio"
              icon={FileText}
              type="textarea"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />

            <InputField
              label="Education"
              icon={Award}
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
            />

            <InputField
              label="Experience"
              icon={Briefcase}
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />

            <div className="pt-4">
              <BlobButton 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg
                          transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                          flex items-center justify-center space-x-2 font-semibold"
              >
                <span>Register</span>
                <ArrowRight className="h-5 w-5" />
              </BlobButton>
            </div>
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
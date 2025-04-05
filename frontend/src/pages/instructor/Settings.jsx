import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, UserCircle, Key, Loader2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Update API_URL to prioritize localhost in development mode
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:3000'
  : (import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com');

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 }
  }
};

const InstructorSettings = () => {
  const fileInputRef = useRef(null);
  const { user: contextUser, login } = useAuth();
  // State variables
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);

  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: contextUser?.name || '',
    email: contextUser?.email || '',
    phoneNumber: contextUser?.phoneNumber || '',
  });

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    currentBalance: 0,
    monthlyRevenue: [],
    courseRevenue: []
  });

  // Withdrawals
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);

  // Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile Picture
  const [profilePicture, setProfilePicture] = useState({
    preview: contextUser?.profilePhotoUrl || '',
    file: null,
    isUploading: false,
  });

  // WebSocket Setup
  useEffect(() => {
    // Remove socket setup since we're not using socket.io anymore
    // and it's causing the error
    
    return () => {
      // Clean up function - no need to disconnect
    };
  }, []);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the exact API endpoint provided
        const profileRes = await axios.get(`${API_URL}/api/instructors/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Profile response:', profileRes);
        
        // Set profile form data from API response
        setProfileForm({
          name: profileRes.data.name,
          email: profileRes.data.email,
          phoneNumber: profileRes.data.phoneNumber,
        });

        // Set profile picture if available
        if (profileRes.data.profilePhotoUrl) {
          setProfilePicture(prev => ({
            ...prev,
            preview: profileRes.data.profilePhotoUrl
          }));
        }
        
        // Fetch other data as needed
        // This can be updated later when those endpoints are provided
        
      } catch (error) {
        console.error('Failed to load profile data:', error);
        toast.error('Failed to load profile data');
      }
    };
    
    fetchData();
  }, []);

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsProfileUpdating(true);
  
    const updatePayload = {
      name: profileForm.name,
      email: profileForm.email,
      phoneNumber: profileForm.phoneNumber,
      notes: ""
    };
    
    try {
      const response = await axios.put(`${API_URL}/api/instructors/profile/update`, updatePayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update user using login method which handles both context and local storage
      login({
        ...contextUser,
        ...response.data,
        token: localStorage.getItem('token')
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(
        error.response?.data?.message?.join(', ') || 
        error.response?.data?.message || 
        error.message ||
        'Profile update failed'
      );
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Handle profile picture update
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and GIF files are allowed');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create FormData to send the file
    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      // Set uploading state
      setProfilePicture(prev => ({ ...prev, isUploading: true }));

      // Upload profile picture
      const response = await axios.put(
        `${API_URL}/api/instructors/profile/profile-picture`, 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update profile picture preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture({
          preview: reader.result,
          isUploading: false
        });
      };
      reader.readAsDataURL(file);

      // Update user context with new profile photo URL
      login({
        ...contextUser,
        profilePhotoUrl: response.data.profilePhotoUrl,
        token: localStorage.getItem('token')
      });

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Profile picture upload error:', error);
      
      // Handle specific error scenarios
      if (error.response) {
        toast.error(
          error.response.data.message || 
          'Failed to update profile picture'
        );
      } else if (error.request) {
        toast.error('No response received from server');
      } else {
        toast.error('Error uploading profile picture');
      }

      // Reset uploading state
      setProfilePicture(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setProfilePicture({
        preview: null,
        file: null
      });
     
      toast.success('Profile picture removed');
    } catch (error) {
      toast.error('Failed to remove profile picture');
  }};

  // Withdrawal Handler
  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setIsProcessingWithdrawal(true);
    try {
      const response = await axios.post(`${API_URL}/instructor/withdraw-funds`, {
        amount: parseFloat(withdrawAmount),
        phoneNumber: profileForm.phoneNumber
      });
      
      setDashboardStats(prev => ({
        ...prev,
        currentBalance: prev.currentBalance - parseFloat(withdrawAmount)
      }));
      
      setWithdrawalHistory(prev => [response.data, ...prev]);
      toast.success('Withdrawal initiated successfully');
      setWithdrawAmount('');
    } catch (error) {
      toast.error('Withdrawal failed');
    } finally {
      setIsProcessingWithdrawal(false);
    }
  };

  // Password Change Handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast.error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    setIsPasswordChanging(true);
    try {
      // Create FormData object for the password update
      const formData = new FormData();
      formData.append('newPassword', passwordForm.newPassword);
      formData.append('currentPassword', passwordForm.currentPassword);
      
      // Use the same profile update endpoint as specified in the API docs
      await axios.put(`${API_URL}/api/instructors/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setIsPasswordChanging(false);
    }
  };
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    studentMessages: true,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showRatings: true,
    showCourseCount: true
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center mb-8">
          <Settings className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        </motion.div>

        {/* Profile Picture Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <UserCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Picture</h2>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {profilePicture.isUploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  profilePicture.preview ? (
                    <img 
                      src={profilePicture.preview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <UserCircle className="w-16 h-16 text-gray-400" />
                    </div>
                  )
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleProfilePictureChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                disabled={profilePicture.isUploading}
              >
                {profilePicture.isUploading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <UserCircle size={16} />
                )}
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              {profilePicture.preview && (
                <button
                  onClick={handleRemoveProfilePicture}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  disabled={profilePicture.isUploading}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </motion.div>


        {/* Profile Settings Form */}
        <motion.form 
          onSubmit={handleProfileUpdate}
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <Key className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <motion.button
              type="submit"
              disabled={isProfileUpdating}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProfileUpdating ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Save Changes'
              )}
            </motion.button>
          </div>
        </motion.form>

      {/* Notifications Section */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <Bell className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <button
                  onClick={() => handleNotificationChange(key)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <Key className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Privacy Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span>Show Course Ratings</span>
                <button
                  onClick={() => handlePrivacyChange('showRatings', !privacy.showRatings)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacy.showRatings ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${privacy.showRatings ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span>Show Course Count</span>
                <button
                  onClick={() => handlePrivacyChange('showCourseCount', !privacy.showCourseCount)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacy.showCourseCount ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${privacy.showCourseCount ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InstructorSettings;
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, UserCircle, Key, Loader2, DollarSign } from 'lucide-react';
import { instructorSettingsAPI} from '../../services/api';
import toast from 'react-hot-toast';
import { useUser } from '../../services/UserContext';
import io from 'socket.io-client';
import { API_URL } from '../../config';


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
  const { user: contextUser, setUser } = useUser();
  const [socket, setSocket] = useState(null);
  // State variables
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);

  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: contextUser?.name || '',
    email: contextUser?.email || '',
    phoneNumber: contextUser?.phoneNumber || '',
    paymentRate: contextUser?.paymentRate || 0,
    bio: contextUser?.bio || ''
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
    const newSocket = io(  import.meta.env.VITE_BACKEND_URL
      , {
      auth: {
        token: localStorage.getItem('token')
      }
    });
    
    newSocket.on('newNotification', (notification) => {
      setNotifications(prev => [...prev, notification]);
    });

    newSocket.on('notificationMarkedAsRead', (notificationId) => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes, withdrawalsRes] = await Promise.all([
          console.log('Attempting to fetch profile...'),
          instructorSettingsAPI.getProfile(),
          console.log('Profile response:', profileRes),
          instructorSettingsAPI.getDashboardStats(),
          instructorSettingsAPI.getWithdrawalStatus()
        ]);

        setProfileForm({
          name: profileRes.data.name,
          email: profileRes.data.email,
          phoneNumber: profileRes.data.phoneNumber,
          paymentRate: profileRes.data.paymentRate,
          bio: profileRes.data.bio
        });

        setDashboardStats(statsRes.data);
        setWithdrawalHistory(withdrawalsRes.data);

        if (profileRes.data.profilePhotoUrl) {
          setProfilePicture(prev => ({
            ...prev,
            preview: profileRes.data.profilePhotoUrl
          }));
        }
      } catch (error) {
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsProfileUpdating(true);
  
    const updateProfileDto = {
      name: profileForm.name,
      email: profileForm.email,
      phoneNumber: profileForm.phoneNumber,
      paymentRate: profileForm.paymentRate,
      bio: profileForm.bio
    };
  
    try {
      // Update only profile information
      const response = await instructorSettingsAPI.updateProfile(updateProfileDto, null);
      const updatedUser = {
        ...contextUser,
        ...response.data
      };
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Profile update failed');
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Profile Picture Update Handler
  const handleProfilePictureUpdate = async () => {
    if (!profilePicture.file) return;
    const formData = new FormData();
    formData.append('profilePhoto', profilePicture.file, profilePicture.file.name);
  
    try {
      setProfilePicture(prev => ({ ...prev, isUploading: true }));
      const response = await instructorSettingsAPI.updateProfilePicture(formData);
      const updatedUser = {
        ...contextUser,
        profilePhotoUrl: response.data.profilePhotoUrl
      };
      setUser(updatedUser);
      setProfilePicture(prev => ({
        preview: response.data.profilePhotoUrl,
        file: null,
        isUploading: false
      }));
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
      setProfilePicture(prev => ({ ...prev, isUploading: false }));
    }
  };


  // Profile Picture Handlers
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview and update profile picture
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture({
          preview: reader.result,
          file: file
        });
        handleProfilePictureUpdate(file);
      };
      reader.readAsDataURL(file);
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
      const response = await instructorSettingsAPI.withdrawFunds({
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
      await instructorSettingsAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
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
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
              <button
                onClick={() => fileInputRef.current.click()}
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
              {profilePicture.file && (
                <button
                  onClick={ handleProfilePictureUpdate}
                  disabled={profilePicture.isUploading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {profilePicture.isUploading ? 'Uploading...' : 'Save Photo'}
                </button>
              )}
              {(profilePicture.preview || contextUser?.profilePhotoUrl) && (
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={profileForm.paymentRate}
                  onChange={(e) => setProfileForm({ ...profileForm, paymentRate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
            />
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

        {/* Security Section */}
        <motion.form 
          onSubmit={handlePasswordChange}
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <motion.button
              type="submit"
              disabled={isPasswordChanging}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPasswordChanging ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Change Password'
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
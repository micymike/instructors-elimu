import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, UserCircle, Key, Loader2, DollarSign } from 'lucide-react';
import { settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useUser } from '../../services/UserContext';

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

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState({
    preview: contextUser?.profilePicture || '',
    file: null,
    isUploading: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Loading States
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);


  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: contextUser?.name || '',
    email: contextUser?.email || '',
    phoneNumber: contextUser?.phoneNumber || '',
    paymentRate: contextUser?.paymentRate || 0,
    bio: contextUser?.bio || ''
  });

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    totalEarnings: 0,
    totalCourses: 0,
    totalStudents: 0,
  });

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);

  // Loading States
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  // Fetch initial settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { personalInfo } = response.data;

        setProfileForm({
          name: contextUser?.name || '',
          email: contextUser?.email || '',
          phoneNumber: contextUser?.phoneNumber || '',
          paymentRate: contextUser?.paymentRate || 0,
          bio: contextUser?.bio || ''
        });

        // Set profile picture preview if it exists
        if (personalInfo.profilePicture) {
          setProfilePicture({
            preview: personalInfo.profilePicture,
            file: null
          });
        }
      } catch (error) {
        toast.error('Failed to load profile settings');
        console.error('Settings fetch error:', error);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const stats = await settingsAPI.getDashboardStats();
        setDashboardStats({
          totalCourses: response.data.totalCourses,
          totalStudents: response.data.totalStudents,
          totalRevenue: response.data.totalRevenue,
          currentBalance: response.data.currentBalance
        });
      } catch (error) {
        toast.error('Failed to load dashboard stats');
        console.error('Dashboard stats fetch error:', error);
      }
    };
    fetchDashboardStats();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsProfileUpdating(true);

    const formData = new FormData();
    formData.append('name', profileForm.name);
    formData.append('email', profileForm.email);
    formData.append('phoneNumber', profileForm.phoneNumber);
    formData.append('paymentRate', profileForm.paymentRate.toString());
    formData.append('bio', profileForm.bio);  

    try {
      const response = await settingsAPI.updateProfile(formData);
      const updatedUser = {
        ...contextUser,
        ...response.data,
      };
      setUser(updatedUser);

      // Update local state
      setProfilePicture(prev => ({
        ...prev,
        preview: response.data.profilePicture,
        file: null
      }));

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Handle withdrawal
  const handleWithdrawal = async (e) => {
    e.preventDefault();
    try {
      const response = await settingsAPI.withdrawFunds({
        amount: parseFloat(withdrawAmount),
        phoneNumber: contextUser.phoneNumber
      });
      
      if (response.mpesaResponse.ResponseCode === '0') {
        toast.success('Withdrawal initiated successfully');
        // Update balance in dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          currentBalance: prev.currentBalance - parseFloat(withdrawAmount)
        }));
      } 
    } catch (error) {
      toast.error('Failed to withdraw funds');
      console.error('Withdrawal error:', error);
    } finally {
      setIsProcessingWithdrawal(false);
    }
  };

  // Handle profile picture removal
  const handleRemoveProfilePicture = () => {
    setProfilePicture({
      preview: null,
      file: null
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast.error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      return;
    }

    setIsPasswordChanging(true);
    try {
      // Request password reset magic link
      await settingsAPI.requestPasswordReset({
        email: profileForm.email,
        newPassword: passwordForm.newPassword
      });
      
      toast.success('Password reset link sent to your email');

        // Reset password form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        toast.error(error.message || 'Failed to initiate password reset');
        console.error('Password reset request error:', error);
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
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfilePicture(prev => ({
                        ...prev,
                        preview: reader.result,
                        file
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
              >
                <UserCircle size={16} />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              {profilePicture.file && (
                <button
                  onClick={handleProfileUpdate}
                  disabled={profilePicture.isUploading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {profilePicture.isUploading ? 'Uploading...' : 'Save Photo'}
                </button>
              )}
              {(profilePicture.preview || contextUser?.profilePicture) && (
                <button
                  onClick={handleRemoveProfilePicture}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Performance Overview</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-semibold">Total Earnings</div>
              <div className="text-2xl font-bold">${dashboardStats.totalEarnings}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-semibold">Courses Created</div>
              <div className="text-2xl font-bold">{dashboardStats.totalCourses}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-semibold">Students Enrolled</div>
              <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                <input
                  type="text"
                  value={profileForm.expertise}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, expertise: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
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



        {/* Withdrawal Section */}
        <motion.form 
          onSubmit={handleWithdrawal}
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-6">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Withdraw Funds</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <motion.button
              type="submit"
              disabled={isProcessingWithdrawal}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessingWithdrawal ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Request Withdrawal'
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default InstructorSettings;
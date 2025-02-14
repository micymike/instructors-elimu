import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, UserCircle, Key, Loader2, DollarSign } from 'lucide-react';
import { instructorSettingsAPI} from '../../services/api';
import toast from 'react-hot-toast';
import { useUser } from '../../services/UserContext';
import io from 'socket.io-client';

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
  const [notifications, setNotifications] = useState([]);

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
    const newSocket = io('https://centralize-auth-elimu.onrender.com', {
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
          instructorSettingsAPI.getProfile(),
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
const handleProfilePictureUpdate = async (file) => {
  if (!file) return;

  try {
    // Update only profile picture
    const response = await instructorSettingsAPI.updateProfilePicture(file);
    const updatedUser = {
      ...contextUser,
      profilePhotoUrl: response.data.profilePhotoUrl
    };
    
    setUser(updatedUser);
    setProfilePicture({
      preview: response.data.profilePhotoUrl,
      file: null
    });
    toast.success('Profile picture updated successfully');
  } catch (error) {
    toast.error('Profile picture update failed');
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

        {/* Dashboard Stats */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Performance Overview</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-semibold">Current Balance</div>
              <div className="text-2xl font-bold">${dashboardStats.currentBalance}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-semibold">Total Courses</div>
              <div className="text-2xl font-bold">{dashboardStats.totalCourses}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-semibold">Total Students</div>
              <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Withdrawal History</h3>
            <div className="space-y-3">
              {withdrawalHistory.map((withdrawal) => (
                <div key={withdrawal.transactionId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">${withdrawal.amount}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    withdrawal.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    withdrawal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {withdrawal.status}
                  </span>
                </div>
              ))}
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
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{notification.type}</div>
                  <div className="text-sm text-gray-600">{notification.message}</div>
                </div>
                <button 
                  onClick={() => socket.emit('markNotificationAsRead', notification.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Mark Read
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InstructorSettings;
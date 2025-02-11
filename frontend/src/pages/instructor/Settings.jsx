import React, { useState, useRef, useEffect } from 'react';
import { Settings, Bell, Shield, UserCircle, Key, Loader2, DollarSign } from 'lucide-react';
import { settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useUser } from '../../services/UserContext';

const InstructorSettings = () => {
  const fileInputRef = useRef(null);
  const { user: contextUser, setUser } = useUser();

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState({
    preview: contextUser?.profilePicture || '',
    file: null
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: contextUser?.firstName || '',
    lastName: contextUser?.lastName || '',
    email: contextUser?.email || '',
    phone: contextUser?.phone || '',
    expertise: contextUser?.expertise || '',
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
        const response = await settingsAPI.getSettings();
        const { personalInfo } = response.data;

        setProfileForm({
          firstName: personalInfo.firstName || '',
          lastName: personalInfo.lastName || '',
          email: personalInfo.email || '',
          phone: personalInfo.phone || '',
          expertise: personalInfo.expertise || '',
          bio: personalInfo.bio || ''
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
        setDashboardStats(stats);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
        console.error('Dashboard stats fetch error:', error);
      }
    };

    fetchSettings();
    fetchDashboardStats();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsProfileUpdating(true);

    const formData = new FormData();
    formData.append('firstName', profileForm.firstName);
    formData.append('lastName', profileForm.lastName);
    formData.append('email', profileForm.email);
    formData.append('phone', profileForm.phone);
    formData.append('expertise', profileForm.expertise);
    formData.append('bio', profileForm.bio);

    // If a profile picture is selected, append it to form data
    if (profilePicture.file) {
      formData.append('profilePhoto', profilePicture.file);
    }

    try {
      const response = await settingsAPI.updateProfile(formData);
      const updatedUser = {
        ...contextUser,
        ...response.data,
        profilePicture: response.data.profilePicture // Use the URL returned from API
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
    if (isProcessingWithdrawal) return;

    setIsProcessingWithdrawal(true);

    try {
      const phoneNumber = profileForm.phone; // Assuming the instructor's phone number is used for withdrawals.
      await settingsAPI.withdrawFunds(withdrawAmount, phoneNumber);
      toast.success('Withdrawal successful');
      setWithdrawAmount('');
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
    // If you want to also update the backend (optional):
    // settingsAPI.updateProfile({ profilePicture: null });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Settings className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Instructor Settings</h1>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <UserCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Picture</h2>
          </div>
          <div className="flex items-center">
            {profilePicture.preview ? (
              <>
                <img
                  src={profilePicture.preview}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover mr-4"
                />
                <button
                  type="button"
                  onClick={handleRemoveProfilePicture}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Remove Picture
                </button>
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <UserCircle className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfilePicture({
                      preview: reader.result,
                      file
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Change Picture
            </button>
          </div>
        </div>

        {/* Dashboard Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Dashboard Stats</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Total Earnings</span>
              <span className="font-semibold text-green-600">${dashboardStats.totalEarnings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Courses</span>
              <span className="font-semibold text-blue-600">{dashboardStats.totalCourses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Students</span>
              <span className="font-semibold text-purple-600">{dashboardStats.totalStudents}</span>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <form onSubmit={handleProfileUpdate} className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <UserCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
          </div>
          
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="(123) 456-7890"
              />
            </div>

            {/* Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Expertise</label>
              <input
                type="text"
                value={profileForm.expertise}
                onChange={(e) => setProfileForm(prev => ({ ...prev, expertise: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Example: Web Development"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Write a short bio about yourself"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isProfileUpdating}
              className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
            >
              {isProfileUpdating ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

        {/* Withdrawal Section */}
        <form onSubmit={handleWithdrawal} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Request Withdrawal</h2>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Withdrawal Amount</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isProcessingWithdrawal}
              className="px-6 py-2 bg-green-600 text-white rounded-md disabled:bg-gray-400"
            >
              {isProcessingWithdrawal ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                'Request Withdrawal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorSettings;
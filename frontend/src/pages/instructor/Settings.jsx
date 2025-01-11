import React, { useState, useRef, useEffect } from 'react';
import { Settings, Bell, Shield, UserCircle, Mail, Key, Globe, Book, Upload, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const InstructorSettings = () => {
  const fileInputRef = useRef(null);

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState({
    preview: null,
    file: null
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    expertise: '',
    bio: ''
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Loading States
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  // Fetch initial settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getSettings();
        const { personalInfo } = response.data;
        
        // Populate profile form
        setProfileForm({
          firstName: personalInfo.firstName || '',
          lastName: personalInfo.lastName || '',
          email: personalInfo.email || '',
          phone: personalInfo.phone || '',
          expertise: personalInfo.expertise || '',
          bio: personalInfo.bio || ''
        });

        // Set existing profile picture
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

    fetchSettings();
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG, PNG, and GIF files are allowed');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        // Upload to server
        const uploadResponse = await settingsAPI.uploadProfilePicture(file);
        
        // Update state with server response
        setProfilePicture({
          preview: uploadResponse.profilePictureUrl,
          file: file
        });

        toast.success('Profile picture uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload profile picture');
        console.error('Profile picture upload error:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove profile picture
  const handleRemoveProfilePicture = async () => {
    try {
      // Assuming there's an API method to remove profile picture
      await settingsAPI.updateProfile({ profilePicture: null });
      
      setProfilePicture({
        preview: null,
        file: null
      });
      
      toast.success('Profile picture removed');
    } catch (error) {
      toast.error('Failed to remove profile picture');
      console.error('Profile picture removal error:', error);
    }
  };

  // Update profile details
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsProfileUpdating(true);
    try {
      const updateData = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phone: profileForm.phone,
        expertise: profileForm.expertise,
        bio: profileForm.bio
      };

      // If there's a new profile picture, include it
      if (profilePicture.file) {
        const uploadResponse = await settingsAPI.uploadProfilePicture(profilePicture.file);
        updateData.profilePicture = uploadResponse.profilePictureUrl;
      }

      await settingsAPI.updateProfile(updateData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsPasswordChanging(true);
    try {
      await settingsAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      toast.success('Password changed successfully');
      
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      console.error('Password change error:', error);
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
          
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                {profilePicture.preview ? (
                  <img 
                    src={profilePicture.preview} 
                    alt="Profile" 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <UserCircle className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </button>
              {profilePicture.preview && (
                <button
                  onClick={handleRemoveProfilePicture}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Allowed formats: PNG, JPEG, GIF. Max file size: 5MB.
          </p>
        </div>

        {/* Profile Section */}
        <form onSubmit={handleProfileUpdate} className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <UserCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Name</label>
              <input
                type="text"
                value={profileForm.firstName + ' ' + profileForm.lastName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value.split(' ')[0], lastName: e.target.value.split(' ')[1] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Dr. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
                placeholder="Tell your students about yourself..."
              />
            </div>
            <button 
              type="submit" 
              disabled={isProfileUpdating}
              className={`
                w-full px-4 py-2 rounded-md text-white font-medium transition-colors duration-200
                ${isProfileUpdating 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              {isProfileUpdating ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating Profile...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>

        {/* Password Change Section */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <Key className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit" 
              disabled={isPasswordChanging}
              className={`
                w-full px-4 py-2 rounded-md text-white font-medium transition-colors duration-200
                ${isPasswordChanging 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              {isPasswordChanging ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Changing Password...
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <Bell className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700">{key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.slice(1)}</span>
                <button
                  onClick={() => handleNotificationChange(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Privacy Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="students">Students Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Show Ratings</span>
              <button
                onClick={() => handlePrivacyChange('showRatings', !privacy.showRatings)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  privacy.showRatings ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showRatings ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSettings;
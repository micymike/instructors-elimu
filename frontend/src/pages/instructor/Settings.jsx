import React, { useState, useRef } from 'react';
import { Settings, Bell, Shield, UserCircle, Mail, Key, Globe, Book, Upload } from 'lucide-react';
import axios from 'axios';

const InstructorSettings = () => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('https://eba3-102-0-10-118.ngrok-free.app/api/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (response.data.success) {
        alert('Password changed successfully');
      } else {
        setPasswordError(response.data.message);
      }
    } catch (error) {
      setPasswordError('An error occurred while changing the password');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await axios.post('https://eba3-102-0-10-118.ngrok-free.app/api/update-profile', {
        profileImage,
        // Add other profile fields here
      });
      if (response.data.success) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('An error occurred while updating the profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Settings className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Instructor Settings</h1>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <UserCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
          </div>
          
          {/* Profile Picture Upload */}
          <div className="mb-6">
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <UserCircle className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </button>
                <p className="mt-1 text-sm text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Dr. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
                placeholder="Tell your students about yourself..."
              />
            </div>
            <button
              onClick={handleProfileUpdate}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <Key className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Password
            </button>
          </form>
        </div>

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
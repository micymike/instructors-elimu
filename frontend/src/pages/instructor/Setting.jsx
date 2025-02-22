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
    preview: contextUser?.profilePhotoUrl || '',
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
        const profileResponse = await settingsAPI.getProfile();
        const profileData = profileResponse.data;
        
        setProfileForm({
          name: profileData.name,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          paymentRate: profileData.paymentRate,
          bio: profileData.bio
        });

        if (profileData.profilePhotoUrl) {
          setProfilePicture(prev => ({
            ...prev,
            preview: profileData.profilePhotoUrl
          }));
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

    if (profilePicture.file) {
      formData.append('profilePhoto', profilePicture.file);
    }

    try {
      const response = await settingsAPI.updateProfile(formData);
      const updatedUser = {
        ...contextUser,
        ...response.data,
        profilePhotoUrl: response.data.profilePhotoUrl
      };
      setUser(updatedUser);

      setProfilePicture(prev => ({
        ...prev,
        preview: response.data.profilePhotoUrl,
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  //className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Tell the students about yourself"
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
      </motion.div>
    </div>
  );
};

export default InstructorSettings;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateAssessment = () => {
  const [assessment, setAssessment] = useState({
    title: '',
    courseId: '',
    type: 'quiz',
    description: '',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    dueDate: null,
    isPublished: false,
    totalPoints: 0
  });
  

  const [aiOptions, setAiOptions] = useState({
    topic: '',
    difficulty: 'medium',
    numberOfQuestions: 10,
    questionTypes: ['multiple_choice']
  });

  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    text: '',
    points: 1,
    choices: ['', '', '', ''],
    correctAnswer: '',
    matchingPairs: [{ left: '', right: '' }]
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate total points whenever questions change
  useEffect(() => {
    const total = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    setAssessment(prev => ({ ...prev, totalPoints: total }));
  }, [assessment.questions]);

  const addQuestion = () => {
    const questionError = validateQuestion(newQuestion);
    if (questionError) {
      setErrors({ questions: questionError });
      return;
    }

    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    setNewQuestion({
      type: 'multiple_choice',
      text: '',
      points: 1,
      choices: ['', '', '', ''],
      correctAnswer: '',
      matchingPairs: [{ left: '', right: '' }]
    });
  };

  const validateQuestion = (question) => {
    if (!question.text) return 'Question text is required';
    if (question.points < 1) return 'Points must be at least 1';
    
    switch(question.type) {
      case 'multiple_choice':
        if (!question.correctAnswer) return 'Select correct answer';
        if (question.choices.some(c => !c)) return 'All choices must be filled';
        break;
      case 'matching':
        if (question.matchingPairs.some(p => !p.left || !p.right)) 
          return 'All matching pairs must be filled';
        break;
      case 'true_false':
        if (typeof question.correctAnswer !== 'boolean')
          return 'Select true/false answer';
        break;
    }
    return null;
  };

  const handleMatchingPairChange = (index, field, value) => {
    const newPairs = [...newQuestion.matchingPairs];
    newPairs[index][field] = value;
    setNewQuestion({ ...newQuestion, matchingPairs: newPairs });
  };

  const generateAIAssessment = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      
      if (!assessment.courseId) {
        setErrors({ apiError: 'Course ID is required for AI generation' });
        return;
      }

      const response = await axios.post(
        `${API_URL}/instructor/assessments/ai-generate/${assessment.courseId}`,
        aiOptions,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setAssessment(prev => ({
        ...prev,
        questions: response.data.questions
      }));
      setSuccessMessage('AI Assessment generated successfully!');
    } catch (error) {
      console.error('Error generating AI assessment:', error);
      setErrors({ apiError: error.response?.data?.message || 'Failed to generate AI assessment' });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAssessment = async () => {
    const formErrors = {
      title: !assessment.title && 'Title is required',
      courseId: !assessment.courseId && 'Course ID is required',
      questions: assessment.questions.length === 0 && 'At least one question is required'
    };

    if (Object.values(formErrors).some(e => e)) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.post(`${API_URL}/instructor/assessments`, assessment, config);
      setSuccessMessage('Assessment created successfully!');
      
      // Reset form
      setAssessment({
        title: '',
        courseId: '',
        type: 'quiz',
        description: '',
        questions: [],
        timeLimit: 30,
        passingScore: 70,
        dueDate: null,
        isPublished: false,
        totalPoints: 0
      });
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        apiError: error.response?.data?.message || 
                 'Failed to create assessment. Check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePassingScoreChange = (value) => {
    // Ensure value stays between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, Number(value)));
    setAssessment(prev => ({
      ...prev,
      passingScore: clampedValue
    }));
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Create New Assessment
        </h1>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        {errors.apiError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {errors.apiError}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Title*
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                value={assessment.title}
                onChange={e => setAssessment({ ...assessment, title: e.target.value })}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course ID*
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.courseId ? 'border-red-500' : 'border-gray-300'
                }`}
                value={assessment.courseId}
                onChange={e => setAssessment({ ...assessment, courseId: e.target.value })}
              />
              {errors.courseId && <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <DatePicker
                selected={assessment.dueDate}
                onChange={date => setAssessment({ ...assessment, dueDate: date })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                minDate={new Date()}
              />
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={assessment.isPublished}
                onChange={e => setAssessment({ ...assessment, isPublished: e.target.checked })}
                className="h-4 w-4 text-indigo-600 rounded border-gray-300"
              />
              <label className="ml-2 text-sm text-gray-700">
                Publish Immediately
              </label>
            </div>
          </div>

          {/* AI Generation Section */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Assessment Generation</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              {/* AI Options UI remains similar but with enhanced question type selection */}
            </div>
          </div>

          {/* Question Creation Section */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Questions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={newQuestion.type}
                  onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="essay">Essay</option>
                  <option value="matching">Matching</option>
                </select>
              </div>

              {/* Question Input Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text*
                </label>
                <textarea
                  value={newQuestion.text}
                  onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>

              {/* Dynamic Fields Based on Question Type */}
              {newQuestion.type === 'multiple_choice' && (
                <div className="space-y-4">
                  {/* Multiple Choice UI */}
                </div>
              )}

              {newQuestion.type === 'true_false' && (
                <div className="space-y-4">
                  <select
                    value={newQuestion.correctAnswer}
                    onChange={e => setNewQuestion({ 
                      ...newQuestion, 
                      correctAnswer: e.target.value === 'true' 
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Correct Answer</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              )}

              {newQuestion.type === 'matching' && (
                <div className="space-y-4">
                  {newQuestion.matchingPairs.map((pair, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <input
                        value={pair.left}
                        onChange={e => handleMatchingPairChange(index, 'left', e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        placeholder="Left item"
                      />
                      <input
                        value={pair.right}
                        onChange={e => handleMatchingPairChange(index, 'right', e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        placeholder="Matching right item"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewQuestion({
                      ...newQuestion,
                      matchingPairs: [...newQuestion.matchingPairs, { left: '', right: '' }]
                    })}
                    className="text-indigo-600 text-sm"
                  >
                    + Add Pair
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points*
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newQuestion.points}
                    onChange={e => setNewQuestion({
                      ...newQuestion,
                      points: parseInt(e.target.value) || 1
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {errors.questions && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {errors.questions}
                </div>
              )}

              <button
                onClick={addQuestion}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4 rounded-lg"
              >
                Add Question
              </button>
            </div>
          </div>

          {/* Submit Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  Passing Score: {assessment.passingScore}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={assessment.passingScore}
                  onChange={(e) => handlePassingScoreChange(e.target.value)}
                  className="w-32 accent-indigo-600"
                />
              </div>
              <span className="font-medium">
                Total Points: {assessment.totalPoints}
              </span>
            </div>
            
            <button
              onClick={submitAssessment}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//export default CreateAssessment;
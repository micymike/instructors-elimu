import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MessageCircle, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const CourseForm = ({
  initialData = {},
  onSubmit,
  mode = 'create',
  onAIAssistantClick
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    price: initialData.price || 0,
    level: initialData.level || 'Beginner',
    duration: initialData.duration?.totalHours || 0,
    status: initialData.status || 'draft',
    instructor: initialData.instructor || null
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        instructor: {
          id: 1, // Replace with actual instructor ID if known
          name: 'Instructor Name', // Replace with actual instructor name
          email: 'instructor@example.com' // Replace with actual instructor email
        }
      }));
    }
  }, [mode]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValid = file.type.includes('pdf') || file.type.includes('video');
      if (!isValid) {
        toast.error(`${file.name} is not a valid file type. Only PDFs and videos are allowed.`);
      }
      return isValid;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Current User:', currentUser);

    try {
      // Get user from local storage
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?.id;

      // Log user information for debugging
      console.log('Stored User:', parsedUser);

      // Validate instructor authentication
      if (!userId) {
        console.error('No user ID found in local storage');
        toast.error('Authentication required. Please log in.');
        return;
      }

      // Validate form data
      if (!formData.title || !formData.description) {
        toast.error('Please provide a title and description');
        return;
      }

      if (onSubmit) {
        await onSubmit(formData, files);
      } else {
        // Direct API call using Axios
        const token = localStorage.getItem('token');
        
        const coursePayload = {
          title: formData.title,
          description: formData.description || '',
          instructorId: userId, // Use user ID from local storage
          videos: files
            .filter(file => file.type.includes('video'))
            .map(file => ({ url: URL.createObjectURL(file) })),
          pdfs: files
            .filter(file => file.type.includes('pdf'))
            .map(file => ({ 
              url: URL.createObjectURL(file),
              name: file.name 
            }))
        };

        const response = await axios.post('/instructor/courses', coursePayload, {
          baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Handle successful course creation
        toast.success('Course created successfully!');
        console.log('Created Course:', response.data);
        
        // Navigate to courses page
        navigate('/instructor/courses');
      }
    } catch (error) {
      console.error('Course submission error', error);
      
      // More specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        const errorMessage = error.response.data?.message || 'Failed to create course';
        toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        toast.error('Error creating course. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Responsive AI Assistant Trigger Button */}
      <button 
        type="button"
        onClick={onAIAssistantClick}
        className="fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none shadow-lg md:absolute"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center">
              {mode === 'create' ? 'Create New Course' : 'Edit Course'}
            </h2>

            <form 
              onSubmit={handleSubmit} 
              className="space-y-6 bg-white p-8 rounded-lg shadow-md"
            >
              {/* Basic Course Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Course Information</h3>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>

                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="">Select Category</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>

                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Structure Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Structure</h3>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Course Duration (Hours)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Enter total course hours"
                    />
                  </div>

                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="w-full px-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Provide a detailed description of your course"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Materials</h3>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF or Video up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files Display */}
              {files.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {files.map((file, index) => (
                      <div 
                        key={index} 
                        className="relative bg-gray-100 rounded-md p-2 flex items-center"
                      >
                        <span className="text-xs truncate mr-2">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {uploading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;

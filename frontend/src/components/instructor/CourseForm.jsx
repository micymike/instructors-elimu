import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MessageCircle, Upload, X } from 'lucide-react';
import ApiService from '../../services/api.service';

export const CourseForm = ({
  initialData = {},
  onSubmit,
  mode = 'create',
  onAIAssistantClick
}) => {
  const [currentUser, setCurrentUser] = useState(null);
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
    const fetchCurrentUser = async () => {
      try {
        const user = await ApiService.getCurrentUser();
        setCurrentUser(user);
        
        // Set instructor for new courses
        if (mode === 'create') {
          setFormData(prev => ({
            ...prev,
            instructor: {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email
            }
          }));
        }
      } catch (error) {
        console.error('Failed to fetch current user', error);
        toast.error('Could not retrieve user information');
      }
    };

    fetchCurrentUser();
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
    
    // Prepare course data
    const courseData = {
      ...formData,
      duration: {
        totalHours: formData.duration
      },
      // Ensure instructor is always included
      instructor: formData.instructor || {
        id: currentUser?.id,
        name: `${currentUser?.firstName} ${currentUser?.lastName}`,
        email: currentUser?.email
      }
    };

    if (mode === 'create') {
      setUploading(true);

      try {
        const token = localStorage.getItem('token');

        if (!formData.title || !formData.description) {
          toast.error('Title and description are required');
          return;
        }

        // Create FormData object
        const formDataToSend = new FormData();

        // Add course data
        formDataToSend.append('courseData', JSON.stringify({
          ...courseData,
          modules: courseData.modules || [],
          status: 'draft'
        }));

        // Add files
        files.forEach(file => {
          formDataToSend.append('files', file);
        });

        const response = await axios.post('http://localhost:3000/api/courses', formDataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Course created:', response.data);
        toast.success('Course created successfully!');

        // Clear form and files
        setFormData({
          title: '',
          description: '',
          duration: '',
          level: 'Beginner',
          category: '',
          price: '',
          modules: [],
          instructor: null
        });
        setFiles([]);

      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(error.response?.data?.message || 'Error creating course');
      } finally {
        setUploading(false);
      }
    } else {
      // For edit mode, use the onSubmit prop
      await onSubmit(courseData);
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
      {/* AI Assistant Trigger Button */}
      <button 
        type="button"
        onClick={onAIAssistantClick}
        className="absolute top-0 right-0 m-4 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{mode === 'create' ? 'Create New Course' : 'Edit Course'}</h2>

            {currentUser && (
              <div className="mb-4 text-sm text-gray-600">
                Instructor: {currentUser.firstName} {currentUser.lastName}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course Title
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (hours)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="0"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <div className="mt-1">
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course Materials
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf,video/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF or video files only
                      </p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-4 divide-y divide-gray-200">
                      {files.map((file, index) => (
                        <li key={index} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="ml-2 truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-4 text-red-600 hover:text-red-900"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/instructor/courses')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : mode === 'create' ? 'Create Course' : 'Save Changes'}
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
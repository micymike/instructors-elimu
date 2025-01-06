import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MessageCircle, Upload, X } from 'lucide-react';
import AIAssistant from '../course-generator/AIAssistant';

export const CourseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    category: '',
    price: '',
    modules: []
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

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
        ...formData,
        modules: formData.modules || [],
        status: 'draft'
      }));

      // Add files
      files.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await axios.post('http://localhost:3000/api/courses', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
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
        level: 'beginner',
        category: '',
        price: '',
        modules: []
      });
      setFiles([]);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Error creating course');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseGenerated = (generatedCourse) => {
    setFormData({
      title: generatedCourse.title,
      description: generatedCourse.description,
      duration: generatedCourse.duration,
      level: generatedCourse.level,
      category: generatedCourse.category,
      price: generatedCourse.price || '',
      modules: generatedCourse.modules || []
    });
    toast.success('Course structure applied to form!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Create New Course</h2>

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
                    Duration
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 8 weeks"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
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
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
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
                      placeholder="e.g., Web Development"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (USD)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      required
                    />
                  </div>
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
                          accept="application/pdf,video/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF & Video files only
                    </p>
                  </div>
                </div>

                {files.length > 0 && (
                  <ul className="mt-4 divide-y divide-gray-200">
                    {files.map((file, index) => (
                      <li key={index} className="py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {file.name}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      setFormData({
                        title: '',
                        description: '',
                        duration: '',
                        level: 'beginner',
                        category: '',
                        price: '',
                        modules: []
                      });
                      setFiles([]);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${uploading
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {uploading ? 'Creating Course...' : 'Create Course'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AIAssistant onCourseGenerated={handleCourseGenerated} />
    </div>
  );
};
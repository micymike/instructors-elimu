import React, { useState } from 'react';
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
    instructorName: initialData.instructorName || '',
    targetAudience: initialData.targetAudience || '',
    price: initialData.price || 0,
    difficulty: initialData.difficulty || 'Junior highschool',
    category: initialData.category || 'CBC',
    isPublished: initialData.isPublished || false
  });

  const [learningOutcomes, setLearningOutcomes] = useState(initialData.learningOutcomes || ['']);
  const [prerequisites, setPrerequisites] = useState(initialData.prerequisites || []);
  const [tags, setTags] = useState(initialData.tags || []);
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
    
    if (uploading) return;

    // Validate required fields
    if (!formData.title || !formData.description || !formData.instructorName || !formData.targetAudience) {
      toast.error('Please fill all required fields');
      return;
    }
    if (learningOutcomes.length === 0) {
      toast.error('Please add at least one learning outcome');
      return;
    }
    if (files.length === 0) {
      toast.error('Please upload at least one course material');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const courseFormData = new FormData();
      
      // Add required fields
      courseFormData.append('title', formData.title);
      courseFormData.append('description', formData.description);
      courseFormData.append('instructorName', formData.instructorName);
      courseFormData.append('targetAudience', formData.targetAudience);
      courseFormData.append('price', formData.price);
      courseFormData.append('difficulty', formData.difficulty);
      courseFormData.append('category', formData.category);
      courseFormData.append('isPublished', formData.isPublished);
      
      // Add arrays
      learningOutcomes.forEach(outcome => courseFormData.append('learningOutcomes[]', outcome));
      prerequisites.forEach(prereq => courseFormData.append('prerequisites[]', prereq));
      tags.forEach(tag => courseFormData.append('tags[]', tag));

      // Append each file directly
      files.forEach(file => {
        courseFormData.append('file', file); // Use 'file' as the key for each file
      });

      const response = await axios.post('/courses/instructor', courseFormData, {
        baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Course created successfully!');
      navigate('/instructor/courses');
    } catch (error) {
      console.error('Course submission error', error);
      if (error.response) {
        toast.error(error.response.data?.message || 'Failed to create course');
      } else if (error.request) {
        toast.error('No response from server');
      } else {
        toast.error('Error creating course');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name *</label>
                    <input
                      type="text"
                      name="instructorName"
                      value={formData.instructorName}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience *</label>
                    <input
                      type="text"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Outcomes *</h3>
                {learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => {
                        const newOutcomes = [...learningOutcomes];
                        newOutcomes[index] = e.target.value;
                        setLearningOutcomes(newOutcomes);
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index))}
                      className="ml-2 text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setLearningOutcomes([...learningOutcomes, ''])}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  + Add Learning Outcome
                </button>
              </div>

              {/* Prerequisites */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Prerequisites</h3>
                {prerequisites.map((prereq, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={prereq}
                      onChange={(e) => {
                        const newPrereqs = [...prerequisites];
                        newPrereqs[index] = e.target.value;
                        setPrerequisites(newPrereqs);
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setPrerequisites(prerequisites.filter((_, i) => i !== index))}
                      className="ml-2 text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPrerequisites([...prerequisites, ''])}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  + Add Prerequisite
                </button>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
                {tags.map((tag, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...tags];
                        newTags[index] = e.target.value;
                        setTags(newTags);
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      className="ml-2 text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setTags([...tags, ''])}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  + Add Tag
                </button>
              </div>

              {/* Files */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Materials *</h3>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF or Video up to 10MB</p>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {files.map((file, index) => (
                      <div key={index} className="relative bg-gray-100 rounded-md p-2 flex items-center">
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
                )}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {uploading ? 'Processing...' : 'Save Course'}
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

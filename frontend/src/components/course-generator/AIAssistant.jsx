import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BookOpen, Target, Clock, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIAssistant = ({ 
  context = {}, 
  onSuggestionSelect 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSuggestion, setCopiedSuggestion] = useState(null);
  const navigate = useNavigate();

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      // Simulate AI generation with context
      const mockSuggestions = [
        `Comprehensive ${context.level || 'Beginner'} course on ${context.title || 'Web Development'} covering fundamental concepts and practical skills.`,
        `Dive deep into ${context.category || 'Programming'} with this engaging and hands-on learning experience designed for ${context.level || 'aspiring'} professionals.`,
        `Master the art of ${context.title || 'Software Engineering'} through real-world projects and in-depth theoretical knowledge tailored for ${context.level || 'learners'}.`
      ];

      setSuggestions(mockSuggestions);
    } catch (error) {
      toast.error('Failed to generate suggestions');
      console.error('AI Suggestion Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySuggestion = (suggestion) => {
    navigator.clipboard.writeText(suggestion);
    setCopiedSuggestion(suggestion);
    toast.success('Suggestion copied!');
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopiedSuggestion(null), 2000);
  };

  const handleSelectSuggestion = (suggestion) => {
    onSuggestionSelect(suggestion);
    toast.success('Suggestion applied to course description');
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('beginner');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState(0);
  const [mode, setMode] = useState('course');
  const [generatedCourse, setGeneratedCourse] = useState(null);

  const features = [
    {
      id: 'course',
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Course Structure',
      description: 'Generate complete course outline and content'
    },
    {
      id: 'objectives',
      icon: <Target className="w-5 h-5" />,
      title: 'Learning Objectives',
      description: 'Create specific learning goals and outcomes'
    },
    {
      id: 'schedule',
      icon: <Clock className="w-5 h-5" />,
      title: 'Course Schedule',
      description: 'Generate optimal learning timeline'
    },
    {
      id: 'assessment',
      icon: <Brain className="w-5 h-5" />,
      title: 'Assessments',
      description: 'Create quizzes and assignments'
    }
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          level,
          duration,
          price,
          subject
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate course');
      }

      const data = await response.json();
      setGeneratedCourse(data);
    } catch (error) {
      console.error('Error generating course:', error);
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = async () => {
    // Add logic to edit the course
  };

  const handleSaveCourse = async () => {
    // Add logic to save the course
  };

  const handleViewCourse = () => {
    navigate('/instructor/courses/preview', { 
      state: { courseData: generatedCourse } 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI Course Assistant</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Web Development Course"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., A course on web development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Web Development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Area
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Web Development, Mathematics"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., 10 weeks"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., 100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <motion.button
              key={feature.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(feature.id)}
              className={`p-4 rounded-lg border text-left transition-colors ${mode === feature.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
                }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-indigo-600">{feature.icon}</div>
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </motion.button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!subject || isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2 ${isLoading || !subject
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
            />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {isLoading ? 'Generating...' : 'Generate with AI'}
        </button>

        {generatedCourse && (
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Generated Course</h2>
            <p className="text-sm text-gray-500">{generatedCourse.title}</p>
            <button
              onClick={handleViewCourse}
              className="w-full py-2 px-4 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700"
            >
              View Course
            </button>
            <button
              onClick={handleEditCourse}
              className="py-2 px-4 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700"
            >
              Edit Course
            </button>
            <button
              onClick={handleSaveCourse}
              className="py-2 px-4 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700"
            >
              Save Course
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">AI Course Description Generator</h3>
          <button
            onClick={generateSuggestions}
            disabled={isLoading}
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Generating...' : 'Generate Suggestions'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
          </div>
        ) : (
          suggestions.length > 0 && (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <p className="text-gray-700 mr-4">{suggestion}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCopySuggestion(suggestion)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Copy Suggestion"
                    >
                      {copiedSuggestion === suggestion ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {suggestions.length === 0 && !isLoading && (
          <p className="text-gray-500 text-center py-8">
            Click "Generate Suggestions" to get AI-powered course description ideas.
          </p>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;

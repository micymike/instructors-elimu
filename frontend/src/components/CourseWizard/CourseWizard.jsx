import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Basic Information Form Component
const BasicInfoForm = ({ data, updateData }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Course Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateData({ ...data, title: e.target.value })}
          placeholder="Enter course title"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => updateData({ ...data, description: e.target.value })}
          placeholder="Enter course description"
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={data.category}
            onChange={(e) => updateData({ ...data, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="programming">Programming</option>
            <option value="Mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            <option value="language">Language</option>
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="literature">Literature</option>
            <option value="health">Health</option>
            <option value="fitness">Fitness</option>
            <option value="cooking">Cooking</option>
            <option value="photography">Photography</option>
            <option value="design">Design</option>
            <option value="technology">Technology</option>
            <option value="engineering">Engineering</option>
            <option value="business">Business</option>
            <option value="Other">Other</option>

          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            value={data.level}
            onChange={(e) => updateData({ ...data, level: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Syllabus Builder Component
const SyllabusBuilder = ({ data, updateData }) => {
  const [module, setModule] = useState({ title: '', description: '', lessons: [] });
  
  const addModule = () => {
    updateData([...data, module]);
    setModule({ title: '', description: '', lessons: [] });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Module Title</label>
        <input
          type="text"
          value={module.title}
          onChange={(e) => setModule({ ...module, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Module Description</label>
        <textarea
          value={module.description}
          onChange={(e) => setModule({ ...module, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <button
        onClick={addModule}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Module
      </button>

      <div className="mt-4">
        {data.map((mod, index) => (
          <div key={index} className="p-4 border rounded-lg mb-2">
            <h3 className="font-medium">{mod.title}</h3>
            <p className="text-sm text-gray-600">{mod.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Schedule Planner Component
const SchedulePlanner = ({ data, updateData }) => {
  const [session, setSession] = useState({ title: '', date: '', duration: '' });

  const addSession = () => {
    updateData([...data, session]);
    setSession({ title: '', date: '', duration: '' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Session Title</label>
          <input
            type="text"
            value={session.title}
            onChange={(e) => setSession({ ...session, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={session.date}
            onChange={(e) => setSession({ ...session, date: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={session.duration}
            onChange={(e) => setSession({ ...session, duration: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={addSession}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Session
      </button>

      <div className="mt-4">
        {data.map((ses, index) => (
          <div key={index} className="p-4 border rounded-lg mb-2">
            <h3 className="font-medium">{ses.title}</h3>
            <p className="text-sm text-gray-600">
              Date: {ses.date} | Duration: {ses.duration} minutes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Resource Manager Component
const ResourceManager = ({ data, updateData }) => {
  const [resource, setResource] = useState({ title: '', type: '', url: '' });

  const addResource = () => {
    updateData([...data, resource]);
    setResource({ title: '', type: '', url: '' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Resource Title</label>
          <input
            type="text"
            value={resource.title}
            onChange={(e) => setResource({ ...resource, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={resource.type}
            onChange={(e) => setResource({ ...resource, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="link">External Link</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            type="url"
            value={resource.url}
            onChange={(e) => setResource({ ...resource, url: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={addResource}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Resource
      </button>

      <div className="mt-4">
        {data.map((res, index) => (
          <div key={index} className="p-4 border rounded-lg mb-2">
            <h3 className="font-medium">{res.title}</h3>
            <p className="text-sm text-gray-600">
              Type: {res.type} | URL: {res.url}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Preview Component
const Preview = ({ courseData }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold">{courseData.basicInfo.title}</h2>
        <p className="mt-2 text-gray-600">{courseData.basicInfo.description}</p>
        <div className="mt-2">
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {courseData.basicInfo.level}
          </span>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
            {courseData.basicInfo.category}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Syllabus</h3>
        {courseData.syllabus.map((module, index) => (
          <div key={index} className="p-4 border rounded-lg mb-2">
            <h4 className="font-medium">{module.title}</h4>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-medium mb-2">Schedule</h3>
        {courseData.schedule.map((session, index) => (
          <div key={index} className="p-4 border rounded-lg mb-2">
            <h4 className="font-medium">{session.title}</h4>
            <p className="text-sm text-gray-600">
              Date: {session.date} | Duration: {session.duration} minutes
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-medium mb-2">Resources</h3>
        {courseData.resources.map((resource, index) => (
          <div key={index} className="p-4 border rounded-lg mb-2">
            <h4 className="font-medium">{resource.title}</h4>
            <p className="text-sm text-gray-600">
              Type: {resource.type} | <a href={resource.url} className="text-blue-500 hover:underline">Access Resource</a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Course Wizard Component
const CourseWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    basicInfo: {
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      duration: '',
      price: ''
    },
    syllabus: [],
    schedule: [],
    resources: [],
    assessments: []
  });

  const steps = [
    { title: 'Basic Information', component: BasicInfoForm },
    { title: 'Syllabus', component: SyllabusBuilder },
    { title: 'Schedule', component: SchedulePlanner },
    { title: 'Resources', component: ResourceManager },
    { title: 'Preview', component: Preview }
  ];

const handleNext = async () => {
  if (activeStep === 0) {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('/courses/analyze', courseData.basicInfo, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const analysis = response.data;
      // Update the course data with the analysis
      setCourseData(prev => ({ ...prev, analysis }));
    } catch (error) {
      console.error('Error analyzing course content:', error);
    }
  }
  setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
};

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const updateStepData = (step, data) => {
    setCourseData(prev => ({
      ...prev,
      [Object.keys(prev)[step]]: data
    }));
  };

  const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const CurrentStepComponent = steps[activeStep].component;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Create New Course
            </h1>
          </motion.div>

          <div className="flex justify-between items-center overflow-x-auto py-4">
            {steps.map((step, index) => (
              <div 
                key={step.title} 
                className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${activeStep >= index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm text-gray-600 hidden md:block">
                    {step.title}
                  </span>
                </div>
                {index !== steps.length - 1 && (
                  <div className="flex-1 h-px bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute w-full"
              >
                <div className="p-4">
                  <CurrentStepComponent
                    data={courseData[Object.keys(courseData)[activeStep]]}
                    updateData={(data) => updateStepData(activeStep, data)}
                    courseData={courseData}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/80 flex items-center justify-center"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              </motion.div>
            )}
          </div>

          {/* Error Alert */}
          {courseData.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{courseData.error}</span>
            </div>
          )}

          {/* Success Alert */}
          {courseData.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success: </strong>
              <span className="block sm:inline">{courseData.success}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 px-4">
            <button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-blue-600 transition-colors"
            >
              {activeStep === steps.length - 1 ? 'Publish Course' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Step {activeStep + 1} of {steps.length}</span>
          <span>{steps[activeStep].title}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseWizard;

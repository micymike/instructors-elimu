import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Bot, User, Save, Edit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!text) return;

    setDisplayText('');
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [text]);

  return <span className="whitespace-pre-wrap">{displayText}</span>;
};

const ChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([{
    id: '1',
    type: 'bot',
    content: "Hi! I'm your AI course creation assistant. Let's create a course together! What subject would you like to teach?",
    isTyping: true
  }]);

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const chatEndRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:3000/api/course-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          mode: 'course',
          message: input,
          context: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      console.log('AI Response:', data); // Debug log

      // Add bot response
      const botMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: data.message,
        isTyping: true
      };

      setMessages(prev => [...prev, botMessage]);

      // If course data is generated, show it
      if (data.courseData) {
        console.log('Course Data:', data.courseData); // Debug log
        setCourseData(data.courseData);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: "Sorry, I encountered an error. Please try again.",
        isTyping: true
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCourse = async () => {
    setIsSaving(true);

    try {
      // Build course data from chat conversation
      const course = {
        title: messages.find(m => m.type === 'user' && m.content.includes('/title'))?.content.split('/title ')[1] || '',
        description: messages.find(m => m.type === 'user' && m.content.includes('/description'))?.content.split('/description ')[1] || '',
        duration: messages.find(m => m.type === 'user' && m.content.includes('/duration'))?.content.split('/duration ')[1] || '',
        level: messages.find(m => m.type === 'user' && m.content.includes('/level'))?.content.split('/level ')[1] || '',
        category: messages.find(m => m.type === 'user' && m.content.includes('/category'))?.content.split('/category ')[1] || '',
        modules: messages
          .filter(m => m.type === 'user' && m.content.includes('/module'))
          .map(m => {
            const [_, title, description] = m.content.split('/module ');
            return { title, description };
          })
      };

      // Save course to server
      const response = await fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course)
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }

      const savedCourse = await response.json();

      // Show success message
      toast.success('Course saved successfully!');

      // Add success message to chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: "✨ Course has been saved successfully! You can find it in your courses list.",
        isTyping: true
      }]);

      // Navigate to courses page after a short delay
      setTimeout(() => {
        navigate('/instructor/courses', {
          state: {
            newCourse: savedCourse,
            highlight: true
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    const handleSaveCourse = async () => {
      setIsSaving(true);

      try {
        // Build course data from chat conversation
        const course = {
          title: messages.find(m => m.type === 'user' && m.content.includes('/title'))?.content.split('/title ')[1] || '',
          description: messages.find(m => m.type === 'user' && m.content.includes('/description'))?.content.split('/description ')[1] || '',
          duration: messages.find(m => m.type === 'user' && m.content.includes('/duration'))?.content.split('/duration ')[1] || '',
          level: messages.find(m => m.type === 'user' && m.content.includes('/level'))?.content.split('/level ')[1] || '',
          category: messages.find(m => m.type === 'user' && m.content.includes('/category'))?.content.split('/category ')[1] || '',
          modules: messages
            .filter(m => m.type === 'user' && m.content.includes('/module'))
            .map(m => {
              const [_, title, description] = m.content.split('/module ');
              return { title, description };
            })
        };

        // Save course to server
        const response = await fetch('http://localhost:3000/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(course)
        });

        if (!response.ok) {
          throw new Error('Failed to save course');
        }

        const result = await response.json();
        toast.success('Course saved successfully!');

        // Optionally handle the saved course data
        console.log('Saved Course:', result);

      } catch (error) {
        toast.error(error.message || 'Error saving course. Please try again.');
        console.error('Error saving course:', error);
      } finally {
        setIsSaving(false);
      }
    };

    handleSaveCourse();
  };

  const handleClose = () => {
    // Logic to close the chat interface
    onClose();
  };

  // Add course preview component
  const CoursePreview = ({ course }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Course Preview</h3>
        <button
          onClick={handleSaveCourse}
          disabled={isSaving}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          )}
        >
          {isSaving ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Course</span>
            </>
          )}
        </button>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Title</h4>
        <p className="p-2 bg-gray-50 rounded">{course.title}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Description</h4>
        <p className="p-2 bg-gray-50 rounded">{course.description}</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-700">Modules</h4>
        <div className="space-y-3">
          {course.modules.map((module, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded">
              <h5 className="font-medium">{module.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{module.description}</p>
              <div className="mt-2 space-y-1">
                {module.content.map((content, idx) => (
                  <div key={idx} className="ml-3 text-sm">
                    <span className="text-blue-600">{content.type}: </span>
                    {content.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-700">Level</h4>
          <p className="p-2 bg-gray-50 rounded">{course.level}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Duration</h4>
          <p className="p-2 bg-gray-50 rounded">{course.duration}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold">AI Course Creator</h2>
            <p className="text-sm opacity-90">Let's create something amazing together</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Course</span>
            </button>
            <button
              onClick={handleClose}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Section */}
          <div className={cn(
            "flex-1 flex flex-col",
            courseData && "w-1/2 border-r"
          )}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "flex",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex items-start space-x-2 max-w-[80%]",
                      message.type === 'user' && "flex-row-reverse space-x-reverse"
                    )}>
                      <div className={cn(
                        "p-2 rounded-full",
                        message.type === 'user' ? "bg-blue-100" : "bg-gray-100"
                      )}>
                        {message.type === 'user' ? (
                          <User className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Bot className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className={cn(
                        "p-3 rounded-lg",
                        message.type === 'user'
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      )}>
                        {message.isTyping ? (
                          <TypewriterEffect text={message.content} />
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleSend}
                  disabled={isGenerating || !input.trim()}
                  className={cn(
                    "p-3 rounded-lg transition-colors",
                    isGenerating || !input.trim()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {isGenerating ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Course Preview Section */}
          {courseData && (
            <div className="w-1/2 overflow-y-auto p-4 bg-gray-50">
              <div className="bg-white rounded-lg shadow p-4">
                <CoursePreview course={courseData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
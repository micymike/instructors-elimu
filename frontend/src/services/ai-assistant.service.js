import axios from 'axios';
import api from './api';
import { courseAPI } from './api';
import { documentsAPI } from './api';
import { settingsAPI } from './api';

// Get API key from environment variable
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error('VITE_GROQ_API_KEY environment variable is not set. Please add it to your .env file.');
}

class AIAssistantService {
  constructor() {
    this.subscribers = new Set();
    this.chatHistory = [];
    this.contextCache = new Map();
    
    // Initialize Groq API client
    this.groqApi = axios.create({
      baseURL: 'https://api.groq.com/openai/v1',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
        'Content-Type': 'application/json'
      }
    });

    // Test the API key on initialization
    this.testApiKey().catch(error => {
      console.error('Failed to initialize Groq API:', error);
    });
  }

  async testApiKey() {
    try {
      const response = await this.groqApi.get('/models');
      console.log('Groq API initialized successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      throw new Error(`Failed to initialize Groq API: ${errorMessage}`);
    }
  }

  async getContextualData(context) {
    try {
      const contextData = {
        courseInfo: null,
        courseContent: null,
        courseMaterials: null,
        courseProgress: null,
        userInfo: null,
        currentPageData: null
      };

      // Get course information if available
      if (context.courseId) {
        const [courseInfo, courseContent, courseMaterials] = await Promise.all([
          courseAPI.getCourse(context.courseId),
          courseAPI.getCourseContent(context.courseId),
          courseAPI.getCourseMaterials(context.courseId)
        ]);
        
        contextData.courseInfo = courseInfo;
        contextData.courseContent = courseContent;
        contextData.courseMaterials = courseMaterials;
      }

      // Get user information
      if (context.userRole) {
        const userInfo = await settingsAPI.getSettings();
        contextData.userInfo = userInfo;
      }

      // Get page-specific data
      if (context.currentPage) {
        const pageData = await this.getPageSpecificData(context.currentPage, context);
        contextData.currentPageData = pageData;
      }

      return contextData;
    } catch (error) {
      console.error('Error getting contextual data:', error);
      return null;
    }
  }

  async getPageSpecificData(page, context) {
    // Extract page type from URL
    const pageType = page.split('/')[2]; // e.g., 'courses', 'students', etc.
    
    try {
      switch (pageType) {
        case 'courses':
          return await courseAPI.getCourseStats();
        case 'students':
          return await api.get('/students/stats');
        case 'assignments':
          return await api.get('/assignments/stats');
        case 'documents':
          return await documentsAPI.getAllDocuments();
        default:
          return null;
      }
    } catch (error) {
      console.error('Error getting page data:', error);
      return null;
    }
  }

  async getResponse(input, context) {
    try {
      // Check if it's a simple greeting
      const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
      const isGreeting = greetings.some(greeting => 
        input.toLowerCase().trim().startsWith(greeting)
      );

      // Get contextual data only if it's not a simple greeting
      const contextData = isGreeting ? null : await this.getContextualData(context);
      
      // Build appropriate system message
      const systemMessage = this.buildSystemMessage(contextData, context);
      
      const messages = [
        { role: "system", content: systemMessage },
        ...this.chatHistory,
        { role: "user", content: input }
      ];

      console.log('Sending request to Groq API with messages:', messages);

      const response = await this.groqApi.post('/chat/completions', {
        model: "mixtral-8x7b-32768",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      });

      console.log('Groq API Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = response.data.choices[0].message.content;
      
      // Update chat history
      this.chatHistory.push(
        { role: "user", content: input },
        { role: "assistant", content: aiResponse }
      );

      if (this.chatHistory.length > 10) {
        this.chatHistory = this.chatHistory.slice(-10);
      }

      return aiResponse;
    } catch (error) {
      console.error('Error in getResponse:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw new Error('Failed to get AI response');
    }
  }

  buildSystemMessage(contextData, context) {
    let systemMessage = `You are a helpful and concise teaching assistant. Follow these rules:
1. Keep responses brief and to the point
2. For greetings or casual conversation, respond naturally without mentioning course details
3. Only provide course/user information when specifically asked
4. Match the formality level of the user's question
5. Use context only when relevant to the question

Current context: `;

    // Only add course context if we're in a course-related page
    if (context.currentPage?.includes('/courses/') && contextData?.courseInfo) {
      systemMessage += `Course: ${contextData.courseInfo.title}. `;
    }

    // Only add user role for context
    if (context.userRole) {
      systemMessage += `Role: ${context.userRole}. `;
    }

    // Add capabilities but keep it brief
    systemMessage += `\nI can help with course content, assignments, progress tracking, and document analysis. What do you need help with?`;

    return systemMessage;
  }

  async handleFileUpload(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/ai/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async analyzeDocument(fileUrl) {
    try {
      const response = await api.post('/ai/analyze-document', { fileUrl });
      return response.data;
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document');
    }
  }

  getChatHistory({ courseId, userRole }) {
    return this.chatHistory;
  }

  getCourseSuggestions(courseId) {
    return [
      "How do I submit an assignment?",
      "What are the course requirements?",
      "How can I contact the instructor?",
      "Where can I find course materials?",
      "How do I track my progress?",
      "Can I get help with a specific topic?",
      "What's my current grade?",
      "Are there any upcoming deadlines?",
      "How do I join a study group?",
      "Can you explain this concept?"
    ];
  }

  subscribeToNotifications(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
}

export default new AIAssistantService();

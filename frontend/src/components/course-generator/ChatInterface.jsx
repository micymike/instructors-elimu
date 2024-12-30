import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, Move, Paperclip, Smile, Volume2 } from 'lucide-react';
import debounce from 'lodash/debounce';

const TypingIndicator = () => (
  <motion.div 
    className="flex space-x-2 p-2 rounded-lg bg-gray-100 w-16"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          y: ["0%", "-50%", "0%"],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: dot * 0.2,
        }}
      />
    ))}
  </motion.div>
);

const ChatInterface = ({ onClose, onSuggestion }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your Elimu Assistant. How can I help you with your course content?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(600);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTypingStatus = debounce(async (text) => {
    if (text.length > 0) {
      // Simulate sending typing status to backend
      console.log('User is typing...');
    }
  }, 500);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    handleTypingStatus(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3000/api/courses/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      
      // Simulate natural typing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: data.response,
        timestamp: new Date().toISOString()
      }]);

      if (data.suggestion) {
        onSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResize = (e) => {
    if (!isDragging) return;
    const newWidth = Math.max(300, Math.min(800, e.clientX - e.target.getBoundingClientRect().left));
    const newHeight = Math.max(400, Math.min(800, e.clientY - e.target.getBoundingClientRect().top));
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Add file upload logic here
        console.log('File selected:', file);
      }
    };
    input.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
      ref={chatContainerRef}
    >
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-blue-500" />
          <div>
            <h3 className="font-medium">Elimu Assistant</h3>
            {isTyping && (
              <span className="text-xs text-gray-500">typing...</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={handleResize}
            onMouseLeave={() => setIsDragging(false)}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-se-resize"
          >
            <Move className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[calc(100%-120px)] overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] p-3 rounded-lg relative group
                ${message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'}
              `}>
                {message.content}
                <span className="absolute bottom-1 right-2 text-xs opacity-50 group-hover:opacity-100">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div 
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ maxHeight: '120px', minHeight: '40px' }}
              rows={1}
            />
            <div className="absolute bottom-2 left-2 flex space-x-2">
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                onClick={handleFileUpload}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleVoiceRecord}
                className={`p-1 rounded hover:bg-gray-100 ${isRecording ? 'text-red-500' : 'text-gray-500'}`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`
              p-2 rounded-lg transition-colors
              ${!input.trim() || isTyping
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'}
            `}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
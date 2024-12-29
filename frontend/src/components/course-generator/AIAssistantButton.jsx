import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './ChatInterface';

const AIAssistantButton = ({ onCourseGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg 
                 hover:bg-blue-700 transition-colors z-50"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6" />
      </motion.button>

      {/* Chat Interface Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 w-96 h-[600px] z-50 rounded-lg shadow-xl"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute top-0 left-0 right-0 -mt-12 mb-4 text-center">
                  <div className="inline-block bg-white px-4 py-2 rounded-full shadow-md">
                    <p className="text-sm text-gray-600">
                      Click here to be assisted by Elimu AI
                    </p>
                  </div>
                </div>
                <ChatInterface onCourseGenerated={(data) => {
                  onCourseGenerated(data);
                  setIsOpen(false);
                }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistantButton; 
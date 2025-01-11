import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AIAssistant from './course-generator/AIAssistant';

const AIModal = ({ 
  isOpen, 
  onClose, 
  context = {},
  onSuggestionSelect 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <AIAssistant 
          context={context}
          onSuggestionSelect={onSuggestionSelect}
        />
      </div>
    </div>
  );
};

export default AIModal;

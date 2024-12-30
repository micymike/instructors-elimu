import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import ReactQuill from 'react-quill';
import { X } from 'lucide-react'; // Import X icon from lucide-react
import 'react-quill/dist/quill.snow.css';

const ContentTypes = {
  DOCUMENT: 'document',
  VIDEO: 'video',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  DISCUSSION: 'discussion',
  RESOURCE: 'resource'
};

// Custom styled components to replace UI components
const StyledButton = ({ children, variant = 'default', className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded-md transition-colors ${
      variant === 'danger' 
        ? 'bg-red-500 hover:bg-red-600 text-white' 
        : 'bg-blue-500 hover:bg-blue-600 text-white'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const StyledInput = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const StyledAlert = ({ children, type = 'info' }) => (
  <div className={`p-4 rounded-md mb-4 ${
    type === 'error' ? 'bg-red-100 text-red-700' : 
    type === 'success' ? 'bg-green-100 text-green-700' : 
    'bg-blue-100 text-blue-700'
  }`}>
    {children}
  </div>
);

// Grammar checking simulation
const checkGrammar = async (text) => {
  const commonErrors = {
    "dont": "don't",
    "cant": "can't",
    "wont": "won't",
    "its": "it's",
    "theyre": "they're"
  };
  
  let suggestions = [];
  let words = text.split(' ');
  
  words.forEach((word, index) => {
    const lowercaseWord = word.toLowerCase();
    if (commonErrors[lowercaseWord]) {
      suggestions.push({
        index,
        original: word,
        suggestion: commonErrors[lowercaseWord]
      });
    }
  });
  
  return suggestions;
};

// Autocomplete suggestions
const getAutocompleteSuggestions = (text) => {
  const commonPhrases = [
    "Please complete the following assignment",
    "Watch the video and take notes",
    "Submit your work by",
    "In this lesson, we will learn about",
    "Required reading materials include"
  ];
  
  return commonPhrases.filter(phrase => 
    phrase.toLowerCase().startsWith(text.toLowerCase())
  );
};

const ContentSection = ({ 
  section, 
  onUpdate, 
  onDelete, 
  isEditMode = false,
  onContentAdd,
  onContentRemove 
}) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [grammarSuggestions, setGrammarSuggestions] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const quillRef = useRef(null);

  // Custom Quill modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image'
  ];

  // Grammar check debounced function
  const debouncedGrammarCheck = useCallback(
    debounce(async (text) => {
      const suggestions = await checkGrammar(text);
      setGrammarSuggestions(suggestions);
    }, 500),
    []
  );

  // Autosave functionality
  useEffect(() => {
    if (unsavedChanges) {
      const saveTimer = setTimeout(() => {
        console.log('Auto-saving changes...');
        setUnsavedChanges(false);
      }, 2000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [unsavedChanges]);

  const handleTitleChange = (value) => {
    setCurrentInput(value);
    setUnsavedChanges(true);
    debouncedGrammarCheck(value);
    
    // Handle autocomplete suggestions
    const words = value.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.length > 2) {
      const suggestions = getAutocompleteSuggestions(lastWord);
      setAutocompleteSuggestions(suggestions);
      setShowAutoComplete(suggestions.length > 0);
    } else {
      setShowAutoComplete(false);
    }
    
    onUpdate({ ...section, title: value });
  };

  const handleAddContent = (type) => {
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: type === ContentTypes.QUIZ ? [] : '',
      dueDate: null,
      points: type === ContentTypes.ASSIGNMENT ? 100 : null,
      requirements: [],
      createdAt: new Date().toISOString()
    };
    
    onUpdate({
      ...section,
      items: [...(section.items || []), newItem]
    });
    
    setIsAddMenuOpen(false);
    setEditingItemId(newItem.id);
    setUnsavedChanges(true);
  };

  const handleItemUpdate = (itemId, updates) => {
    const updatedItems = section.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdate({ ...section, items: updatedItems });
    setUnsavedChanges(true);
  };

  const handleItemDelete = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item? This action cannot be undone.')) {
      onContentRemove(itemId);
      const updatedItems = section.items.filter(item => item.id !== itemId);
      onUpdate({ ...section, items: updatedItems });
      setUnsavedChanges(true);
    }
  };

  const handleDrop = (draggedId, targetId) => {
    const items = [...section.items];
    const draggedIndex = items.findIndex(item => item.id === draggedId);
    const targetIndex = items.findIndex(item => item.id === targetId);
    
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    
    onUpdate({ ...section, items });
    setUnsavedChanges(true);
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Replace the delete button SVG with Lucide-React X icon
  const DeleteButton = () => (
    <button
      onClick={() => handleItemDelete(item.id)}
      className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  );

  // Render the ReactQuill editor with a wrapper component
  const Editor = ({ value, onChange }) => {
    const wrapperRef = useRef(null);

    return (
      <div ref={wrapperRef} className={`${isFullScreen ? 'h-screen' : 'h-64'}`}>
<ReactQuill
  ref={quillRef}
  theme="snow"
  value={value}
  onChange={onChange}
  modules={modules}
  formats={formats}
  className="h-full"
  forwardedRef={quillRef}
/>
      </div>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <StyledInput
              value={currentInput}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Section Title"
              className="text-lg font-medium"
            />
            
            {isEditMode && (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <StyledButton
                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                    className="flex items-center"
                  >
                    <span>Add Content</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </StyledButton>

                  {isAddMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 py-1">
                      {Object.entries(ContentTypes).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => handleAddContent(value)}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <StyledButton
                  variant="danger"
                  onClick={() => onDelete(section.id)}
                  className="flex items-center"
                >
                  <span>Delete</span>
                </StyledButton>
              </div>
            )}
          </div>

          {grammarSuggestions.length > 0 && (
            <StyledAlert type="info">
              <div className="text-sm">
                Grammar suggestions:
                <ul className="mt-1">
                  {grammarSuggestions.map((suggestion, index) => (
                    <li key={index}>
                      Consider replacing "{suggestion.original}" with "{suggestion.suggestion}"
                    </li>
                  ))}
                </ul>
              </div>
            </StyledAlert>
          )}

          {showAutoComplete && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
              {autocompleteSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleTitleChange(suggestion);
                    setShowAutoComplete(false);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {(section.items || []).map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`flex items-center p-3 bg-white rounded-md border ${
                draggedItemId === item.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}
              draggable={isEditMode}
              onDragStart={() => setDraggedItemId(item.id)}
              onDragEnd={() => setDraggedItemId(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedItemId && draggedItemId !== item.id) {
                  handleDrop(draggedItemId, item.id);
                }
              }}
            >
              <div className="flex-grow">
                {editingItemId === item.id && isEditMode ? (
                  <div className="space-y-2">
                    <StyledInput
                      value={item.title}
                      onChange={(e) => handleItemUpdate(item.id, { title: e.target.value })}
                      onBlur={() => setEditingItemId(null)}
                      autoFocus
                    />
                    {item.type === ContentTypes.ASSIGNMENT && (
                      <div className="flex space-x-4">
                        <StyledInput
                          type="number"
                          placeholder="Points"
                          value={item.points}
                          onChange={(e) => handleItemUpdate(item.id, { points: parseInt(e.target.value) })}
                        />
                        <StyledInput
                          type="date"
                          value={item.dueDate}
                          onChange={(e) => handleItemUpdate(item.id, { dueDate: e.target.value })}
                        />
                      </div>
                    )}
                    {item.type === ContentTypes.DOCUMENT && (
                      <>
                        <StyledButton onClick={handleFullScreenToggle}>
                          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                        </StyledButton>
                        <Editor
                          value={item.content}
                          onChange={(content) => handleItemUpdate(item.id, { content })}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => isEditMode && setEditingItemId(item.id)}
                    className={`text-sm font-medium text-gray-900 ${isEditMode ? 'cursor-pointer hover:text-blue-600' : ''}`}
                  >
                    <h3>{item.title}</h3>
                    {item.type === ContentTypes.ASSIGNMENT && (
                      <div className="text-sm text-gray-500">
                        {item.points} points • Due: {item.dueDate}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isEditMode && (
                <div className="flex items-center ml-4 space-x-2">
                  <DeleteButton />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ContentSection;

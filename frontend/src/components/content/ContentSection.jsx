import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TableRow from '@tiptap/extension-table-row';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight'
import { Calendar, Clock, X, Bold, Italic, Link2, Image as ImageIcon, List, Code, Table as TableIcon, HelpCircle } from 'lucide-react';

// Initialize lowlight with common languages
const lowlight = createLowlight(common)

const ContentTypes = {
  DOCUMENT: 'document',
  VIDEO: 'video',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  DISCUSSION: 'discussion',
  RESOURCE: 'resource',
  INTERACTIVE: 'interactive'
};

const StyledButton = ({ children, variant = 'default', className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded-md transition-colors ${
      variant === 'danger'
        ? 'bg-red-500 hover:bg-red-600 text-white'
        : variant === 'secondary'
        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
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

const EditorMenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2">
      <StyledButton
        variant="secondary"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-300' : ''}
      >
        <Bold className="w-4 h-4" />
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-300' : ''}
      >
        <Italic className="w-4 h-4" />
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive('link') ? 'bg-gray-300' : ''}
      >
        <Link2 className="w-4 h-4" />
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => {
          const url = window.prompt('Enter image URL:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        <ImageIcon className="w-4 h-4" />
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-300' : ''}
      >
        <List className="w-4 h-4" />
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-gray-300' : ''}
      >
        <Code className="w-4 h-4" />
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
      >
        <TableIcon className="w-4 h-4" />
      </StyledButton>
    </div>
  );
};

const Editor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight,
      TaskList,
      TaskItem,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  return (
    <div className="border border-gray-300 rounded-md">
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[300px] p-4 prose max-w-none" />
    </div>
  );
};

const DateTimePicker = ({ value, onChange }) => (
  <div className="flex items-center space-x-2">
    <input
      type="date"
      value={value ? value.split('T')[0] : ''}
      onChange={(e) => {
        const date = e.target.value;
        const time = value ? value.split('T')[1] : '00:00';
        onChange(`${date}T${time}`);
      }}
      className="px-3 py-2 border border-gray-300 rounded-md"
    />
    <input
      type="time"
      value={value ? value.split('T')[1].slice(0, 5) : ''}
      onChange={(e) => {
        const date = value ? value.split('T')[0] : new Date().toISOString().split('T')[0];
        onChange(`${date}T${e.target.value}:00`);
      }}
      className="px-3 py-2 border border-gray-300 rounded-md"
    />
  </div>
);

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
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleDragStart = (e, itemId) => {
    setDraggedItem(itemId);
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedItem === targetId) return;

    const items = [...section.items];
    const draggedItemIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetId);

    const [removed] = items.splice(draggedItemIndex, 1);
    items.splice(targetIndex, 0, removed);

    onUpdate({ ...section, items });
    setDraggedItem(null);
  };

  const handleItemUpdate = (itemId, updates) => {
    const updatedItems = section.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdate({ ...section, items: updatedItems });
    setUnsavedChanges(true);
  };

  const handleTextAreaClick = (fieldId) => {
    if (isEditMode) {
      setFocusedField(fieldId);
    }
  };

  const renderContentEditor = (item) => {
    switch (item.type) {
      case ContentTypes.DOCUMENT:
        return (
          <Editor
            value={item.content}
            onChange={(content) => handleItemUpdate(item.id, { content })}
          />
        );
      case ContentTypes.VIDEO:
        return (
          <div className="space-y-2">
            <StyledInput
              value={item.videoUrl || ''}
              onChange={(e) => handleItemUpdate(item.id, { videoUrl: e.target.value })}
              placeholder="Video URL"
            />
            <StyledInput
              value={item.duration || ''}
              onChange={(e) => handleItemUpdate(item.id, { duration: e.target.value })}
              placeholder="Duration (minutes)"
              type="number"
            />
          </div>
        );
      case ContentTypes.ASSIGNMENT:
        return (
          <div className="space-y-4">
            <Editor
              value={item.content}
              onChange={(content) => handleItemUpdate(item.id, { content })}
            />
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <DateTimePicker
                  value={item.dueDate}
                  onChange={(date) => handleItemUpdate(item.id, { dueDate: date })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Points</label>
                <StyledInput
                  type="number"
                  value={item.points || 0}
                  onChange={(e) => handleItemUpdate(item.id, { points: parseInt(e.target.value) })}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden relative"
    >
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <input
            value={section.title || ''}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
            className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            placeholder="Section Title"
          />
          
          {isEditMode && (
            <div className="flex items-center space-x-2">
              <StyledButton onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}>
                Add Content
              </StyledButton>
              <StyledButton variant="danger" onClick={() => onDelete(section.id)}>
                Delete Section
              </StyledButton>
            </div>
          )}
        </div>
      </div>

      {isAddMenuOpen && (
        <div className="absolute right-4 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-1">
          {Object.entries(ContentTypes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                const newItem = {
                  id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  type: value,
                  title: `New ${value.charAt(0).toUpperCase() + value.slice(1)}`,
                  content: '',
                  createdAt: new Date().toISOString()
                };
                onUpdate({
                  ...section,
                  items: [...(section.items || []), newItem]
                });
                setIsAddMenuOpen(false);
                setEditingItemId(newItem.id);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 space-y-4">
        {section.items?.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
            className={`p-4 bg-white rounded-lg border ${
              draggedItem === item.id ? 'border-blue-500' : 'border-gray-200'
            } ${isEditMode ? 'cursor-move' : ''}`}
          >
            <div 
              className={`p-4 ${
                focusedField === item.id ? 'ring-2 ring-blue-500' : ''
              } cursor-text`}
              onClick={() => handleTextAreaClick(item.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <input
                  value={item.title}
                  onChange={(e) => handleItemUpdate(item.id, { title: e.target.value })}
                  className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder={`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Title`}
                  disabled={!isEditMode}
                />
                
                {isEditMode && (
                  <button
                    onClick={() => handleItemDelete(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {isEditMode && renderContentEditor(item)}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAIAssistant(true)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ContentSection;
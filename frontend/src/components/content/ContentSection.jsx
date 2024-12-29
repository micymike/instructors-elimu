import React from 'react';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import { Edit2, Trash2, Plus } from 'lucide-react';
import DroppableWrapper from '../dnd/DroppableWrapper';

export const ContentSection = ({ section, onUpdate, onDelete, contentIcons }) => {
    const handleTitleChange = (e) => {
        onUpdate({ ...section, title: e.target.value });
    };

    const handleAddContent = (type = 'document') => {
        const newItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            title: type === 'quiz' ? 'New Assessment' : 'New Content',
            content: type === 'quiz' ? [] : ''
        };
        onUpdate({
            ...section,
            items: [...(section.items || []), newItem]
        });
    };

    // Ensure section has an ID
    const sectionId = section.id || `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
        >
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    value={section.title}
                    onChange={handleTitleChange}
                    className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
                />
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleAddContent('document')}
                        className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                        title="Add Document"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleAddContent('quiz')}
                        className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                        title="Add Assessment"
                    >
                        {contentIcons.quiz}
                    </button>
                    <button
                        onClick={() => onDelete(section.id)}
                        className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <DroppableWrapper droppableId={sectionId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-2 min-h-[50px] ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                    >
                        {(section.items || []).map((item, index) => {
                            const itemId = item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                            return (
                                <Draggable key={itemId} draggableId={itemId} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`flex items-center p-3 bg-white rounded-md border ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'}`}
                                        >
                                            <div className="text-gray-500 mr-3">
                                                {contentIcons[item.type]}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const updatedItems = [...section.items];
                                                    updatedItems[index] = {
                                                        ...item,
                                                        title: prompt('Enter new title', item.title) || item.title
                                                    };
                                                    onUpdate({ ...section, items: updatedItems });
                                                }}
                                                className="p-1 text-gray-400 hover:text-indigo-600"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </DroppableWrapper>
        </motion.div>
    );
}; 
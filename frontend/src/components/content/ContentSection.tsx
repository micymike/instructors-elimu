import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2 } from 'lucide-react';

interface ContentSectionProps {
    section: any;
    onUpdate: (section: any) => void;
    onDelete: () => void;
    contentIcons: Record<string, JSX.Element>;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
    section,
    onUpdate,
    onDelete,
    contentIcons
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <motion.div
            layout
            className="bg-white rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            {/* Section header */}
            <div className="p-4 flex items-center justify-between">
                {isEditing ? (
                    <input
                        type="text"
                        value={section.title}
                        onChange={(e) => onUpdate({ ...section, title: e.target.value })}
                        className="flex-1 px-2 py-1 border rounded"
                        autoFocus
                    />
                ) : (
                    <h3 className="text-lg font-medium">{section.title}</h3>
                )}

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Section content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <Droppable droppableId={section.id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="p-4 space-y-2"
                                >
                                    {section.items.map((item: any, index: number) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="flex items-center p-2 bg-gray-50 rounded-md"
                                                >
                                                    {contentIcons[item.type]}
                                                    <span className="ml-2">{item.title}</span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}; 
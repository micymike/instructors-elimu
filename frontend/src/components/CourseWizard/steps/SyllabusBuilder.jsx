import React, { useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import DroppableWrapper from '../../dnd/DroppableWrapper';

const SyllabusBuilder = ({ data, updateData, aiSuggestions }) => {
  const [modules, setModules] = useState(data || []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setModules(items);
    updateData(items);
  };

  const addModule = () => {
    const newModule = {
      id: `module-${Date.now()}`,
      title: 'New Module',
      description: '',
      content: []
    };
    setModules([...modules, newModule]);
    updateData([...modules, newModule]);
  };

  const removeModule = (index) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
    updateData(updatedModules);
  };

  const updateModule = (index, field, value) => {
    const updatedModules = modules.map((module, i) => {
      if (i === index) {
        return { ...module, [field]: value };
      }
      return module;
    });
    setModules(updatedModules);
    updateData(updatedModules);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Course Modules</h3>
        <button
          onClick={addModule}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <DroppableWrapper droppableId="modules">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {modules.map((module, index) => (
                <Draggable
                  key={module.id}
                  draggableId={module.id}
                  index={index}
                >
                  {(provided) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white border rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(index, 'title', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Module Title"
                          />
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(index, 'description', e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                            placeholder="Module Description"
                            rows={2}
                          />
                        </div>
                        <button
                          onClick={() => removeModule(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </DroppableWrapper>
      </DragDropContext>

      {aiSuggestions && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">AI Suggestions</h4>
          <div className="text-sm text-blue-600">{aiSuggestions}</div>
        </div>
      )}
    </div>
  );
};

export default SyllabusBuilder;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Video,
  FileText,
  Link,
  Download
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const contentTypes = {
  video: { icon: Video, label: "Video" },
  document: { icon: FileText, label: "Document" },
  link: { icon: Link, label: "External Link" },
  download: { icon: Download, label: "Downloadable Resource" }
};

export const CourseContentManager = ({ courseId }) => {
  const [sections, setSections] = useState([
    {
      id: "1",
      title: "Introduction to the Course",
      items: [
        { id: "1-1", type: "video", title: "Welcome Video", duration: "5:30" },
        { id: "1-2", type: "document", title: "Course Outline", size: "1.2 MB" }
      ]
    },
    {
      id: "2",
      title: "Getting Started",
      items: [
        { id: "2-1", type: "video", title: "Setup Guide", duration: "12:45" },
        { id: "2-2", type: "link", title: "Additional Resources", url: "https://example.com" }
      ]
    }
  ]);

  const [expandedSections, setExpandedSections] = useState(new Set(["1"]));

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceSection = sections.find(s => s.id === source.droppableId);
    const destSection = sections.find(s => s.id === destination.droppableId);

    if (!sourceSection || !destSection) return;

    const newSections = [...sections];
    const [movedItem] = sourceSection.items.splice(source.index, 1);
    destSection.items.splice(destination.index, 0, movedItem);

    setSections(newSections);
  };

  const addNewSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      items: []
    };
    setSections([...sections, newSection]);
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const addContentItem = (sectionId, type) => {
    const newItem = {
      id: `item-${Date.now()}`,
      type,
      title: `New ${contentTypes[type].label}`,
      ...(type === 'video' ? { duration: "0:00" } : {}),
      ...(type === 'document' ? { size: "0 KB" } : {}),
      ...(type === 'link' ? { url: "" } : {})
    };

    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Course Content</h2>
        <button
          onClick={addNewSection}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {sections.map((section) => (
          <div key={section.id} className="border rounded-lg">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="h-5 w-5 text-gray-400" />
                <h3 className="font-medium">{section.title}</h3>
                <span className="text-sm text-gray-500">
                  {section.items.length} items
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Droppable droppableId={section.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-4 space-y-2"
                      >
                        {section.items.map((item, index) => {
                          const ContentIcon = contentTypes[item.type].icon;
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center space-x-3 p-3 bg-white border rounded-lg"
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-gray-400"
                                  >
                                    <GripVertical className="h-5 w-5" />
                                  </div>
                                  <ContentIcon className="h-5 w-5 text-gray-500" />
                                  <div className="flex-1">
                                    <h4 className="font-medium">{item.title}</h4>
                                    <p className="text-sm text-gray-500">
                                      {item.duration || item.size || item.url}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                      <Pencil className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                      <Trash2 className="h-4 w-4 text-gray-500" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        <div className="flex space-x-2 pt-2">
                          {Object.entries(contentTypes).map(([type, { icon: Icon, label }]) => (
                            <button
                              key={type}
                              onClick={() => addContentItem(section.id, type)}
                              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                              <Plus className="h-3 w-3" />
                              <Icon className="h-3 w-3" />
                              <span>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default CourseContentManager; 
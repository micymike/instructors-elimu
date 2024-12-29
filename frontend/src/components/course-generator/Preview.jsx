import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

const Preview = ({ syllabus }) => {
    // Ensure syllabus is an object with expected properties
    if (!syllabus || typeof syllabus !== 'object') {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>Invalid syllabus data</span>
                </div>
            </div>
        );
    }

    const {
        title,
        description,
        modules = [],
        level,
        duration,
        category
    } = syllabus;

    return (
        <div className="space-y-6">
            {/* Course Overview */}
            <div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-600">{description}</p>

                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {level}
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        {duration}
                    </div>
                    <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {category}
                    </div>
                </div>
            </div>

            {/* Modules */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Course Modules</h3>
                {Array.isArray(modules) && modules.map((module, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg"
                    >
                        <h4 className="font-medium mb-2">{module.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{module.description}</p>

                        {/* Module Content */}
                        {Array.isArray(module.content) && module.content.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center text-sm text-gray-500 ml-4 mt-2">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                <span>{item.title}</span>
                            </div>
                        ))}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Preview; 
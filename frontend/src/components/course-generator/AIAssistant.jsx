import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Target, Clock, Brain } from 'lucide-react';

export const AIAssistant = ({ onGenerate }) => {
    const [subject, setSubject] = useState('');
    const [level, setLevel] = useState('beginner');
    const [mode, setMode] = useState('course');
    const [isLoading, setIsLoading] = useState(false);

    const features = [
        {
            id: 'course',
            icon: <BookOpen className="w-5 h-5" />,
            title: 'Course Structure',
            description: 'Generate complete course outline and content'
        },
        {
            id: 'objectives',
            icon: <Target className="w-5 h-5" />,
            title: 'Learning Objectives',
            description: 'Create specific learning goals and outcomes'
        },
        {
            id: 'schedule',
            icon: <Clock className="w-5 h-5" />,
            title: 'Course Schedule',
            description: 'Generate optimal learning timeline'
        },
        {
            id: 'assessment',
            icon: <Brain className="w-5 h-5" />,
            title: 'Assessments',
            description: 'Create quizzes and assignments'
        }
    ];

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/course-generation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    mode,
                    subject,
                    level
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate course');
            }

            const data = await response.json();
            await onGenerate(data);
        } catch (error) {
            console.error('Error generating course:', error);
            // You might want to add error handling UI here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">AI Course Assistant</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Area
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., Web Development, Mathematics"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Level
                    </label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <motion.button
                            key={feature.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setMode(feature.id)}
                            className={`p-4 rounded-lg border text-left transition-colors ${mode === feature.id
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="text-indigo-600">{feature.icon}</div>
                                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                            </div>
                            <p className="text-sm text-gray-500">{feature.description}</p>
                        </motion.button>
                    ))}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!subject || isLoading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2 ${isLoading || !subject
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    {isLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                        />
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    {isLoading ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
        </div>
    );
}; 
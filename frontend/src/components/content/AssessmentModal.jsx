import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';

export const AssessmentModal = ({ isOpen, onClose, onSave }) => {
    const [questions, setQuestions] = useState([
        { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);

    const handleQuestionChange = (id, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, question: value } : q
        ));
    };

    const handleOptionChange = (questionId, optionIndex, value) => {
        setQuestions(questions.map(q =>
            q.id === questionId
                ? {
                    ...q,
                    options: q.options.map((opt, idx) =>
                        idx === optionIndex ? value : opt
                    )
                }
                : q
        ));
    };

    const handleCorrectAnswerChange = (questionId, optionIndex) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? { ...q, correctAnswer: optionIndex } : q
        ));
    };

    const addQuestion = () => {
        const newId = Math.max(...questions.map(q => q.id)) + 1;
        setQuestions([
            ...questions,
            { id: newId, question: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]);
    };

    const removeQuestion = (id) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    const handleSubmit = () => {
        onSave(questions);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Create Assessment</h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {questions.map((q, qIndex) => (
                                    <div key={q.id} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <input
                                                type="text"
                                                value={q.question}
                                                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                                                placeholder="Enter question"
                                                className="flex-1 p-2 border rounded mr-2"
                                            />
                                            {questions.length > 1 && (
                                                <button
                                                    onClick={() => removeQuestion(q.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {q.options.map((option, optIndex) => (
                                                <div key={optIndex} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        checked={q.correctAnswer === optIndex}
                                                        onChange={() => handleCorrectAnswerChange(q.id, optIndex)}
                                                        className="w-4 h-4 text-indigo-600"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(q.id, optIndex, e.target.value)}
                                                        placeholder={`Option ${optIndex + 1}`}
                                                        className="flex-1 p-2 border rounded"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={addQuestion}
                                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                                >
                                    <Plus className="w-5 h-5 mr-1" />
                                    Add Question
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Save Assessment
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { AssessmentModal } from '../../components/content/AssessmentModal';
import axios from 'axios';

const Assessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/assessments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssessments(response.data);
        } catch (error) {
            toast.error('Failed to fetch assessments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAssessment = async (questions) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/assessments', {
                title: 'New Assessment',
                questions
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssessments([...assessments, response.data]);
            toast.success('Assessment created successfully');
        } catch (error) {
            toast.error('Failed to create assessment');
        }
    };

    const handleEditAssessment = async (assessment) => {
        setSelectedAssessment(assessment);
        setIsModalOpen(true);
    };

    const handleUpdateAssessment = async (questions) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/assessments/${selectedAssessment._id}`, {
                questions
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAssessments();
            toast.success('Assessment updated successfully');
        } catch (error) {
            toast.error('Failed to update assessment');
        }
    };

    const handleDeleteAssessment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this assessment?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/assessments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssessments(assessments.filter(a => a._id !== id));
            toast.success('Assessment deleted successfully');
        } catch (error) {
            toast.error('Failed to delete assessment');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Assessment
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent"
                        />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {assessments.map((assessment) => (
                            <motion.div
                                key={assessment._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {assessment.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {assessment.questions.length} questions
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditAssessment(assessment)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAssessment(assessment._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Last modified {new Date(assessment.updatedAt).toLocaleDateString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <AssessmentModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedAssessment(null);
                    }}
                    onSave={selectedAssessment ? handleUpdateAssessment : handleCreateAssessment}
                    assessment={selectedAssessment}
                />
            </div>
        </div>
    );
};

export default Assessments; 
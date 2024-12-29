import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Book, FileText, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/useToast';

const CourseLearning = () => {
    const [course, setCourse] = useState(null);
    const [currentSection, setCurrentSection] = useState(0);
    const [currentItem, setCurrentItem] = useState(0);
    const [progress, setProgress] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (!courseId) {
            toast.error('No course selected');
            navigate('/instructor/courses');
            return;
        }
        fetchCourse();
        fetchProgress();
    }, [courseId, navigate]);

const fetchCourse = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data || !response.data.sections) {
            throw new Error('Invalid course data');
        }

        setCourse(response.data);
    } catch (error) {
        console.error('Error fetching course:', error);
        if (error.response.status === 404) {
            toast.error('Course not found');
        } else {
            toast.error('Failed to fetch course');
        }
        navigate('/instructor/courses');
    } finally {
        setIsLoading(false);
    }
};

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/courses/${courseId}/progress`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProgress(response.data || {});
        } catch (error) {
            console.error('Failed to fetch progress:', error);
            setProgress({});
        }
    };

    const markComplete = async (itemId) => {
        if (!itemId) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/courses/${courseId}/progress`, {
                itemId,
                completed: true
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProgress();
            toast.success('Progress updated');
        } catch (error) {
            console.error('Error updating progress:', error);
            toast.error('Failed to update progress');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                    <p className="mt-2 text-gray-600">Loading course content...</p>
                </div>
            </div>
        );
    }

    if (!course || !course.sections || course.sections.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Content Available</h2>
                    <p className="text-gray-600">This course doesn't have any content yet.</p>
                </div>
            </div>
        );
    }

    const currentSectionData = course.sections[currentSection];
    const currentContent = currentSectionData?.items?.[currentItem];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white h-screen overflow-y-auto fixed border-r">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">{course.title}</h2>
                        {course.sections.map((section, sIndex) => (
                            <div key={section.id || sIndex} className="mb-4">
                                <h3 className="font-medium text-gray-700 mb-2">{section.title}</h3>
                                <ul className="space-y-2">
                                    {section.items?.map((item, iIndex) => (
                                        <li
                                            key={item.id || `${sIndex}-${iIndex}`}
                                            onClick={() => {
                                                setCurrentSection(sIndex);
                                                setCurrentItem(iIndex);
                                            }}
                                            className={`flex items-center p-2 rounded cursor-pointer ${currentSection === sIndex && currentItem === iIndex
                                                    ? 'bg-indigo-50 text-indigo-600'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            {item.type === 'video' && <Play className="w-4 h-4 mr-2" />}
                                            {item.type === 'document' && <FileText className="w-4 h-4 mr-2" />}
                                            {item.type === 'quiz' && <Book className="w-4 h-4 mr-2" />}
                                            <span className="text-sm">{item.title}</span>
                                            {progress[item.id] && (
                                                <CheckCircle className="w-4 h-4 ml-auto text-green-500" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="ml-64 flex-1 p-8">
                    {currentContent ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-md p-6"
                        >
                            <h1 className="text-2xl font-bold mb-4">{currentContent.title}</h1>
                            {currentContent.type === 'video' && (
                                <div className="aspect-w-16 aspect-h-9 mb-4">
                                    <iframe
                                        src={currentContent.url}
                                        className="w-full h-full rounded"
                                        allowFullScreen
                                        title={currentContent.title}
                                    />
                                </div>
                            )}
                            {currentContent.type === 'document' && (
                                <div className="prose max-w-none">
                                    {currentContent.content}
                                </div>
                            )}
                            <button
                                onClick={() => markComplete(currentContent.id)}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Mark as Complete
                            </button>
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Select a lesson from the sidebar to begin</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseLearning;

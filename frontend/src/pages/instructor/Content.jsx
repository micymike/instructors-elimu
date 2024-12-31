import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Video, FileText, Wrench, Search, Filter, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/useToast';

const Content = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: 'all',
        level: 'all',
        subject: 'all',
        isFree: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    const resourceTypes = {
        textbook: { icon: Book, color: 'text-blue-600' },
        video: { icon: Video, color: 'text-red-600' },
        article: { icon: FileText, color: 'text-green-600' },
        tool: { icon: Wrench, color: 'text-purple-600' }
    };

    // Sample curated resources (you can move this to your backend)
    const curatedResources = [
        {
            title: "Python Programming - Real Python",
            type: "course",
            provider: "Real Python",
            url: "https://realpython.com",
            description: "Comprehensive Python programming tutorials and resources",
            subject: "Python",
            level: "beginner",
            isFree: true,
            tags: ["python", "programming", "web development"]
        },
        {
            title: "MDN Web Docs",
            type: "documentation",
            provider: "Mozilla",
            url: "https://developer.mozilla.org",
            description: "Complete documentation for web technologies",
            subject: "Web Development",
            level: "intermediate",
            isFree: true,
            tags: ["html", "css", "javascript"]
        },
        {
            title: "freeCodeCamp",
            type: "course",
            provider: "freeCodeCamp",
            url: "https://www.freecodecamp.org",
            description: "Free coding bootcamp and certification",
            subject: "Programming",
            level: "beginner",
            isFree: true,
            tags: ["web development", "javascript", "python"]
        },
        // Add more curated resources...
    ];

    useEffect(() => {
        fetchResources();
    }, [filters, searchQuery]);

    const fetchResources = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://eba3-102-0-10-118.ngrok-free.app/api/resources', {
                headers: { Authorization: `Bearer ${token}` },
                params: { ...filters, search: searchQuery }
            });
            setResources(response.data);
        } catch (error) {
            toast.error('No learning resources available at the moment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Discover curated educational content and materials
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 md:mt-0 relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                        >
                            <option value="all">All Types</option>
                            <option value="textbook">Textbooks</option>
                            <option value="video">Videos</option>
                            <option value="article">Articles</option>
                            <option value="course">Courses</option>
                            <option value="tool">Tools</option>
                        </select>

                        <select
                            value={filters.level}
                            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                        >
                            <option value="all">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>

                        <select
                            value={filters.isFree}
                            onChange={(e) => setFilters({ ...filters, isFree: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                        >
                            <option value="all">All Resources</option>
                            <option value="true">Free</option>
                            <option value="false">Premium</option>
                        </select>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {curatedResources.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        {React.createElement(resourceTypes[resource.type]?.icon || Book, {
                                            className: `w-6 h-6 ${resourceTypes[resource.type]?.color || 'text-gray-600'}`
                                        })}
                                        <span className="ml-2 font-medium text-gray-600">{resource.type}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-sm ${resource.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {resource.isFree ? 'Free' : 'Premium'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {resource.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        By {resource.provider}
                                    </span>
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-blue-600 hover:text-blue-700"
                                    >
                                        Visit <ExternalLink className="w-4 h-4 ml-1" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Content;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Book, Upload, Trash2, DollarSign, Search, Filter, Mail, FileText, DollarSign as PriceIcon, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// API endpoints
const API_ENDPOINTS = {
    VERIFY_EMAIL: 'http://localhost:3000/api/auth/verify-email',
    UPLOAD: 'http://localhost:3000/api/documents/upload',
    DELETE: 'http://localhost:3000/api/documents/',
    PLAGIARISM: 'http://localhost:3000/api/documents/check-plagiarism',
    BASE_URL: 'http://localhost:3000'
};

// Document categories
const DOCUMENT_CATEGORIES = [
    { value: 'lecture_notes', label: 'Lecture Notes' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'research_paper', label: 'Research Paper' },
    { value: 'textbook', label: 'Textbook' },
    { value: 'study_guide', label: 'Study Guide' },
    { value: 'other', label: 'Other' }
];

const InstructorLibrary = () => {
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        priceRange: 'all',
        sortBy: 'newest'
    });
    const [userId, setUserId] = useState(null);
    const fileInputRef = useRef(null);

    // Upload process states
    const [uploadStep, setUploadStep] = useState(0);
    const [emailInput, setEmailInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentDetails, setDocumentDetails] = useState({
        title: '',
        price: 0,
        category: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalMessage, setModalMessage] = useState(null);

    // State for first and last name
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // State for upload guidance modal
    const [isUploadGuidanceOpen, setIsUploadGuidanceOpen] = useState(false);

    // State for upload modal
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Function to extract user ID from token
    const extractUserIdFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const payload = JSON.parse(window.atob(base64));
            return payload.sub || payload.id || payload.userId;
        } catch (error) {
            console.error('Error extracting user ID from token:', error);
            return null;
        }
    };

    // Effect to get user ID from token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const extractedUserId = extractUserIdFromToken(token);
            if (extractedUserId) {
                setUserId(extractedUserId);
                localStorage.setItem('userId', extractedUserId);
            }
        }
    }, []);

    // Fetch documents on component mount and when filters change
    useEffect(() => {
        const fetchDocuments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams({
                    search: searchQuery,
                    category: filters.type || '',
                    sortBy: filters.sortBy || 'newest'
                });

                const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/documents?${queryParams}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }

                const data = await response.json();
                setDocuments(data);
            } catch (err) {
                console.error('Error fetching documents:', err);
                setError('Failed to load documents');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();
    }, [searchQuery, filters.type, filters.sortBy]);

    // Add debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            // This will trigger the document fetch effect above
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Function to refresh documents after upload or delete
    const refreshDocuments = useCallback(async () => {
        const queryParams = new URLSearchParams({
            search: searchQuery,
            category: filters.type || '',
            sortBy: filters.sortBy || 'newest'
        });

        try {
            const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/documents?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }

            const data = await response.json();
            setDocuments(data);
        } catch (err) {
            console.error('Error refreshing documents:', err);
            setError('Failed to refresh documents');
        }
    }, [searchQuery, filters.type, filters.sortBy]);

    // Memoized fetch documents function
    const fetchDocuments = useCallback(async () => {
        if (!userId) {
            console.warn('Waiting for user ID...');
            return;
        }

        try {
            const queryParams = new URLSearchParams({
                search: searchQuery || '',
                type: filters.type || 'all',
                priceRange: filters.priceRange || 'all',
                sortBy: filters.sortBy || 'newest'
            });

            const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/documents?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'x-user-id': userId,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Log the full response for debugging
                const errorText = await response.text();
                console.error('Fetch documents error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
            // Optionally set an error state or show a notification
        }
    }, [userId, searchQuery, filters]);

    // Trigger fetch when userId or filters change
    useEffect(() => {
        fetchDocuments();
    }, [userId, searchQuery, filters, fetchDocuments]);

    // Modal component
    const Modal = ({ message, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <p className="text-lg mb-4">{message}</p>
                <button 
                    onClick={onClose}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );

    // Upload Document Modal
    const UploadGuidanceModal = ({ isOpen, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4 text-center">Upload Document</h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</span>
                            <p>Verify your email address</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</span>
                            <p>Select a PDF file to upload</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</span>
                            <p>Fill in document details (title, price, category)</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={() => {
                                onClose();
                                setUploadStep(0); // Start from email verification
                            }}
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
                        >
                            Start Upload Process
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Upload Modal Component
    const UploadModal = ({ isOpen, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Upload Document</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </div>
                    <div className="space-y-4">
                        {renderUploadSteps()}
                    </div>
                </div>
            </div>
        );
    };

    // Render upload steps
    const renderUploadSteps = () => {
        switch(uploadStep) {
            case 0:
                return renderEmailVerification();
            case 1:
                return (
                    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            Step 2: Select PDF File
                        </h2>
                        <div className="flex flex-col items-center space-y-4">
                            <FolderOpen className="text-gray-500 w-16 h-16" />
                            <input 
                                type="file" 
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                                Only PDF files are allowed
                            </p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            Step 3: Document Details
                        </h2>
                        <form onSubmit={handleDocumentDetailsSubmit} className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <FileText className="text-gray-500" />
                                <input 
                                    type="text" 
                                    value={documentDetails.title}
                                    onChange={(e) => setDocumentDetails(prev => ({
                                        ...prev, 
                                        title: e.target.value
                                    }))}
                                    placeholder="Document Title"
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required 
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <PriceIcon className="text-gray-500" />
                                <input 
                                    type="number" 
                                    value={documentDetails.price}
                                    onChange={(e) => setDocumentDetails(prev => ({
                                        ...prev, 
                                        price: parseFloat(e.target.value)
                                    }))}
                                    placeholder="Price (optional)"
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0" 
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <select 
                                    value={documentDetails.category}
                                    onChange={(e) => setDocumentDetails(prev => ({
                                        ...prev, 
                                        category: e.target.value
                                    }))}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Document Category</option>
                                    {DOCUMENT_CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
                            >
                                {isLoading ? 'Uploading...' : 'Upload Document'}
                            </button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderEmailVerification = () => {
        return (
            <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
                <form onSubmit={handleEmailVerification} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>
            </div>
        );
    };

    // Email Verification Handler
    const handleEmailVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validate first and last name
        if (!firstName.trim()) {
            setError('First name is required');
            setIsLoading(false);
            return;
        }

        if (!lastName.trim()) {
            setError('Last name is required');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_ENDPOINTS.VERIFY_EMAIL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: emailInput,
                    firstName: firstName.trim(),
                    lastName: lastName.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Email verification failed');
            }

            // Show verification message
            setModalMessage('Verification email sent! Please check your inbox.');
            
            // Set user ID from response
            setUserId(data.userId);
            setUploadStep(1);
        } catch (err) {
            // More detailed error handling
            setError(err.message || 'An unexpected error occurred during email verification');
        } finally {
            setIsLoading(false);
        }
    };

    // Add a new function to handle email verification
    const navigate = useNavigate();
    const handleEmailVerificationToken = async (token) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/auth/verify-email-token?token=${token}`, {
                method: 'GET'
            });

            const data = await response.json();

            if (response.ok) {
                // Verification successful
                setModalMessage('Email verified successfully!');
                
                // Ensure we're on the content upload page
                navigate('/instructor/content');
                
                // Set upload step to file selection
                setUploadStep(1);
            } else {
                // Verification failed
                setError(data.message || 'Email verification failed');
            }
        } catch (err) {
            setError('An unexpected error occurred during email verification');
            console.error('Email verification error:', err);
        }
    };

    // Add useEffect to check for verification token on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            handleEmailVerificationToken(token);
        }
    }, []);

    // File Selection Handler
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setUploadStep(2);
        } else {
            setError('Please select a PDF file');
        }
    };

    // Document Details Submission Handler
    const handleDocumentDetailsSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validate document details
        if (!documentDetails.title.trim()) {
            setError('Please enter a document title');
            setIsLoading(false);
            return;
        }

        if (documentDetails.price < 0) {
            setError('Price cannot be negative');
            setIsLoading(false);
            return;
        }

        if (!documentDetails.category) {
            setError('Please select a document category');
            setIsLoading(false);
            return;
        }

        // Prepare form data for upload
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', documentDetails.title);
        formData.append('type', documentDetails.category);
        formData.append('price', documentDetails.price.toString());
        formData.append('tags', JSON.stringify([]));

        try {
            // Upload document
            const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'x-user-id': userId
                },
                body: formData
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`Upload failed: ${errorText}`);
            }

            const uploadedDoc = await uploadResponse.json();

            // Check plagiarism
            const plagiarismResponse = await fetch(API_ENDPOINTS.PLAGIARISM, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ documentId: uploadedDoc._id })
            });

            const plagiarismResult = await plagiarismResponse.json();

            // Update documents list
            setDocuments(prev => [...prev, { 
                ...uploadedDoc, 
                plagiarismScore: plagiarismResult.score 
            }]);

            // Reset upload process
            resetUploadProcess();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset upload process
    const resetUploadProcess = () => {
        setUploadStep(0);
        setSelectedFile(null);
        setEmailInput('');
        setFirstName('');
        setLastName('');
        setDocumentDetails({
            title: '',
            price: 0,
            category: ''
        });
    };

    const handleDeleteDocument = async (documentId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            const response = await fetch(`${API_ENDPOINTS.DELETE}${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete document');
            }

            setModalMessage('Document deleted successfully');
            await refreshDocuments();
        } catch (error) {
            console.error('Error deleting document:', error);
            setError('Failed to delete document');
        }
    };

    const handleDocumentAction = async (documentId, action) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/documents/${documentId}/${action}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${action} document`);
            }

            if (action === 'preview') {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else if (action === 'download') {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'document.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error(`Error ${action}ing document:`, error);
            setError(`Failed to ${action} document: ${error.message}`);
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = filters.type === 'all' || doc.type === filters.type;
        
        const matchesPriceRange = filters.priceRange === 'all' ||
            (filters.priceRange === 'free' && doc.price === 0) ||
            (filters.priceRange === 'paid' && doc.price > 0) ||
            (filters.priceRange === 'under10' && doc.price < 10) ||
            (filters.priceRange === 'over10' && doc.price >= 10);

        return matchesSearch && matchesType && matchesPriceRange;
    });

    // Sort documents based on filter
    const sortedDocuments = [...filteredDocuments].sort((a, b) => {
        switch (filters.sortBy) {
            case 'newest':
                return new Date(b.uploadDate) - new Date(a.uploadDate);
            case 'oldest':
                return new Date(a.uploadDate) - new Date(b.uploadDate);
            case 'priceAsc':
                return a.price - b.price;
            case 'priceDesc':
                return b.price - a.price;
            case 'downloads':
                return b.downloads - a.downloads;
            default:
                return 0;
        }
    });

    const handleDocumentUpload = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('title', documentDetails.title);
            formData.append('price', documentDetails.price);
            formData.append('category', documentDetails.category);

            const response = await fetch(API_ENDPOINTS.UPLOAD, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload document');
            }

            await handleUploadSuccess();
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload document');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSuccess = async () => {
        // Update documents list
        setDocuments(prev => [...prev, { 
            title: documentDetails.title, 
            price: documentDetails.price, 
            category: documentDetails.category 
        }]);

        // Reset upload process
        resetUploadProcess();
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {modalMessage && (
                <Modal message={modalMessage} onClose={() => setModalMessage(null)} />
            )}
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="flex flex-col space-y-4 mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Your Document Library</h1>
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        <Upload className="w-5 h-5" />
                        <span>Upload Document</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                    
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="all">All Types</option>
                        <option value="pdf">PDF</option>
                        <option value="doc">DOC</option>
                        <option value="txt">TXT</option>
                    </select>

                    <select
                        value={filters.priceRange}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="all">All Prices</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                        <option value="under10">Under $10</option>
                        <option value="over10">Over $10</option>
                    </select>

                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="downloads">Most Downloaded</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedDocuments.map((doc) => (
                    <motion.div
                        key={doc._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-lg shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <Book className="w-8 h-8 text-blue-600 mr-3" />
                                <div>
                                    <h3 className="font-semibold">{doc.title}</h3>
                                    <p className="text-sm text-gray-600">By {doc.instructor}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 font-semibold">{doc.price === 0 ? 'Free' : doc.price}</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-600">
                            <div className="flex justify-between mb-2">
                                <span>Downloads: {doc.downloads}</span>
                                <span>Type: {doc.type.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                                <span className={`${
                                    doc.plagiarismScore < 20 ? 'text-green-600' :
                                    doc.plagiarismScore < 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    Plagiarism: {doc.plagiarismScore}%
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={() => handleDeleteDocument(doc._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => handleDocumentAction(doc._id, 'preview')}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Preview
                            </button>
                            <button 
                                onClick={() => handleDocumentAction(doc._id, 'download')}
                                className="text-green-500 hover:text-green-700"
                            >
                                Download
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => {
                    setIsUploadModalOpen(false);
                    resetUploadProcess();
                }} 
            />
        </div>
    );
};

export default InstructorLibrary;
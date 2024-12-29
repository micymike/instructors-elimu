import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, MessageSquare, BookOpen, Settings, Monitor, FileText, Plus, Share2, Download, Search, Bell, ChevronDown, Filter, MoreVertical, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { API_URL } from '../../config';

const ZoomClassroom = () => {
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    duration: 'all',
    status: 'all',
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    description: '',
    recurring: false,
    maxParticipants: 100,
    requiresRegistration: false,
    materials: [],
  });

  useEffect(() => {
    // Simulating API fetch with more detailed data

    setTimeout(() => {
      setMeetings([
        {
          id: 1,
          title: 'Advanced React Patterns',
          date: '2024-12-21',
          time: '10:00',
          duration: 60,
          status: 'upcoming',
          attendees: 25,
          recording: null,
          materials: ['Lecture Slides', 'Exercise Sheet'],
          host: 'Dr. Sarah Johnson',
          thumbnail: '/emi.avif',
          description: 'Deep dive into advanced React patterns and best practices.',
          tags: ['React', 'Advanced', 'Programming'],
        },
        {
          id: 2,
          title: 'JavaScript Performance Optimization',
          date: '2024-12-20',
          time: '14:00',
          duration: 90,
          status: 'completed',
          attendees: 22,
          recording: 'recording-url',
          materials: ['Code Examples', 'Practice Problems'],
          host: 'Prof. Michael Chen',
          thumbnail: '/teacher1.avif',
          description: 'Learn techniques for optimizing JavaScript applications.',
          tags: ['JavaScript', 'Performance', 'Web Development'],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMeetings = meetings
    .filter(meeting => {
      if (searchQuery) {
        return meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               meeting.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return true;
    })
    .filter(meeting => {
      if (filters.duration === 'all') return true;
      if (filters.duration === 'short') return meeting.duration <= 60;
      if (filters.duration === 'long') return meeting.duration > 60;
      return true;
    });

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    // Implement API call to create meeting
    fetch(`${API_URL}/api/zoom/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newMeeting),
    })
      .then(res => res.json())
      .then(data => {
        setMeetings([...meetings, data]);
        setNewMeeting({
          title: '',
          date: '',
          time: '',
          duration: 60,
          description: '',
          recurring: false,
          maxParticipants: 100,
          requiresRegistration: false,
          materials: [],
        });
      })
      .catch(err => {
        console.error('Failed to create meeting:', err);
        toast.error('Failed to create meeting');
      });

    const newMeetingData = {
      ...newMeeting,
      id: meetings.length + 1,
      status: 'upcoming',
      attendees: 0,
      recording: null,
      host: 'Current User',
      thumbnail: 'mike.avif',
      tags: [],
    };
    setMeetings([...meetings, newMeetingData]);
    setShowCreateModal(false);
  };

  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold mb-4">Delete Meeting</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this meeting? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationPanel = () => (
    <div className={`absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 transform transition-all duration-200 ${
      showNotifications ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
    }`}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No new notifications</p>
            <p className="text-gray-400 text-sm">We'll notify you when something happens</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="p-4 border-b hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const CreateMeetingModal = () => (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 ${
      showCreateModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${
        showCreateModal ? 'translate-y-0' : 'translate-y-4'
      }">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Schedule New Class</h2>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleCreateMeeting} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  min="15"
                  step="15"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows="4"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newMeeting.recurring}
                    onChange={(e) => setNewMeeting({ ...newMeeting, recurring: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                  />
                  <span className="text-sm text-gray-700">Recurring meeting</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newMeeting.requiresRegistration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, requiresRegistration: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                  />
                  <span className="text-sm text-gray-700">Require registration</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Participants</label>
                <input
                  type="number"
                  value={newMeeting.maxParticipants}
                  onChange={(e) => setNewMeeting({ ...newMeeting, maxParticipants: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transform transition-all duration-200 hover:scale-105 shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Create Meeting</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderMeetingCard = (meeting) => (
    <div key={meeting.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg">
      <div className="relative">
        <img
          src={meeting.thumbnail}
          alt={meeting.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 space-x-2">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{meeting.title}</h3>
            <p className="text-gray-600 mb-4">{meeting.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {meeting.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{meeting.date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{meeting.time} ({meeting.duration} mins)</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{meeting.attendees} attendees</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{meeting.materials.length} materials</span>
          </div>

          <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={meeting.thumbnail}
                alt={meeting.host}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-600">Hosted by {meeting.host}</span>
            </div>
            {meeting.status === 'upcoming' ? (
              <button
                onClick={() => handleJoinMeeting(meeting.id)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Video className="w-4 h-4 mr-2" />
                Join Class
              </button>
            ) : (
              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Monitor className="w-4 h-4 mr-2" />
                  Recording
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Download className="w-4 h-4 mr-2" />
                  Materials
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Online Classroom</h1>
            <p className="text-gray-600 text-lg">Manage your virtual classes and learning sessions</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-600 hover:bg-white hover:shadow-md rounded-full transition-all duration-200"
            >
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transform transition-all duration-200 hover:scale-105 shadow-md w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>New Class</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 transition-all duration-200 hover:shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <button
                  className="px-4 py-3 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto justify-center"
                  onClick={() => {/* Toggle filter dropdown */}}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <select
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (&lt;= 60 mins)</option>
                <option value="long">Long (&gt; 60 mins)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b overflow-x-auto scrollbar-hide">
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Classes
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === 'completed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Past Classes
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings
              .filter((meeting) => meeting.status === activeTab)
              .map(renderMeetingCard)}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateMeetingModal />
      <NotificationPanel />
    </div>
  );
};

export default ZoomClassroom;
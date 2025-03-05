import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Video, AlertCircle, Loader, Trash2, Plus } from 'lucide-react';
import VirtualClassService from '../../services/virtualClass.service';

const VirtualClasses = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [newMeeting, setNewMeeting] = useState({
    topic: '',
    startTime: '',
    duration: 60,
    agenda: '',
    settings: {
      participants: 100
    }
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await VirtualClassService.getAllClasses();
      setMeetings(response.data || []);
    } catch (err) {
      setError('Failed to load virtual classes');
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateTimeChange = (date, time) => {
    const isoString = `${date}T${time}:00Z`;
    setNewMeeting(prev => ({ ...prev, startTime: isoString }));
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await VirtualClassService.createClass({
        ...newMeeting,
        startTime: newMeeting.startTime
      });
      
      setMeetings(prev => [...prev, response.data]);
      toast.success('Virtual class created successfully');
      setNewMeeting({
        topic: '',
        startTime: '',
        duration: 60,
        agenda: '',
        settings: { participants: 100 }
      });
    } catch (err) {
      setError('Failed to create virtual class');
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      setIsDeleting(meetingId);
      const confirmDelete = window.confirm('Are you sure you want to delete this virtual class?');
      if (!confirmDelete) return;

      await VirtualClassService.deleteClass(meetingId);
      setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.id !== meetingId));
      toast.success('Virtual class deleted successfully');
    } catch (err) {
      toast.error('Failed to delete virtual class');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading && !meetings.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center md:text-left"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Virtual Classes</h1>
        <p className="text-gray-600 text-lg">Manage your virtual classroom sessions</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
        >
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Class Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            Schedule New Class
          </h2>
          
          <form onSubmit={handleCreateMeeting} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Title *</label>
                <input
                  type="text"
                  value={newMeeting.topic}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    onChange={(e) => handleDateTimeChange(e.target.value, newMeeting.startTime.split('T')[1]?.split(':')[0])}
                    className="w-full border border-gray-200 rounded-xl p-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    onChange={(e) => handleDateTimeChange(newMeeting.startTime.split('T')[0], e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl p-3"
                    min={30}
                    max={180}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants *</label>
                  <input
                    type="number"
                    value={newMeeting.settings.participants}
                    onChange={(e) => setNewMeeting(prev => ({
                      ...prev,
                      settings: { ...prev.settings, participants: Number(e.target.value) }
                    }))}
                    className="w-full border border-gray-200 rounded-xl p-3"
                    min={10}
                    max={500}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
                <textarea
                  value={newMeeting.agenda}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, agenda: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl p-3 h-32"
                  placeholder="Class agenda..."
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" />
                  Create Class
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Classes List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Scheduled Classes</h2>
          
          <AnimatePresence>
            {meetings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200"
              >
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming classes scheduled</p>
              </motion.div>
            ) : (
              meetings.map(meeting => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{meeting.topic}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        new Date(meeting.start_time) > new Date() 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {new Date(meeting.start_time) > new Date() ? 'Upcoming' : 'Completed'}
                      </span>
                      <button
                        onClick={() => handleDeleteMeeting(meeting.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        disabled={isDeleting === meeting.id}
                      >
                        {isDeleting === meeting.id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span>{new Date(meeting.start_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span>{new Date(meeting.start_time).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-500" />
                      <span>{meeting.settings.participants} participants maximum</span>
                    </div>
                  </div>

                  {meeting.agenda && (
                    <p className="mt-4 text-gray-500 text-sm">{meeting.agenda}</p>
                  )}

                  <div className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleJoinMeeting(meeting.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Video className="w-5 h-5" />
                      Join Class
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VirtualClasses;
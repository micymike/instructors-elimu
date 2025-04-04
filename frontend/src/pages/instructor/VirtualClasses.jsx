import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Video, AlertCircle, Loader, Trash2, Plus, Link, ExternalLink } from 'lucide-react';
import VirtualClassService, { MEETING_STATUS } from '../../services/virtualClass.service';

const VirtualClasses = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [joiningMeeting, setJoiningMeeting] = useState(null);
  const [gettingLink, setGettingLink] = useState(null);
  const [showCreateMeetingForm, setShowCreateMeetingForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    topic: '',
    startTime: '',
    duration: 60,
    agenda: ''
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      console.log('Fetching meetings...');
      const response = await VirtualClassService.getAllClasses();
      console.log('Full API Response:', {
        data: response,
        type: typeof response,
        keys: Object.keys(response),
        sample: Array.isArray(response) ? response[0] : Array.isArray(response.meetings) ? response.meetings[0] : null
      });

      // Log meeting data structure
      const meetingsData = Array.isArray(response) ? response : response?.meetings || [];
      console.log('Meetings data structure:', meetingsData.map(meeting => ({
        id: meeting._id,
        mongo_id: meeting.mongo_id,
        zoomId: meeting.zoom_id,
        topic: meeting.topic,
        allKeys: Object.keys(meeting)
      })));
      if (Array.isArray(response)) {
        console.log('Setting meetings from array response');
        setMeetings(response);
      } else if (response && Array.isArray(response.meetings)) {
        console.log('Setting meetings from response.meetings');
        setMeetings(response.meetings);
      } else {
        console.error('Unexpected response format:', {
          response,
          isArray: Array.isArray(response),
          hasMeetings: response && Array.isArray(response.meetings)
        });
        setMeetings([]);
      }
    } catch (err) {
      setError('Failed to load virtual classes');
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate input
    if (!newMeeting.topic || !newMeeting.startTime) {
      toast.error('Please provide a topic and start time');
      setLoading(false);
      return;
    }

    try {
      // Ensure startTime is in ISO 8601 format
      const isoStartTime = new Date(newMeeting.startTime).toISOString();

      const meetingData = {
        topic: newMeeting.topic,
        startTime: isoStartTime,
        duration: newMeeting.duration || 60,
        agenda: newMeeting.agenda || ''
      };

      const response = await VirtualClassService.createClass(meetingData);
      
      // Add the new meeting to the list
      setMeetings(prev => [...prev, response]);
      
      // Reset form and close
      setNewMeeting({
        topic: '',
        startTime: '',
        duration: 60,
        agenda: ''
      });
      setShowCreateMeetingForm(false);
      
      // Show success toast
      toast.success('Virtual class created successfully');
    } catch (err) {
      setError('Failed to create virtual class');
      toast.error(err.message || 'An error occurred while creating the meeting');
    } finally {
      setLoading(false);
    }
  };

  const renderCreateMeetingForm = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-lg p-6 mt-4"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Video className="w-6 h-6 mr-2 text-blue-600" /> Create New Virtual Class
        </h3>
        <form onSubmit={handleCreateMeeting} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Meeting Topic
            </label>
            <input
              type="text"
              id="topic"
              value={newMeeting.topic}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, topic: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Enter meeting topic"
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={newMeeting.startTime}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, startTime: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={newMeeting.duration}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              min="15"
              max="240"
              placeholder="Meeting duration in minutes"
            />
          </div>
          <div>
            <label htmlFor="agenda" className="block text-sm font-medium text-gray-700">
              Agenda (Optional)
            </label>
            <textarea
              id="agenda"
              value={newMeeting.agenda}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, agenda: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Enter meeting agenda"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowCreateMeetingForm(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </motion.div>
    );
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      setIsDeleting(meetingId);
      const confirmDelete = window.confirm('Are you sure you want to delete this virtual class?');
      if (!confirmDelete) return;

      await VirtualClassService.deleteClass(meetingId);
      setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting._id !== meetingId));
      toast.success('Virtual class deleted successfully');
    } catch (err) {
      toast.error('Failed to delete virtual class');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleJoinMeeting = async (meetingId) => {
    try {
      if (!meetingId) {
        console.error('Meeting ID is undefined:', { meetingId });
        toast.error('Invalid meeting ID');
        return;
      }

      setJoiningMeeting(meetingId);
      console.log('Joining meeting with ID:', meetingId);

      // Find the meeting to check if it's an early join
      const meeting = meetings.find(m => m.id === meetingId);
      const isEarlyJoin = meeting && getMeetingStatus(meeting.start_time, meeting.duration) === MEETING_STATUS.SCHEDULED;

      const response = await VirtualClassService.joinClass(meetingId);
      console.log('Join meeting response:', response);

      const joinUrl = response?.join_url || response?.joinUrl;
      if (joinUrl) {
        window.open(joinUrl, '_blank');
        if (isEarlyJoin) {
          toast.success('Joining meeting early. The host may not have started the meeting yet.');
        } else {
          toast.success('Joining meeting...');
        }
      } else {
        console.error('No join URL in response:', response);
        toast.error('Failed to get meeting join URL');
      }
    } catch (err) {
      console.error('Error joining meeting:', err);
      toast.error(err.message || 'Failed to join meeting');
    } finally {
      setJoiningMeeting(null);
    }
  };

  const handleGetMeetingLink = async (meetingId) => {
    try {
      if (!meetingId) {
        console.error('Meeting ID is undefined:', { meetingId });
        toast.error('Invalid meeting ID');
        return;
      }

      setGettingLink(meetingId);
      
      const meetingDetails = await VirtualClassService.getMeetingLink(meetingId);
      
      if (meetingDetails?.join_url) {
        await navigator.clipboard.writeText(meetingDetails.join_url);
        toast.success('Meeting link copied to clipboard!');
        
        // Update the meeting in the list with full details
        setMeetings(prevMeetings => 
          prevMeetings.map(meeting => 
            meeting._id === meetingId ? { ...meeting, ...meetingDetails } : meeting
          )
        );
      } else {
        console.error('Missing join URL in response:', { meetingDetails });
        toast.error('Failed to get meeting link - No URL found');
      }
    } catch (err) {
      console.error('Error getting meeting details:', { error: err, meetingId });
      toast.error(err.message || 'Failed to get meeting details');
    } finally {
      setGettingLink(null);
    }
  };

  const getMeetingStatus = (startTime, duration) => {
    const now = new Date();
    const meetingStart = new Date(startTime);
    const meetingEnd = new Date(meetingStart.getTime() + duration * 60000);

    if (now < meetingStart) return MEETING_STATUS.SCHEDULED;
    if (now >= meetingStart && now <= meetingEnd) return MEETING_STATUS.IN_PROGRESS;
    return MEETING_STATUS.COMPLETED;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case MEETING_STATUS.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case MEETING_STATUS.IN_PROGRESS:
        return 'bg-green-100 text-green-800';
      case MEETING_STATUS.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case MEETING_STATUS.SCHEDULED:
        return 'Scheduled';
      case MEETING_STATUS.IN_PROGRESS:
        return 'In Progress';
      case MEETING_STATUS.COMPLETED:
        return 'Completed';
      default:
        return 'Unknown';
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
        {showCreateMeetingForm && renderCreateMeetingForm()}

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
              meetings.map(meeting => {
                const status = getMeetingStatus(meeting.start_time, meeting.duration);
                // Allow joining for both scheduled and in-progress meetings
                const isJoinable = status === MEETING_STATUS.IN_PROGRESS || status === MEETING_STATUS.SCHEDULED;
                const isEarlyJoin = status === MEETING_STATUS.SCHEDULED;

                // Add safeguards for required properties
                if (!meeting || !meeting.start_time) {
                  console.error('Invalid meeting data:', { meeting, id: meeting?.id });
                  return null;
                }

                return (
                  <motion.div
                    key={meeting.id || Math.random()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{meeting.topic || 'Untitled Meeting'}</h3>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                          {getStatusText(status)}
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
                        <span>
                          {(meeting.settings?.participants || 100)} participants maximum
                        </span>
                      </div>
                    </div>

                    {meeting.agenda?.trim() && (
                      <p className="mt-4 text-gray-500 text-sm">{meeting.agenda}</p>
                    )}

                    <div className="mt-6 space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleJoinMeeting(meeting.id)}
                        disabled={joiningMeeting === meeting.id || status === MEETING_STATUS.COMPLETED}
                        className={`w-full px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                          status !== MEETING_STATUS.COMPLETED
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {joiningMeeting === meeting.id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Video className="w-5 h-5" />
                            {isEarlyJoin ? 'Join Class (Early)' : 'Join Class'}
                          </>
                        )}
                      </motion.button>

                      {isEarlyJoin && (
                        <p className="text-xs text-blue-600 italic text-center mt-1">
                          You can join this meeting before its scheduled start time
                        </p>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGetMeetingLink(meeting.id)}
                        disabled={gettingLink === meeting.id}
                        className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {gettingLink === meeting.id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Link className="w-5 h-5" />
                            Get Meeting Link
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
      <button 
        onClick={() => setShowCreateMeetingForm(!showCreateMeetingForm)}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        <Plus className="w-5 h-5 mr-2" /> Create Meeting
      </button>
    </div>
  );
};

export default VirtualClasses;

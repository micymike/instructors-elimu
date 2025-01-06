import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';
import { Calendar, Clock, Users, Video, AlertCircle, Loader } from 'lucide-react';

const ZoomMeetings = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Fetch meetings on component mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/zoom/meetings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }

      const data = await response.json();
      // Handle the array of meetings from the Zoom API
      setMeetings(data.map(meeting => ({
        id: meeting.id,
        title: meeting.topic,
        startTime: meeting.start_time,
        duration: meeting.duration,
        description: meeting.agenda,
        maxParticipants: meeting.settings?.participants || 100,
        joinUrl: meeting.join_url,
        status: meeting.status
      })));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const validateMeetingData = () => {
    if (!newMeeting.title.trim()) {
      throw new Error('Title is required');
    }
    if (!newMeeting.date) {
      throw new Error('Date is required');
    }
    if (!newMeeting.time) {
      throw new Error('Time is required');
    }
    if (newMeeting.duration < 30 || newMeeting.duration > 180) {
      throw new Error('Duration must be between 30 and 180 minutes');
    }
    if (newMeeting.maxParticipants < 10 || newMeeting.maxParticipants > 500) {
      throw new Error('Max participants must be between 10 and 500');
    }

    // Check if meeting date is not in the past
    const meetingDateTime = new Date(newMeeting.date + 'T' + newMeeting.time);
    if (meetingDateTime < new Date()) {
      throw new Error('Meeting cannot be scheduled in the past');
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      validateMeetingData();

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/zoom/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newMeeting),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create meeting');
      }

      const data = await response.json();
      setMeetings(prev => [...prev, data]);
      toast.success('Meeting created successfully');
      
      // Reset form
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
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async (meetingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/zoom/meetings/${meetingId}/join`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to join meeting');
      }

      const { joinUrl, topic, startTime } = await response.json();
      
      if (!joinUrl) {
        toast.error('No join URL available for this meeting');
        return;
      }

      // Optional: Add a toast with meeting details before opening
      toast.success(`Joining meeting: ${topic} at ${new Date(startTime).toLocaleString()}`, {
        duration: 3000,
      });

      // Open the join URL in a new tab
      window.open(joinUrl, '_blank');
    } catch (err) {
      console.error('Join meeting error:', err);
      toast.error(err.message || 'Failed to join meeting');
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const confirmDelete = window.confirm('Are you sure you want to permanently delete this meeting?');
      if (!confirmDelete) return;

      const response = await fetch(`${API_URL}/api/zoom/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete meeting');
      }

      // Remove the deleted meeting from the list
      setMeetings(prevMeetings => 
        prevMeetings.filter(meeting => meeting.id !== meetingId)
      );

      toast.success('Meeting deleted successfully');
    } catch (err) {
      console.error('Delete meeting error:', err);
      toast.error(err.message || 'Failed to delete meeting');
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Zoom Meetings</h1>
        <p className="text-gray-600">Schedule and manage your virtual classroom sessions</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Meeting Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Schedule New Meeting</h2>
          <form onSubmit={handleCreateMeeting} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={30}
                  max={180}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input
                  type="number"
                  value={newMeeting.maxParticipants}
                  onChange={(e) => setNewMeeting({ ...newMeeting, maxParticipants: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={10}
                  max={500}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newMeeting.recurring}
                  onChange={(e) => setNewMeeting({ ...newMeeting, recurring: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Recurring Meeting</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newMeeting.requiresRegistration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, requiresRegistration: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Require Registration</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Meeting...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Create Meeting
                </>
              )}
            </button>
          </form>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Meetings</h2>
          {meetings.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No meetings scheduled yet</p>
            </div>
          ) : (
            meetings.map(meeting => (
              <div key={meeting.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{meeting.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      new Date(meeting.startTime) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(meeting.startTime) > new Date() ? 'Upcoming' : 'Past'}
                    </span>
                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Delete Meeting"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(meeting.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{new Date(meeting.startTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{meeting.maxParticipants} participants max</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleJoinMeeting(meeting.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Video className="w-5 h-5" />
                    Join Meeting
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoomMeetings;

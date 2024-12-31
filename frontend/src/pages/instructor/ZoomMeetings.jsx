import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../../config';

const ZoomClassroom = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const durationRef = useRef(null);
  const descriptionRef = useRef(null);
  const maxParticipantsRef = useRef(null);

  useEffect(() => {
    if (showCreateModal && titleRef.current) {
      titleRef.current.focus();
    }
  }, [showCreateModal]);

  const handleCreateMeeting = (e) => {
    e.preventDefault();
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
        setShowCreateModal(false);
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
      });
  };

  const CreateMeetingModal = () => (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
      showCreateModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className={`bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-out ${
        showCreateModal ? 'scale-100' : 'scale-95 opacity-0'
      }`}>
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
                  name="title"
                  ref={titleRef}
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  ref={dateRef}
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  ref={timeRef}
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  ref={durationRef}
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                  min={30}
                  max={180}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  ref={descriptionRef}
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input
                  type="number"
                  name="maxParticipants"
                  ref={maxParticipantsRef}
                  value={newMeeting.maxParticipants}
                  onChange={(e) => setNewMeeting({ ...newMeeting, maxParticipants: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                  min={10}
                  max={500}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Create Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold text-gray-900">Zoom Classroom</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-all duration-300 transform hover:scale-105"
        >
          Schedule Class
        </button>
      </div>

      {/* Create Meeting Modal */}
      {CreateMeetingModal()}
    </div>
  );
};

export default ZoomClassroom;

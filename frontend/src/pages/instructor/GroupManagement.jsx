import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Users, AlertCircle, Loader2, UserPlus, School, Trash2, Video } from 'lucide-react';
import { groupAPI } from '../../services/api';
import { zoomMeetingAPI } from '../../services/api';
import { useSnackbar } from 'notistack';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

import DashboardLayout from '../../components/layouts/DashboardLayout';

const GroupManagement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    groupName: '',
    instructorId: '',
    studentIds: ''
  });
  const [meetingFormData, setMeetingFormData] = useState({
    topic: '',
    startTime: '',
    duration: 60,
    agenda: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await groupAPI.getAllGroups();
        setGroups(response.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError(error.response?.data?.message || 'Error fetching groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleInputChange = (e, isGroupForm = true) => {
    const { name, value } = e.target;
    if (isGroupForm) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setMeetingFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      
      await groupAPI.createGroup({
        name: formData.groupName,
        instructorId: formData.instructorId,
        studentIds: formData.studentIds.split(',').map(id => id.trim()).filter(Boolean)
      });
      const response = await groupAPI.getAllGroups();
      setGroups(response.groups);
      setFormData({
        groupName: '',
        instructorId: '',
        studentIds: ''
      });
      setShowForm(false);
      enqueueSnackbar('Group created successfully', { variant: 'success' });
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating group');
      console.error('Error creating group:', error);
      enqueueSnackbar('Failed to create group', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createGroupMeeting = async (e, groupId) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      const meetingResponse = await zoomMeetingAPI.createGroupMeeting(groupId, {
        topic: meetingFormData.topic,
        startTime: meetingFormData.startTime,
        duration: meetingFormData.duration,
        agenda: meetingFormData.agenda
      });

      enqueueSnackbar('Zoom meeting created successfully', { variant: 'success' });
      setShowMeetingForm(false);
      setMeetingFormData({
        topic: '',
        startTime: '',
        duration: 60,
        agenda: ''
      });
    } catch (error) {
      console.error('Error creating group meeting:', error);
      setError(error.response?.data?.message || 'Error creating Zoom meeting');
      enqueueSnackbar('Failed to create Zoom meeting', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderGroupMeetingForm = (group) => (
    <div className="bg-white rounded-2xl shadow-xl mb-8 transition-all duration-200 ease-in-out transform hover:shadow-2xl">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Zoom Meeting for {group.name}</h2>
        <form onSubmit={(e) => createGroupMeeting(e, group._id)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Topic
              </label>
              <input
                type="text"
                name="topic"
                value={meetingFormData.topic}
                onChange={(e) => handleInputChange(e, false)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                placeholder="Enter meeting topic"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={meetingFormData.startTime}
                onChange={(e) => handleInputChange(e, false)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Agenda
            </label>
            <textarea
              name="agenda"
              value={meetingFormData.agenda}
              onChange={(e) => handleInputChange(e, false)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
              placeholder="Enter meeting agenda"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={meetingFormData.duration}
              onChange={(e) => handleInputChange(e, false)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
              min="15"
              max="240"
              required
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowMeetingForm(false)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  <span>Create Zoom Meeting</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-blue-600 font-medium">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Group Management
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {showForm ? (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Hide Form</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>New Group</span>
              </>
            )}
          </button>
        </div>

        {/* Create Group Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl mb-8 transition-all duration-200 ease-in-out transform hover:shadow-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Group</h2>
              <form onSubmit={createGroup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      name="groupName"
                      value={formData.groupName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                      placeholder="Enter group name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor ID
                    </label>
                    <input
                      type="text"
                      name="instructorId"
                      value={formData.instructorId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                      placeholder="Enter instructor ID"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student IDs
                  </label>
                  <textarea
                    name="studentIds"
                    value={formData.studentIds}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    placeholder="Enter comma-separated student IDs"
                    rows="3"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5" />
                        <span>Create Group</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Groups List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{group.name}</h3>
                <button
                  onClick={() => {
                    setSelectedGroup(group);
                    setShowMeetingForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Create Zoom Meeting"
                >
                  <Video className="w-6 h-6" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <p>Students: {group.studentIds?.length || 0}</p>
                <p>Instructor ID: {group.instructorId}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Zoom Meeting Form */}
        {showMeetingForm && selectedGroup && renderGroupMeetingForm(selectedGroup)}
      </div>
    </div>
  );
};

export default GroupManagement;
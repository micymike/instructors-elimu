import { api } from './api';

const BASE_URL = '/instructor/zoom/meetings';

// Constants for meeting status
export const MEETING_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

const VirtualClassService = {
  getAllClasses: async () => {
    try {
      console.log('Fetching all virtual classes...');
      const response = await api.get(BASE_URL);
      console.log('Virtual classes API response:', response);
      console.log('Virtual classes data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching virtual classes:', error);
      throw error;
    }
  },

  getClassDetails: async (classId) => {
    const response = await api.get(`${BASE_URL}/${classId}`);
    return response.data;
  },

  createClass: async (classData) => {
    const response = await api.post(BASE_URL, classData);
    return response.data;
  },

  updateClass: async (classId, classData) => {
    const response = await api.patch(`${BASE_URL}/${classId}`, classData);
    return response.data;
  },

  deleteClass: async (classId) => {
    const response = await api.delete(`${BASE_URL}/${classId}`);
    return response.data;
  },

  createGroupClass: async (groupId, classData) => {
    const response = await api.post(`${BASE_URL}/group/${groupId}`, classData);
    return response.data;
  },

  joinClass: async (meetingId) => {
    try {
      if (!meetingId) {
        throw new Error('Meeting ID is required');
      }

      // First get the meeting details to ensure we have the join URL
      const response = await api.get(`${BASE_URL}/${meetingId}`);
      if (!response.data) {
        throw new Error('No meeting details found');
      }

      // Return the meeting details with join URL
      return {
        ...response.data,
        join_url: response.data.join_url || response.data.joinUrl || response.data.start_url
      };
    } catch (error) {
      console.error('Error joining class:', error);
      throw error;
    }
  },

  getMeetingLink: async (classId) => {
    try {
      if (!classId) {
        throw new Error('Meeting ID is required');
      }

      const response = await api.get(`${BASE_URL}/${classId}`);
      if (!response.data) {
        throw new Error('No meeting details found');
      }
      
      // Transform the response to include all meeting details and ensure join URL is available
      const meetingDetails = {
        ...response.data,
        id: response.data.id || classId, // Ensure we have the Zoom meeting ID
        join_url: response.data.join_url || response.data.joinUrl || response.data.start_url,
        status: response.data.status || 'scheduled',
        settings: {
          ...response.data.settings,
          participants: response.data.settings?.participants || 100
        }
      };
      
      return meetingDetails;
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      throw error;
    }
  }
};

export default VirtualClassService;

import { api } from './api';

const BASE_URL = '/zoom/meetings';

const ZoomService = {
  getAllMeetings: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  getMeetingDetails: async (meetingId) => {
    const response = await api.get(`${BASE_URL}/${meetingId}`);
    return response.data;
  },

  createMeeting: async (meetingData) => {
    const response = await api.post(BASE_URL, meetingData);
    return response.data;
  },

  updateMeeting: async (meetingId, meetingData) => {
    const response = await api.patch(`${BASE_URL}/${meetingId}`, meetingData);
    return response.data;
  },

  deleteMeeting: async (meetingId) => {
    const response = await api.delete(`${BASE_URL}/${meetingId}`);
    return response.data;
  },

  createGroupMeeting: async (groupId, meetingData) => {
    const response = await api.post(`${BASE_URL}/group/${groupId}`, meetingData);
    return response.data;
  }
};

export default ZoomService;

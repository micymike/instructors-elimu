import { zoomAPI } from './api';

export const ZoomService = {
  createMeeting: async (data) => {
    return zoomAPI.createMeeting(data);
  },

  getMeeting: async (meetingId) => {
    return zoomAPI.getMeetingDetails(meetingId);
  },

  updateMeeting: async (meetingId, data) => {
    return zoomAPI.updateMeeting(meetingId, data);
  },

  deleteMeeting: async (meetingId) => {
    return zoomAPI.deleteMeeting(meetingId);
  },

  createGroupMeeting: async (groupId, data) => {
    return zoomAPI.createGroupMeeting(groupId, data);
  },

  getAllMeetings: async () => {
    return zoomAPI.getAllMeetings();
  }
};

export default ZoomService;

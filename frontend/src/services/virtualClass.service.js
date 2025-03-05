import { api } from './api';

const BASE_URL = '/zoom/meetings';

const VirtualClassService = {
  getAllClasses: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
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
  }
};

export default VirtualClassService;
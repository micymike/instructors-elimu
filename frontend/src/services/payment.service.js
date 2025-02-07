import axios from 'axios';
import { API_URL } from '../config';

const PaymentService = {
  // Get instructor earnings
  getEarnings: async (instructorId) => {
    const response = await axios.get(`${API_URL}/payments/earnings/${instructorId}`);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (instructorId) => {
    const response = await axios.get(`${API_URL}/payments/history/${instructorId}`);
    return response.data;
  },

  // Request withdrawal
  requestWithdrawal: async (instructorId, amount) => {
    const response = await axios.post(`${API_URL}/payments/withdraw`, {
      instructorId,
      amount
    });
    return response.data;
  },

  // Get revenue metrics
  getRevenueMetrics: async (instructorId) => {
    const response = await axios.get(`${API_URL}/payments/metrics/${instructorId}`);
    return response.data;
  }
};

export default PaymentService;

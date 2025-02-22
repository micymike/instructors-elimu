import { instructorSettingsAPI } from './api';

export const PaymentService = {
  simulateCourseSale: async (data) => {
    // This would need a proper API mapping in api.js if needed
    return instructorSettingsAPI.withdrawFunds(data.amount, data.phoneNumber);
  },

  withdrawFunds: async (data) => {
    return instructorSettingsAPI.withdrawFunds(data.amount, data.phoneNumber);
  },

  getTransactions: async () => {
    return instructorSettingsAPI.getWithdrawalStatus();
  },

  getAccountBalance: async () => {
    return instructorSettingsAPI.getDashboardStats();
  }
};

export default PaymentService;

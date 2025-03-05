import React, { useState, useEffect } from 'react';
import PaymentService from '../../services/payment.service';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const Payments = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        PaymentService.getAccountBalance(),
        PaymentService.getTransactions()
      ]);
      
      // Handle dashboard stats response which includes earnings/balance
      const dashboardStats = balanceRes.data;
      setBalance(dashboardStats.totalEarnings || dashboardStats.earnings || 0);
      
      // Handle transactions response
      const transactionsList = Array.isArray(transactionsRes.data) 
        ? transactionsRes.data 
        : transactionsRes.data.transactions || [];
      setTransactions(transactionsList);
    } catch (err) {
      setError('Failed to load payment data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setWithdrawing(true);

    try {
      if (parseFloat(withdrawAmount) > balance) {
        throw new Error('Insufficient balance');
      }
      
      await PaymentService.withdrawFunds({
        amount: parseFloat(withdrawAmount),
        phoneNumber
      });
      
      // Refresh data after withdrawal
      await fetchData();
      setWithdrawAmount('');
      setPhoneNumber('');
    } catch (err) {
      setError(err.message || 'Withdrawal failed');
      console.error(err);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Balance Card */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">Account Balance</h2>
        <p className="text-3xl font-semibold text-green-600">
          KES {balance.toLocaleString()}
        </p>
      </Card>

      {/* Withdrawal Form */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Withdraw Funds</h2>
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount (KES)
            </label>
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min="0"
              max={balance}
              required
              placeholder="Enter amount"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              M-Pesa Phone Number
            </label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              pattern="^254[0-9]{9}$"
              placeholder="254XXXXXXXXX"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Format: 254XXXXXXXXX</p>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={withdrawing || !balance || !withdrawAmount || !phoneNumber}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {withdrawing ? 'Processing...' : 'Withdraw to M-Pesa'}
          </button>
        </form>
      </Card>

      {/* Transactions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">Amount</th>
                <th className="text-right py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id || tx.id} className="border-b">
                  <td className="py-2">
                    {new Date(tx.timestamp || tx.date || tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 capitalize">{tx.type || tx.transactionType}</td>
                  <td className="py-2 text-right">
                    KES {(tx.amount || tx.transactionAmount || 0).toLocaleString()}
                  </td>
                  <td className={`py-2 text-right ${
                    tx.status === 'COMPLETED' ? 'text-green-600' : 
                    tx.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {tx.status || 'PENDING'}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Payments;

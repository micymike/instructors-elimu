import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PaymentsDashboard = () => {
  // Sample data - replace with actual API calls
  const paymentData = {
    revenueHistory: [
      { month: 'Jan', revenue: 2500 },
      { month: 'Feb', revenue: 3200 },
      { month: 'Mar', revenue: 4000 },
      { month: 'Apr', revenue: 3800 },
      { month: 'May', revenue: 4500 },
    ],
    revenueSplit: [
      { name: 'Instructor Share (60%)', value: 60 },
      { name: 'Platform Share (40%)', value: 40 },
    ],
    recentTransactions: [
      { id: 1, date: '2025-02-01', amount: 500, type: 'Course Purchase', status: 'Completed' },
      { id: 2, date: '2025-02-02', amount: 750, type: 'Course Purchase', status: 'Completed' },
      { id: 3, date: '2025-02-03', amount: 1000, type: 'Withdrawal', status: 'Processing' },
    ],
  };

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payments Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">$18,000</Typography>
              <Typography variant="body2" color="textSecondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Your Share (60%)
              </Typography>
              <Typography variant="h4">$10,800</Typography>
              <Typography variant="body2" color="textSecondary">
                Available for withdrawal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Platform Share (40%)
              </Typography>
              <Typography variant="h4">$7,200</Typography>
              <Typography variant="body2" color="textSecondary">
                Platform fees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Withdrawals
              </Typography>
              <Typography variant="h4">$1,000</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                href="/instructor/payments/withdrawals"
              >
                Withdraw
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue History
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentData.revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Split
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData.revenueSplit}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.revenueSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentData.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell align="right">${transaction.amount}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentsDashboard;

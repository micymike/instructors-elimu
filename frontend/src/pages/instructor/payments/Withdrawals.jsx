import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';

const Withdrawals = () => {
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual API calls
  const withdrawalData = {
    availableBalance: 10800,
    pendingWithdrawals: 1000,
    withdrawalHistory: [
      {
        id: 1,
        date: '2025-02-01',
        amount: 2500,
        status: 'Completed',
        method: 'Bank Transfer'
      },
      {
        id: 2,
        date: '2025-02-02',
        amount: 1800,
        status: 'Processing',
        method: 'PayPal'
      },
      {
        id: 3,
        date: '2025-02-03',
        amount: 3000,
        status: 'Completed',
        method: 'Bank Transfer'
      },
    ]
  };

  const handleWithdraw = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setOpenWithdrawDialog(false);
    // Reset form
    setWithdrawAmount('');
    setPaymentMethod('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Withdrawals
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available for Withdrawal
              </Typography>
              <Typography variant="h4">${withdrawalData.availableBalance}</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setOpenWithdrawDialog(true)}
              >
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Withdrawals
              </Typography>
              <Typography variant="h4">${withdrawalData.pendingWithdrawals}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Processing time: 2-3 business days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Withdrawn (This Month)
              </Typography>
              <Typography variant="h4">$7,300</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Next payout date: 15th Feb 2025
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Withdrawal History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawalData.withdrawalHistory.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>{withdrawal.date}</TableCell>
                      <TableCell>{withdrawal.method}</TableCell>
                      <TableCell align="right">${withdrawal.amount}</TableCell>
                      <TableCell>{withdrawal.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Withdrawal Dialog */}
      <Dialog open={openWithdrawDialog} onClose={() => setOpenWithdrawDialog(false)}>
        <DialogTitle>Request Withdrawal</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Typography>$</Typography>,
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                label="Payment Method"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="bank">Bank Transfer</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="stripe">Stripe</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWithdrawDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleWithdraw}
            disabled={!withdrawAmount || !paymentMethod || loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Withdrawals;

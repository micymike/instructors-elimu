import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import { Download, FilterList } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PaymentHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactionType, setTransactionType] = useState('all');

  // Sample data - replace with actual API calls
  const transactions = [
    {
      id: 1,
      date: '2025-02-01',
      description: 'Course Purchase - Advanced Web Development',
      type: 'income',
      amount: 500,
      status: 'completed',
      student: 'John Doe'
    },
    {
      id: 2,
      date: '2025-02-02',
      description: 'Withdrawal to Bank Account',
      type: 'withdrawal',
      amount: -2500,
      status: 'completed',
      reference: 'WD12345'
    },
    {
      id: 3,
      date: '2025-02-03',
      description: 'Course Purchase - React Masterclass',
      type: 'income',
      amount: 750,
      status: 'completed',
      student: 'Jane Smith'
    },
    // Add more sample transactions
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    // Implement CSV export functionality
    console.log('Exporting transactions...');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment History
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Income (This Month)
              </Typography>
              <Typography variant="h4">$8,250</Typography>
              <Typography variant="body2" color="textSecondary">
                From 15 course purchases
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Withdrawals
              </Typography>
              <Typography variant="h4">$5,000</Typography>
              <Typography variant="body2" color="textSecondary">
                3 withdrawals this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Platform Fees
              </Typography>
              <Typography variant="h4">$3,300</Typography>
              <Typography variant="body2" color="textSecondary">
                40% of total income
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={transactionType}
                  label="Transaction Type"
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <MenuItem value="all">All Transactions</MenuItem>
                  <MenuItem value="income">Income Only</MenuItem>
                  <MenuItem value="withdrawal">Withdrawals Only</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Export to CSV">
                <IconButton onClick={handleExport}>
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reference/Student</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell align="right" sx={{
                          color: transaction.amount > 0 ? 'success.main' : 'error.main'
                        }}>
                          ${Math.abs(transaction.amount)}
                        </TableCell>
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell>
                          {transaction.student || transaction.reference}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentHistory;
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, Typography } from '@mui/material';

const StudentEngagementChart = ({ data, title }) => {
  return (
    <Card className="p-6">
      <Typography variant="h6" className="mb-4">{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="watchTime"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
            name="Watch Time"
          />
          <Area
            type="monotone"
            dataKey="interactionTime"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Interaction Time"
          />
          <Area
            type="monotone"
            dataKey="assignmentTime"
            stackId="1"
            stroke="#ffc658"
            fill="#ffc658"
            name="Assignment Time"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default StudentEngagementChart;

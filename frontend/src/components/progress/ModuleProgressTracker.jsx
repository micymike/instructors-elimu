import React from 'react';
import { Card, Typography, LinearProgress, Box, Tooltip } from '@mui/material';
import { Clock, Book, CheckCircle, AlertCircle } from 'lucide-react';

const ModuleProgressTracker = ({ module }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-500';
      case 'in_progress':
        return 'text-blue-500';
      case 'not_started':
        return 'text-gray-500';
      case 'overdue':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'not_started':
        return <Book className="w-5 h-5 text-gray-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Book className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6">{module.title}</Typography>
        {getStatusIcon(module.status)}
      </div>

      <Box className="mb-4">
        <div className="flex justify-between mb-1">
          <Typography variant="body2" color="textSecondary">
            Progress
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {module.completionPercentage}%
          </Typography>
        </div>
        <Tooltip title={`${module.completionPercentage}% completed`}>
          <LinearProgress
            variant="determinate"
            value={module.completionPercentage}
            className="h-2 rounded"
          />
        </Tooltip>
      </Box>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Typography variant="body2" color="textSecondary">
            Time Spent
          </Typography>
          <Typography variant="body1">
            {module.timeSpent} hrs
          </Typography>
        </div>
        <div>
          <Typography variant="body2" color="textSecondary">
            Grade
          </Typography>
          <Typography variant="body1">
            {module.grade || 'N/A'}
          </Typography>
        </div>
      </div>

      <div className="mt-4">
        <Typography variant="body2" color="textSecondary">
          Last Activity
        </Typography>
        <Typography variant="body2">
          {new Date(module.lastActivity).toLocaleDateString()}
        </Typography>
      </div>
    </Card>
  );
};

export default ModuleProgressTracker;

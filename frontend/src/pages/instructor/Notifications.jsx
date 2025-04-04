import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Divider, 
  IconButton, 
  Tooltip,
  Chip
} from '@mui/material';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
//import { API_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';

// Notification type icons mapping
const NotificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: Bell
};
const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/instructors/notifications`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/instructors/notifications/${notificationId}/read`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/instructors/notifications`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const NotificationItem = ({ notification }) => {
    const Icon = NotificationIcons[notification.type] || Info;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper 
          elevation={notification.read ? 0 : 1} 
          sx={{ 
            mb: 2, 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: notification.read ? 'background.default' : 'background.paper'
          }}
        >
          <Icon 
            size={24} 
            color={
              notification.type === 'success' ? '#4CAF50' :
              notification.type === 'error' ? '#F44336' :
              notification.type === 'warning' ? '#FF9800' :
              '#2196F3'
            } 
            style={{ marginRight: 16 }} 
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {notification.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {notification.message}
            </Typography>
            <Typography variant="caption" color="textTertiary" sx={{ mt: 1, display: 'block' }}>
              {new Date(notification.createdAt).toLocaleString()}
            </Typography>
          </Box>
          
          {!notification.read && (
            <Tooltip title="Mark as Read">
              <IconButton 
                size="small" 
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <X size={20} />
              </IconButton>
            </Tooltip>
          )}
        </Paper>
      </motion.div>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}
      >
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        
        {notifications.length > 0 && (
          <Tooltip title="Clear All Notifications">
            <IconButton onClick={clearAllNotifications}>
              <X size={24} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Typography variant="body1" color="textSecondary" align="center">
          Loading notifications...
        </Typography>
      ) : notifications.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '50vh'
          }}
        >
          <Bell size={64} color="#9E9E9E" />
          <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
            No notifications
          </Typography>
          <Typography variant="body2" color="textTertiary">
            You're all caught up!
          </Typography>
        </Box>
      ) : (
        <AnimatePresence>
          {notifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
            />
          ))}
        </AnimatePresence>
      )}
    </Container>
  );
};

export default NotificationsPage;

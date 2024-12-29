import React, { useEffect, useState } from 'react';
// ...existing imports...

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashboard = () => {
  // ...existing state...

  const fetchCourseStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/api/instructor/course-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }

      const data = await response.json();
      setCourseStats(data);
    } catch (error) {
      console.error('Error fetching course stats:', error);
      setError(error.message);
      if (error.message.includes('token')) {
        // Handle authentication errors
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchCourseStats();
  }, []);

  // ...rest of the component...
};

export default Dashboard;

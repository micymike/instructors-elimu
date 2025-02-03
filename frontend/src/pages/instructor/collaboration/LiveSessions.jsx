import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Add,
  VideoCall,
  People,
  Schedule,
  Edit,
  Delete,
  Link as LinkIcon,
} from '@mui/icons-material';

const LiveSessions = () => {
  const [openNewSession, setOpenNewSession] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [sessionDateTime, setSessionDateTime] = useState(null);

  // Sample data - replace with actual API calls
  const sessions = [
    {
      id: 1,
      title: 'React Hooks Deep Dive',
      course: 'Advanced Web Development',
      datetime: '2025-02-05T14:00:00',
      duration: '2 hours',
      attendees: 15,
      status: 'upcoming',
      meetingLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 2,
      title: 'UI Design Principles',
      course: 'UI/UX Design',
      datetime: '2025-02-06T15:30:00',
      duration: '1.5 hours',
      attendees: 12,
      status: 'upcoming',
      meetingLink: 'https://zoom.us/j/987654321'
    },
    {
      id: 3,
      title: 'Database Optimization Workshop',
      course: 'Database Management',
      datetime: '2025-02-04T10:00:00',
      duration: '2 hours',
      attendees: 18,
      status: 'completed',
      meetingLink: 'https://zoom.us/j/456789123'
    },
  ];

  const courses = [
    'Advanced Web Development',
    'UI/UX Design',
    'Database Management',
    'Mobile Development'
  ];

  const handleCreateSession = () => {
    // Implement session creation logic
    setOpenNewSession(false);
    setSessionTitle('');
    setSessionDescription('');
    setSelectedCourse('');
    setSessionDateTime(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'live':
        return 'error';
      case 'upcoming':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Live Sessions</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenNewSession(true)}
        >
          Schedule Session
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sessions.map((session) => (
          <Grid item xs={12} md={6} lg={4} key={session.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {session.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {session.course}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {formatDateTime(session.datetime)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <People sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {session.attendees} attendees
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinkIcon sx={{ mr: 1 }} />
                    <Typography
                      variant="body2"
                      component="a"
                      href={session.meetingLink}
                      target="_blank"
                      sx={{ textDecoration: 'none' }}
                    >
                      Join Meeting
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={session.status}
                    color={getStatusColor(session.status)}
                    size="small"
                  />
                  <Chip
                    label={session.duration}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<VideoCall />}
                  color="primary"
                  href={session.meetingLink}
                  target="_blank"
                >
                  Join
                </Button>
                <IconButton size="small" onClick={() => {}}>
                  <Edit />
                </IconButton>
                <IconButton size="small" onClick={() => {}}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Session Dialog */}
      <Dialog
        open={openNewSession}
        onClose={() => setOpenNewSession(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule New Session</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Session Title"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
            />
            <TextField
              fullWidth
              label="Session Description"
              multiline
              rows={4}
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={selectedCourse}
                label="Course"
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DateTimePicker
              label="Session Date & Time"
              value={sessionDateTime}
              onChange={setSessionDateTime}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewSession(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateSession}
            disabled={!sessionTitle || !selectedCourse || !sessionDateTime}
          >
            Schedule Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiveSessions;

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  VideoCall as VideoIcon,
  Book as BookIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const sessionTypes = {
  theory: {
    label: 'Theory',
    icon: <BookIcon />,
    color: 'primary',
  },
  practical: {
    label: 'Practical',
    icon: <ScienceIcon />,
    color: 'secondary',
  },
  live: {
    label: 'Live Session',
    icon: <VideoIcon />,
    color: 'success',
  },
};

export default function SchedulePlanner({ data, updateData }) {
  const [sessions, setSessions] = useState(data.schedule || []);
  const [currentSession, setCurrentSession] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSessionAdd = () => {
    setCurrentSession({
      sessionTitle: '',
      date: new Date(),
      duration: 60,
      type: 'theory',
      isRecurring: false,
      recurringPattern: 'weekly',
      numberOfSessions: 1,
      description: '',
      requirements: [],
    });
    setIsDialogOpen(true);
  };

  const handleSessionEdit = (session, index) => {
    setCurrentSession({ ...session, index });
    setIsDialogOpen(true);
  };

  const handleSessionDelete = (index) => {
    const newSessions = sessions.filter((_, i) => i !== index);
    setSessions(newSessions);
    updateData({ ...data, schedule: newSessions });
  };

  const handleSessionSave = () => {
    let newSessions = [...sessions];
    const sessionToSave = { ...currentSession };
    delete sessionToSave.index;

    if (sessionToSave.isRecurring) {
      // Generate recurring sessions
      const recurringDates = generateRecurringDates(
        sessionToSave.date,
        sessionToSave.numberOfSessions,
        sessionToSave.recurringPattern
      );

      recurringDates.forEach((date, i) => {
        const recurringSession = {
          ...sessionToSave,
          date,
          sessionTitle: `${sessionToSave.sessionTitle} (${i + 1}/${recurringDates.length})`,
        };
        if (currentSession.index !== undefined && i === 0) {
          newSessions[currentSession.index] = recurringSession;
        } else {
          newSessions.push(recurringSession);
        }
      });
    } else {
      if (currentSession.index !== undefined) {
        newSessions[currentSession.index] = sessionToSave;
      } else {
        newSessions.push(sessionToSave);
      }
    }

    // Sort sessions by date
    newSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

    setSessions(newSessions);
    updateData({ ...data, schedule: newSessions });
    setIsDialogOpen(false);
  };

  const generateRecurringDates = (startDate, count, pattern) => {
    const dates = [];
    const date = new Date(startDate);

    for (let i = 0; i < count; i++) {
      dates.push(new Date(date));
      switch (pattern) {
        case 'daily':
          date.setDate(date.getDate() + 1);
          break;
        case 'weekly':
          date.setDate(date.getDate() + 7);
          break;
        case 'biweekly':
          date.setDate(date.getDate() + 14);
          break;
        default:
          date.setDate(date.getDate() + 7);
      }
    }

    return dates;
  };

  const SessionDialog = () => (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {currentSession?.index !== undefined ? 'Edit Session' : 'Add New Session'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Session Title"
              value={currentSession?.sessionTitle || ''}
              onChange={(e) =>
                setCurrentSession({ ...currentSession, sessionTitle: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Date & Time"
                value={currentSession?.date || null}
                onChange={(newValue) =>
                  setCurrentSession({ ...currentSession, date: newValue })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={currentSession?.duration || 60}
              onChange={(e) =>
                setCurrentSession({
                  ...currentSession,
                  duration: parseInt(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Session Type</InputLabel>
              <Select
                value={currentSession?.type || 'theory'}
                onChange={(e) =>
                  setCurrentSession({ ...currentSession, type: e.target.value })
                }
                label="Session Type"
              >
                {Object.entries(sessionTypes).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentSession?.isRecurring || false}
                  onChange={(e) =>
                    setCurrentSession({
                      ...currentSession,
                      isRecurring: e.target.checked,
                    })
                  }
                />
              }
              label="Recurring Session"
            />
          </Grid>

          {currentSession?.isRecurring && (
            <>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Recurring Pattern</InputLabel>
                  <Select
                    value={currentSession?.recurringPattern || 'weekly'}
                    onChange={(e) =>
                      setCurrentSession({
                        ...currentSession,
                        recurringPattern: e.target.value,
                      })
                    }
                    label="Recurring Pattern"
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="biweekly">Bi-weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Sessions"
                  type="number"
                  value={currentSession?.numberOfSessions || 1}
                  onChange={(e) =>
                    setCurrentSession({
                      ...currentSession,
                      numberOfSessions: parseInt(e.target.value),
                    })
                  }
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={currentSession?.description || ''}
              onChange={(e) =>
                setCurrentSession({
                  ...currentSession,
                  description: e.target.value,
                })
              }
            />
          </Grid>

          {currentSession?.type === 'practical' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements"
                placeholder="Press Enter to add requirement"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setCurrentSession({
                      ...currentSession,
                      requirements: [
                        ...(currentSession.requirements || []),
                        e.target.value.trim(),
                      ],
                    });
                    e.target.value = '';
                  }
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {currentSession?.requirements?.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    onDelete={() => {
                      const newReqs = currentSession.requirements.filter(
                        (_, i) => i !== index
                      );
                      setCurrentSession({
                        ...currentSession,
                        requirements: newReqs,
                      });
                    }}
                  />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleSessionSave} variant="contained" color="primary">
          Save Session
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Course Schedule
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Plan your course sessions and practical work
        </Typography>
      </Box>

      <AnimatePresence>
        {sessions.map((session, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  {sessionTypes[session.type].icon}
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1">
                    {session.sessionTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(session.date), 'PPpp')} ({session.duration} mins)
                  </Typography>
                </Grid>
                <Grid item>
                  <Chip
                    label={sessionTypes[session.type].label}
                    color={sessionTypes[session.type].color}
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    size="small"
                    onClick={() => handleSessionEdit(session, index)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleSessionDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
              {session.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {session.description}
                </Typography>
              )}
              {session.requirements?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Requirements:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {session.requirements.map((req, i) => (
                      <Chip key={i} label={req} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleSessionAdd}
        >
          Add Session
        </Button>
      </Box>

      {SessionDialog()}
    </motion.div>
  );
}

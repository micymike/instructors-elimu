import React from 'react';
import { 
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import { format } from 'date-fns';

const Preview = ({ courseData }) => {
  const {
    basicInfo,
    syllabus,
    schedule,
    resources,
    assessments
  } = courseData;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Course Preview
      </Typography>

      {/* Basic Info Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Basic Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">Title</Typography>
            <Typography variant="body1" gutterBottom>{basicInfo.title}</Typography>

            <Typography variant="subtitle1" color="text.secondary">Description</Typography>
            <Typography variant="body1" gutterBottom>{basicInfo.description}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
{basicInfo.curriculum && (
  <>
    <Typography variant="subtitle1" color="text.secondary">Curriculum</Typography>
    <Box sx={{ mb: 2 }}>
      <Chip label={basicInfo.curriculum.system} sx={{ mr: 1 }} />
      <Chip label={basicInfo.curriculum.subject} sx={{ mr: 1 }} />
      <Chip label={basicInfo.curriculum.level} />
    </Box>
  </>
)}

            <Typography variant="subtitle1" color="text.secondary">Language</Typography>
            <Typography variant="body1" gutterBottom>{basicInfo.language}</Typography>

            <Typography variant="subtitle1" color="text.secondary">Duration</Typography>
            <Typography variant="body1" gutterBottom>{basicInfo.duration}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Syllabus Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Syllabus</Typography>
        <List>
          {syllabus.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      Week {item.week}: {item.topic}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {item.activities.map((activity, idx) => (
                          <Chip
                            key={idx}
                            label={activity}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </>
                  }
                />
              </ListItem>
              {index < syllabus.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Schedule Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Schedule</Typography>
        <List>
          {schedule.map((session, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={session.sessionTitle}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Date: {format(new Date(session.date), 'PPP')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {session.duration} minutes
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < schedule.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Resources Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Resources</Typography>
        <List>
          {resources.map((resource, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={resource.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Type: {resource.type}
                      </Typography>
                      {resource.description && (
                        <Typography variant="body2" color="text.secondary">
                          {resource.description}
                        </Typography>
                      )}
                      <Typography variant="body2" component="a" href={resource.url} target="_blank" color="primary">
                        Access Resource
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < resources.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Assessments Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Assessments</Typography>
        <List>
          {assessments.map((assessment, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={assessment.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Type: {assessment.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Points: {assessment.totalPoints}
                      </Typography>
                      {assessment.dueDate && (
                        <Typography variant="body2" color="text.secondary">
                          Due Date: {format(new Date(assessment.dueDate), 'PPP')}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Instructions: {assessment.instructions}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < assessments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Preview;

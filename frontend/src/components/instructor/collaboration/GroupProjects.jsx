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
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Drawer,
  Tabs,
  Tab,
  Avatar,
  Divider,
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Group,
  Assignment,
  Schedule,
  Chat,
  AttachFile,
  Send,
  Link as LinkIcon,
  Code,
  GitHub,
  Description,
  Comment,
  CheckCircle,
  Warning,
  Download,
  CloudUpload,
} from '@mui/icons-material';

const GroupProjects = () => {
  const [openNewProject, setOpenNewProject] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [newMessage, setNewMessage] = useState('');

  // Sample data - replace with actual API calls
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      course: 'Advanced Web Development',
      members: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      progress: 75,
      deadline: '2025-02-15',
      status: 'in-progress',
      description: 'Building a full-stack e-commerce platform using React and Node.js',
      repository: 'https://github.com/team/ecommerce-project',
      tasks: [
        { id: 1, title: 'Set up authentication', status: 'completed', assignee: 'John Doe' },
        { id: 2, title: 'Implement shopping cart', status: 'in-progress', assignee: 'Jane Smith' },
        { id: 3, title: 'Design product catalog', status: 'pending', assignee: 'Mike Johnson' }
      ],
      discussions: [
        {
          id: 1,
          author: 'John Doe',
          message: 'I\'ve completed the user authentication module. Please review.',
          timestamp: '2025-02-01T10:30:00',
          attachments: ['auth-documentation.pdf']
        },
        {
          id: 2,
          author: 'Jane Smith',
          message: 'Great work! I\'ll start integrating it with the shopping cart.',
          timestamp: '2025-02-01T11:15:00'
        }
      ],
      files: [
        { name: 'Project Proposal.pdf', type: 'document', size: '2.5MB', uploadedBy: 'John Doe' },
        { name: 'Database Schema.png', type: 'image', size: '1.2MB', uploadedBy: 'Mike Johnson' }
      ]
    },
    {
      id: 2,
      title: 'Mobile App Design',
      course: 'UI/UX Design',
      members: ['Sarah Wilson', 'Tom Brown'],
      progress: 40,
      deadline: '2025-02-20',
      status: 'in-progress',
      description: 'Designing a mobile app for fitness tracking',
      repository: 'https://github.com/team/fitness-app',
      tasks: [
        { id: 1, title: 'Create wireframes', status: 'completed', assignee: 'Sarah Wilson' },
        { id: 2, title: 'Design UI components', status: 'in-progress', assignee: 'Tom Brown' }
      ],
      discussions: [],
      files: []
    },
    {
      id: 3,
      title: 'Database Optimization',
      course: 'Database Management',
      members: ['Alex Lee', 'Emma Davis'],
      progress: 90,
      deadline: '2025-02-10',
      status: 'review',
      description: 'Optimizing database queries for better performance',
      repository: 'https://github.com/team/db-optimization',
      tasks: [
        { id: 1, title: 'Analyze current performance', status: 'completed', assignee: 'Alex Lee' },
        { id: 2, title: 'Implement indexing', status: 'completed', assignee: 'Emma Davis' },
        { id: 3, title: 'Write documentation', status: 'in-progress', assignee: 'Alex Lee' }
      ],
      discussions: [],
      files: []
    },
  ];

  const courses = [
    'Advanced Web Development',
    'UI/UX Design',
    'Database Management',
    'Mobile Development'
  ];

  const handleCreateProject = () => {
    // Implement project creation logic
    setOpenNewProject(false);
    setProjectTitle('');
    setProjectDescription('');
    setSelectedCourse('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'review':
        return 'warning';
      case 'in-progress':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Implement message sending logic
    setNewMessage('');
  };

  const renderProjectDetails = () => {
    if (!selectedProject) return null;

    return (
      <Box sx={{ width: '400px', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{selectedProject.title}</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Delete />
          </IconButton>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Overview" />
          <Tab label="Tasks" />
          <Tab label="Discussion" />
          <Tab label="Files" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>Description</Typography>
            <Typography variant="body2" paragraph>{selectedProject.description}</Typography>

            <Typography variant="subtitle1" gutterBottom>Repository</Typography>
            <Button
              startIcon={<GitHub />}
              variant="outlined"
              size="small"
              href={selectedProject.repository}
              target="_blank"
              sx={{ mb: 2 }}
            >
              View Repository
            </Button>

            <Typography variant="subtitle1" gutterBottom>Team Members</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {selectedProject.members.map((member, index) => (
                <Chip
                  key={index}
                  label={member}
                  size="small"
                  icon={<Group />}
                />
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom>Progress</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={selectedProject.progress} />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {selectedProject.progress}%
              </Typography>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <List>
            {selectedProject.tasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemText
                  primary={task.title}
                  secondary={`Assigned to: ${task.assignee}`}
                />
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        )}

        {activeTab === 2 && (
          <Box>
            <Box sx={{ height: '400px', overflowY: 'auto', mb: 2 }}>
              {selectedProject.discussions.map((discussion) => (
                <Box key={discussion.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{discussion.author[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle2">{discussion.author}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(discussion.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 5 }}>{discussion.message}</Typography>
                  {discussion.attachments && discussion.attachments.length > 0 && (
                    <Box sx={{ ml: 5, mt: 1 }}>
                      {discussion.attachments.map((attachment, index) => (
                        <Chip
                          key={index}
                          label={attachment}
                          size="small"
                          icon={<AttachFile />}
                          sx={{ mr: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton color="primary" onClick={handleSendMessage}>
                <Send />
              </IconButton>
            </Box>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            {selectedProject.files.length > 0 ? (
              <List>
                {selectedProject.files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={file.name}
                      secondary={`Uploaded by ${file.uploadedBy} • ${file.size}`}
                    />
                    <IconButton size="small">
                      <Download />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Files Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Upload project files to share with the team
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={() => {
                    // Implement file upload logic
                  }}
                >
                  Upload File
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Group Projects</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenNewProject(true)}
        >
          Create Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card onClick={() => handleProjectClick(project)} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {project.course}
                </Typography>
                
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="textSecondary">
                        {project.progress}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Team Members
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {project.members.map((member, index) => (
                      <Chip
                        key={index}
                        label={member}
                        size="small"
                        icon={<Group />}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Deadline: {project.deadline}
                  </Typography>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Tooltip title="View Tasks">
                  <IconButton size="small">
                    <Badge badgeContent={project.tasks.length} color="primary">
                      <Assignment />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Discussions">
                  <IconButton size="small">
                    <Badge badgeContent={project.discussions.length} color="primary">
                      <Chat />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Files">
                  <IconButton size="small">
                    <Badge badgeContent={project.files.length} color="primary">
                      <Description />
                    </Badge>
                  </IconButton>
                </Tooltip>
                {project.repository && (
                  <Tooltip title="View Repository">
                    <IconButton size="small" href={project.repository} target="_blank">
                      <GitHub />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openNewProject} onClose={() => setOpenNewProject(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewProject(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {renderProjectDetails()}
      </Drawer>
    </Box>
  );
};

export default GroupProjects;
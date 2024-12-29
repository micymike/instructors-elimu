import React, { useState, useCallback } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Link as LinkIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon,
  Science as ScienceIcon,
  Description as FileIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const resourceTypes = {
  textbook: {
    label: 'Textbook',
    icon: <BookIcon />,
    color: 'primary',
    acceptedFiles: '.pdf,.doc,.docx',
  },
  video: {
    label: 'Video',
    icon: <VideoIcon />,
    color: 'secondary',
    acceptedFiles: '.mp4,.mov,.avi',
  },
  document: {
    label: 'Document',
    icon: <FileIcon />,
    color: 'info',
    acceptedFiles: '.pdf,.doc,.docx,.ppt,.pptx',
  },
  labMaterial: {
    label: 'Lab Material',
    icon: <ScienceIcon />,
    color: 'warning',
    acceptedFiles: '.pdf,.doc,.docx',
  },
  link: {
    label: 'External Link',
    icon: <LinkIcon />,
    color: 'success',
    acceptedFiles: null,
  },
};

export default function ResourceManager({ data, updateData }) {
  const [resources, setResources] = useState(data.resources || []);
  const [currentResource, setCurrentResource] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('File reading was aborted');
      reader.onerror = () => console.log('File reading has failed');
      reader.onload = () => {
        // Here you would typically upload to your server
        // For now, we'll simulate upload progress
        simulateFileUpload(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.values(resourceTypes)
      .map((type) => type.acceptedFiles)
      .filter(Boolean)
      .join(','),
  });

  const simulateFileUpload = (file) => {
    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = (prev[file.name] || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Add the file as a resource
          const newResource = {
            title: file.name,
            type: getResourceTypeFromFile(file),
            url: URL.createObjectURL(file), // In production, this would be the uploaded file URL
            size: file.size,
            uploadDate: new Date().toISOString(),
            description: '',
          };
          setResources((prev) => [...prev, newResource]);
          updateData({ ...data, resources: [...resources, newResource] });
          return prev;
        }
        return { ...prev, [file.name]: newProgress };
      });
    }, 500);
  };

  const getResourceTypeFromFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'avi'].includes(extension)) return 'video';
    if (['pdf', 'doc', 'docx'].includes(extension)) return 'document';
    return 'document';
  };

  const handleResourceAdd = () => {
    setCurrentResource({
      title: '',
      type: 'document',
      url: '',
      description: '',
      requirements: [],
    });
    setIsDialogOpen(true);
  };

  const handleResourceEdit = (resource, index) => {
    setCurrentResource({ ...resource, index });
    setIsDialogOpen(true);
  };

  const handleResourceDelete = (index) => {
    const newResources = resources.filter((_, i) => i !== index);
    setResources(newResources);
    updateData({ ...data, resources: newResources });
  };

  const handleResourceSave = () => {
    const newResources = [...resources];
    if (currentResource.index !== undefined) {
      newResources[currentResource.index] = { ...currentResource };
      delete newResources[currentResource.index].index;
    } else {
      newResources.push({ ...currentResource });
    }
    setResources(newResources);
    updateData({ ...data, resources: newResources });
    setIsDialogOpen(false);
  };

  const ResourceDialog = () => (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {currentResource?.index !== undefined ? 'Edit Resource' : 'Add New Resource'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Resource Title"
              value={currentResource?.title || ''}
              onChange={(e) =>
                setCurrentResource({ ...currentResource, title: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Resource Type</InputLabel>
              <Select
                value={currentResource?.type || 'document'}
                onChange={(e) =>
                  setCurrentResource({ ...currentResource, type: e.target.value })
                }
                label="Resource Type"
              >
                {Object.entries(resourceTypes).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={currentResource?.type === 'link' ? 'URL' : 'File Path'}
              value={currentResource?.url || ''}
              onChange={(e) =>
                setCurrentResource({ ...currentResource, url: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={currentResource?.description || ''}
              onChange={(e) =>
                setCurrentResource({
                  ...currentResource,
                  description: e.target.value,
                })
              }
            />
          </Grid>

          {currentResource?.type === 'labMaterial' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements"
                placeholder="Press Enter to add requirement"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setCurrentResource({
                      ...currentResource,
                      requirements: [
                        ...(currentResource.requirements || []),
                        e.target.value.trim(),
                      ],
                    });
                    e.target.value = '';
                  }
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {currentResource?.requirements?.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    onDelete={() => {
                      const newReqs = currentResource.requirements.filter(
                        (_, i) => i !== index
                      );
                      setCurrentResource({
                        ...currentResource,
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
        <Button onClick={handleResourceSave} variant="contained" color="primary">
          Save Resource
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
          Course Resources
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Upload and manage course materials
        </Typography>
      </Box>

      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          mb: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <UploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant="body1" align="center">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag and drop files here, or click to select files'}
          </Typography>
        </Box>
      </Paper>

      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <Box key={fileName} sx={{ mb: 2 }}>
          <Typography variant="body2">{fileName}</Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      ))}

      <AnimatePresence>
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  {resourceTypes[resource.type]?.icon}
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1">{resource.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {resource.description}
                  </Typography>
                </Grid>
                <Grid item>
                  <Chip
                    label={resourceTypes[resource.type]?.label}
                    color={resourceTypes[resource.type]?.color}
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    size="small"
                    onClick={() => handleResourceEdit(resource, index)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleResourceDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
              {resource.requirements?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Requirements:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {resource.requirements.map((req, i) => (
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
          onClick={handleResourceAdd}
        >
          Add Resource
        </Button>
      </Box>

      {ResourceDialog()}
    </motion.div>
  );
}

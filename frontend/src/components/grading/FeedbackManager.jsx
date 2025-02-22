import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Card,
  Box,
  Chip,
  Tooltip,
  Alert,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Tag,
  Copy,
  MoreVertical,
  MessageCircle
} from 'lucide-react';

const VARIABLE_TAGS = [
  { tag: '{studentName}', description: 'Student\'s full name' },
  { tag: '{score}', description: 'Current grade' },
  { tag: '{maxScore}', description: 'Maximum possible score' },
  { tag: '{percentage}', description: 'Score as percentage' },
  { tag: '{courseName}', description: 'Name of the course' },
  { tag: '{assignmentName}', description: 'Name of the assignment' },
  { tag: '{dueDate}', description: 'Assignment due date' },
  { tag: '{submissionDate}', description: 'Date of submission' },
  { tag: '{lateDays}', description: 'Number of days late' }
];

const FeedbackManager = ({ open, onClose, onInsertTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    // Load templates from localStorage or API
    const savedTemplates = localStorage.getItem('feedbackTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const saveTemplates = (newTemplates) => {
    localStorage.setItem('feedbackTemplates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const handleAddTemplate = () => {
    setEditingTemplate({
      id: Date.now(),
      name: '',
      category: '',
      content: '',
      variables: []
    });
    setShowTemplateDialog(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowTemplateDialog(true);
    setAnchorEl(null);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate.name || !editingTemplate.content) {
      return;
    }

    const newTemplates = editingTemplate.id
      ? templates.map(t => t.id === editingTemplate.id ? editingTemplate : t)
      : [...templates, editingTemplate];

    saveTemplates(newTemplates);
    setShowTemplateDialog(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId) => {
    const newTemplates = templates.filter(t => t.id !== templateId);
    saveTemplates(newTemplates);
    setAnchorEl(null);
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`
    };
    saveTemplates([...templates, newTemplate]);
    setAnchorEl(null);
  };

  const handleInsertVariable = (variable) => {
    if (!editingTemplate) return;

    const cursorPosition = document.getElementById('template-content').selectionStart;
    const content = editingTemplate.content;
    const newContent = 
      content.substring(0, cursorPosition) + 
      variable.tag + 
      content.substring(cursorPosition);

    setEditingTemplate({
      ...editingTemplate,
      content: newContent,
      variables: [...new Set([...editingTemplate.variables, variable.tag])]
    });
  };

  const renderTemplateEditor = () => (
    <Dialog 
      open={showTemplateDialog} 
      onClose={() => setShowTemplateDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className="flex justify-between items-center">
        {editingTemplate?.id ? 'Edit Template' : 'New Template'}
        <IconButton onClick={() => setShowTemplateDialog(false)}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4">
          <TextField
            fullWidth
            label="Template Name"
            value={editingTemplate?.name || ''}
            onChange={(e) => setEditingTemplate(prev => ({
              ...prev,
              name: e.target.value
            }))}
            className="mb-4"
          />

          <TextField
            fullWidth
            label="Category"
            value={editingTemplate?.category || ''}
            onChange={(e) => setEditingTemplate(prev => ({
              ...prev,
              category: e.target.value
            }))}
            className="mb-4"
          />

          <div className="mb-4">
            <Typography variant="subtitle2" className="mb-2">
              Available Variables
            </Typography>
            <div className="flex flex-wrap gap-2">
              {VARIABLE_TAGS.map((variable, index) => (
                <Tooltip key={index} title={variable.description}>
                  <Chip
                    label={variable.tag}
                    onClick={() => handleInsertVariable(variable)}
                    icon={<Tag className="w-4 h-4" />}
                    className="cursor-pointer"
                  />
                </Tooltip>
              ))}
            </div>
          </div>

          <TextField
            id="template-content"
            fullWidth
            multiline
            rows={8}
            label="Template Content"
            value={editingTemplate?.content || ''}
            onChange={(e) => setEditingTemplate(prev => ({
              ...prev,
              content: e.target.value
            }))}
            className="mb-4"
          />

          <Alert severity="info" className="mb-4">
            Use the variables above to make your template dynamic. They will be replaced with actual values when the template is used.
          </Alert>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveTemplate}
          disabled={!editingTemplate?.name || !editingTemplate?.content}
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        Feedback Templates
        <IconButton onClick={onClose}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="mb-4 flex justify-between items-center">
          <Typography variant="body2" color="textSecondary">
            Create and manage feedback templates to save time when grading
          </Typography>
          <Button
            startIcon={<Plus />}
            variant="contained"
            onClick={handleAddTemplate}
          >
            New Template
          </Button>
        </div>

        <div className="space-y-3">
          {templates.map(template => (
            <Card key={template.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="subtitle1" className="font-medium">
                    {template.name}
                  </Typography>
                  {template.category && (
                    <Chip
                      size="small"
                      label={template.category}
                      className="mt-1"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onInsertTemplate(template)}
                  >
                    Use Template
                  </Button>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedTemplate(template);
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>
              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-2 line-clamp-2"
              >
                {template.content}
              </Typography>
              {template.variables.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.variables.map((variable, index) => (
                    <Chip
                      key={index}
                      label={variable}
                      size="small"
                      variant="outlined"
                      className="text-xs"
                    />
                  ))}
                </div>
              )}
            </Card>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <Typography variant="subtitle1" color="textSecondary">
                No templates yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create your first feedback template to get started
              </Typography>
            </div>
          )}
        </div>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleEditTemplate(selectedTemplate)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDuplicateTemplate(selectedTemplate)}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </MenuItem>
          <MenuItem
            onClick={() => handleDeleteTemplate(selectedTemplate.id)}
            className="text-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </MenuItem>
        </Menu>
      </DialogContent>

      {renderTemplateEditor()}
    </Dialog>
  );
};

export default FeedbackManager;

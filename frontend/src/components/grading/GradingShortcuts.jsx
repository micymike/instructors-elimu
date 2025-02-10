import React, { useState } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  Keyboard,
  Star,
  Clock,
  Copy,
  Bookmark,
  Flag,
  MessageSquare,
  Settings,
  Award
} from 'lucide-react';

const KEYBOARD_SHORTCUTS = [
  { key: 'Alt + N', description: 'Next submission' },
  { key: 'Alt + P', description: 'Previous submission' },
  { key: 'Alt + S', description: 'Save grade' },
  { key: 'Alt + F', description: 'Focus feedback' },
  { key: 'Alt + R', description: 'Open rubric' },
  { key: 'Alt + T', description: 'Open templates' },
  { key: 'Alt + C', description: 'Add comment' },
  { key: '1-9', description: 'Quick grade (10-90)' },
  { key: '0', description: 'Grade 100' }
];

const QUICK_GRADES = [
  { label: 'Perfect', score: 100, color: '#4CAF50' },
  { label: 'Excellent', score: 90, color: '#8BC34A' },
  { label: 'Very Good', score: 80, color: '#CDDC39' },
  { label: 'Good', score: 70, color: '#FFEB3B' },
  { label: 'Fair', score: 60, color: '#FFC107' },
  { label: 'Poor', score: 50, color: '#FF9800' },
  { label: 'Very Poor', score: 40, color: '#FF5722' },
  { label: 'Incomplete', score: 0, color: '#F44336' }
];

const GradingShortcuts = ({ 
  onQuickGrade,
  onNextSubmission,
  onPreviousSubmission,
  onSaveGrade,
  onAddComment,
  onOpenRubric,
  onOpenTemplates
}) => {
  const [open, setOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [customGrade, setCustomGrade] = useState('');

  const handleKeyDown = (event) => {
    // Implement keyboard shortcuts
    if (event.altKey) {
      switch (event.key.toLowerCase()) {
        case 'n':
          onNextSubmission();
          break;
        case 'p':
          onPreviousSubmission();
          break;
        case 's':
          onSaveGrade();
          break;
        case 'r':
          onOpenRubric();
          break;
        case 't':
          onOpenTemplates();
          break;
        case 'c':
          onAddComment();
          break;
        default:
          break;
      }
    } else if (!isNaN(event.key)) {
      const num = parseInt(event.key);
      if (num === 0) {
        onQuickGrade(100);
      } else if (num >= 1 && num <= 9) {
        onQuickGrade(num * 10);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actions = [
    { icon: <Keyboard />, name: 'Shortcuts', onClick: () => setShowShortcuts(true) },
    { icon: <Star />, name: 'Quick Grade', onClick: () => setOpen(true) },
    { icon: <Clock />, name: 'Recent Grades', onClick: () => {} },
    { icon: <Copy />, name: 'Copy Last Grade', onClick: () => {} },
    { icon: <Bookmark />, name: 'Save Draft', onClick: () => {} },
    { icon: <Flag />, name: 'Flag for Review', onClick: () => {} }
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="Grading Shortcuts"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        FabProps={{
          sx: {
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Quick Grade</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {QUICK_GRADES.map((grade) => (
              <Button
                key={grade.score}
                variant="outlined"
                onClick={() => {
                  onQuickGrade(grade.score);
                  setOpen(false);
                }}
                style={{ borderColor: grade.color, color: grade.color }}
              >
                {grade.label} ({grade.score}%)
              </Button>
            ))}
          </div>
          <TextField
            fullWidth
            label="Custom Grade"
            type="number"
            value={customGrade}
            onChange={(e) => setCustomGrade(e.target.value)}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (customGrade) {
                onQuickGrade(parseInt(customGrade));
                setOpen(false);
              }
            }}
            disabled={!customGrade}
          >
            Apply Grade
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4">
            {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Chip label={shortcut.key} variant="outlined" />
                <Typography variant="body2">
                  {shortcut.description}
                </Typography>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShortcuts(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GradingShortcuts;

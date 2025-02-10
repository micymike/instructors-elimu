import React, { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  TextField,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import {
  MessageSquare,
  Highlighter,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Share2
} from 'lucide-react';

const SubmissionViewer = ({ submission, onAddComment, onAddAnnotation }) => {
  const [selectedText, setSelectedText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [comment, setComment] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [comments, setComments] = useState([]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setAnchorEl({ left: rect.left, top: rect.bottom });
    }
  };

  const handleAddAnnotation = (type) => {
    if (selectedText) {
      const newAnnotation = {
        id: Date.now(),
        text: selectedText,
        type,
        timestamp: new Date().toISOString()
      };
      setAnnotations([...annotations, newAnnotation]);
      setSelectedText('');
      setAnchorEl(null);
    }
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        timestamp: new Date().toISOString()
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const renderFilePreview = () => {
    // Add support for different file types (PDF, code, images, etc.)
    return (
      <div 
        className="bg-gray-50 p-4 rounded-lg min-h-[400px]"
        onMouseUp={handleTextSelection}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Typography variant="subtitle1">
              {submission.fileName}
            </Typography>
            <Chip 
              size="small" 
              label={submission.fileType} 
              className="bg-blue-100"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip title="View Full Screen">
              <IconButton size="small">
                <Eye className="w-4 h-4" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton size="small">
                <Download className="w-4 h-4" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton size="small">
                <Share2 className="w-4 h-4" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div className="whitespace-pre-wrap font-mono text-sm">
          {submission.content}
        </div>
      </div>
    );
  };

  const renderAnnotations = () => (
    <Card className="mt-4">
      <Box className="p-4">
        <Typography variant="subtitle2" className="mb-3">
          Annotations
        </Typography>
        <div className="space-y-2">
          {annotations.map(annotation => (
            <div
              key={annotation.id}
              className="flex items-start space-x-2 p-2 bg-gray-50 rounded"
            >
              {annotation.type === 'highlight' && (
                <Highlighter className="w-4 h-4 text-yellow-500" />
              )}
              {annotation.type === 'good' && (
                <ThumbsUp className="w-4 h-4 text-green-500" />
              )}
              {annotation.type === 'bad' && (
                <ThumbsDown className="w-4 h-4 text-red-500" />
              )}
              {annotation.type === 'flag' && (
                <Flag className="w-4 h-4 text-orange-500" />
              )}
              <div>
                <Typography variant="body2" className="font-medium">
                  "{annotation.text}"
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(annotation.timestamp).toLocaleTimeString()}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </Box>
    </Card>
  );

  const renderComments = () => (
    <Card className="mt-4">
      <Box className="p-4">
        <Typography variant="subtitle2" className="mb-3">
          Comments
        </Typography>
        <div className="space-y-4">
          {comments.map(comment => (
            <div
              key={comment.id}
              className="p-3 bg-gray-50 rounded"
            >
              <Typography variant="body2">
                {comment.text}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(comment.timestamp).toLocaleTimeString()}
              </Typography>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <TextField
            size="small"
            fullWidth
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleAddComment}
          >
            Add
          </Button>
        </div>
      </Box>
    </Card>
  );

  return (
    <div>
      {renderFilePreview()}
      {renderAnnotations()}
      {renderComments()}

      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          anchorEl
            ? { top: anchorEl.top, left: anchorEl.left }
            : undefined
        }
      >
        <MenuItem onClick={() => handleAddAnnotation('highlight')}>
          <Highlighter className="w-4 h-4 mr-2 text-yellow-500" />
          Highlight
        </MenuItem>
        <MenuItem onClick={() => handleAddAnnotation('good')}>
          <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
          Good Practice
        </MenuItem>
        <MenuItem onClick={() => handleAddAnnotation('bad')}>
          <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
          Needs Improvement
        </MenuItem>
        <MenuItem onClick={() => handleAddAnnotation('flag')}>
          <Flag className="w-4 h-4 mr-2 text-orange-500" />
          Flag for Review
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SubmissionViewer;

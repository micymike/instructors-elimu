import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Fab,
  Drawer,
  Avatar,
  Badge,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  Button,
  Chip,
} from '@mui/material';
import {
  Send,
  Close,
  SmartToy,
  AttachFile,
  InsertDriveFile,
  Lightbulb,
  Notifications,
  Download,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AIAssistantService from '../services/ai-assistant.service';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from 'notistack';

const AIAssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history and subscribe to notifications
  useEffect(() => {
    if (!user) return; // Don't load chat history if user is not authenticated

    const loadChatHistory = async () => {
      try {
        const history = await AIAssistantService.getChatHistory({
          courseId: params.courseId,
          userRole: user?.role,
        });
        setMessages(history);
      } catch (error) {
        console.error('Error loading chat history:', error);
        enqueueSnackbar('Failed to load chat history', { 
          variant: 'error',
          autoHideDuration: 3000
        });
      }
    };

    const unsubscribe = AIAssistantService.subscribeToNotifications((notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    loadChatHistory();
    return () => unsubscribe();
  }, [params.courseId, user, enqueueSnackbar]);

  // Load course-specific suggestions
  useEffect(() => {
    if (!user || !params.courseId) return;

    const loadSuggestions = async () => {
      try {
        const courseSuggestions = await AIAssistantService.getCourseSuggestions(params.courseId);
        setSuggestions(courseSuggestions);
      } catch (error) {
        console.error('Error loading suggestions:', error);
      }
    };

    loadSuggestions();
  }, [params.courseId, user]);

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const newMessage = {
      type: 'user',
      content: input,
      file: selectedFile
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setSelectedFile(null);
    setIsTyping(true);

    try {
      let fileUrl = '';
      let fileAnalysis = null;

      if (selectedFile) {
        // Upload and analyze file
        const uploadResult = await AIAssistantService.handleFileUpload(selectedFile);
        fileUrl = uploadResult.url;
        fileAnalysis = await AIAssistantService.analyzeDocument(fileUrl);
      }

      // Add file context to the input if file was analyzed
      const enhancedInput = fileAnalysis 
        ? `${input}\n\nContext from uploaded file:\n${fileAnalysis.summary}`
        : input;

      const response = await AIAssistantService.getResponse(enhancedInput, {
        courseId: params.courseId,
        courseName: params.courseName,
        userRole: user?.role,
        currentPage: location.pathname,
        fileUrl,
      });

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Error in chat:', error);
      enqueueSnackbar(error.message || 'Failed to get response from AI assistant', { 
        variant: 'error',
        autoHideDuration: 3000
      });
      
      // Remove the user's message if we couldn't get a response
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        enqueueSnackbar('File size must be less than 10MB', { 
          variant: 'error',
          autoHideDuration: 3000
        });
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/csv',
        'application/json',
        'text/markdown'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        enqueueSnackbar('Unsupported file type. Please upload PDF, DOC, DOCX, TXT, CSV, JSON, or MD files.', {
          variant: 'error',
          autoHideDuration: 3000
        });
        return;
      }
      
      setSelectedFile(file);
      enqueueSnackbar('File selected. The AI will analyze its contents.', {
        variant: 'info',
        autoHideDuration: 3000
      });
    }
  };

  const renderMessage = (message) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
          width: 32,
          height: 32,
        }}
      >
        {message.type === 'user' ? (user?.name?.[0] || 'U') : <SmartToy />}
      </Avatar>
      <Paper
        sx={{
          maxWidth: '70%',
          ml: message.type === 'user' ? 0 : 1,
          mr: message.type === 'user' ? 1 : 0,
          p: 2,
          bgcolor: message.type === 'user' ? 'primary.light' : 'background.paper',
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        {message.files && message.files.map((file, index) => (
          <Button
            key={index}
            startIcon={<Download />}
            size="small"
            href={file.url}
            target="_blank"
            sx={{ mt: 1 }}
          >
            {file.name}
          </Button>
        ))}
        {message.suggestions && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {message.suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                size="small"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <>
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => {
          setIsOpen(true);
          setUnreadCount(0);
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <SmartToy />
        </Badge>
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, height: '100%' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">AI Assistant</Typography>
              <IconButton onClick={() => setIsOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            {suggestions.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    size="small"
                    icon={<Lightbulb />}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderMessage(message)}
              </motion.div>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  AI is typing...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Tooltip title="Attach file">
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current.click()}
                >
                  <AttachFile />
                </IconButton>
              </Tooltip>
              {selectedFile && (
                <Chip
                  label={selectedFile.name}
                  onDelete={() => setSelectedFile(null)}
                  size="small"
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                multiline
                maxRows={4}
              />
              <IconButton color="primary" onClick={handleSend} disabled={isTyping}>
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </>
  );
};

export default AIAssistantChat;

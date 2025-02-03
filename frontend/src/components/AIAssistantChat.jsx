import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Fab,
  Drawer,
  Avatar
} from '@mui/material';
import { Send, Close, SmartToy } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AIAssistantService from '../services/ai-assistant.service';

const AIAssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await AIAssistantService.getResponse(input);
      const aiMessage = { type: 'ai', content: response.message };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = { type: 'ai', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="AI Assistant"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsOpen(true)}
      >
        <SmartToy />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, p: 2 }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">AI Assistant</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    {message.type === 'ai' && (
                      <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                        <SmartToy />
                      </Avatar>
                    )}
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        bgcolor: message.type === 'user' ? 'primary.main' : 'background.paper',
                        color: message.type === 'user' ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography>{message.content}</Typography>
                    </Paper>
                  </Box>
                </motion.div>
              ))}
              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    AI is typing...
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}>
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AIAssistantChat;

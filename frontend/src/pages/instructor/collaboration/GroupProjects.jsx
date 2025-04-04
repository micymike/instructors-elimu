import React from 'react';
import { motion } from 'framer-motion';
import { 
  Typography, 
  Container, 
  Box, 
  Paper 
} from '@mui/material';
import { 
  Users, 
  Layers, 
  Clock 
} from 'lucide-react';

const GroupProjects = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="80vh"
        textAlign="center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 10 
          }}
        >
          <Typography 
            variant="h2" 
            color="primary" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Coming Soon
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginTop: '20px' 
          }}
        >
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                borderRadius: 2,
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
              }}
            >
              <Users size={48} color="#2196f3" />
              <Typography variant="h6" color="primary">
                Collaborative Spaces
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create and manage group projects
              </Typography>
            </Paper>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                borderRadius: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.1)'
              }}
            >
              <Layers size={48} color="#4caf50" />
              <Typography variant="h6" color="success.main">
                Project Tracking
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Monitor progress and milestones
              </Typography>
            </Paper>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                borderRadius: 2,
                backgroundColor: 'rgba(255, 152, 0, 0.1)'
              }}
            >
              <Clock size={48} color="#ff9800" />
              <Typography variant="h6" color="warning.main">
                Real-time Collaboration
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Work together seamlessly
              </Typography>
            </Paper>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{ marginTop: '30px' }}
        >
          <Typography 
            variant="body1" 
            color="textSecondary" 
            paragraph
          >
            We're working hard to bring you an amazing collaboration experience.
            Stay tuned for exciting updates!
          </Typography>
        </motion.div>
      </Box>
    </Container>
  );
};

export default GroupProjects;

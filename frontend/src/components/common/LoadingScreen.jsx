import React, { useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';

const LoadingScreen = () => {
  const controls = useAnimation();
  
  useEffect(() => {
    const animateDroplet = async () => {
      while (true) {
        // Initial state - droplet forming at top
        await controls.start({
          y: 0,
          scale: 0.6,
          opacity: 0.7,
          borderRadius: "50% 50% 50% 50%",
          transition: { duration: 0.5 }
        });
        
        // Droplet elongating as it starts to fall
        await controls.start({
          y: 10,
          scaleY: 1.2,
          scaleX: 0.8,
          opacity: 0.8,
          borderRadius: "40% 40% 60% 60%",
          transition: { duration: 0.3, ease: "easeOut" }
        });
        
        // Droplet falling
        await controls.start({
          y: 70,
          scaleY: 1.1,
          scaleX: 0.9,
          opacity: 0.9,
          borderRadius: "30% 30% 70% 70%",
          transition: { duration: 0.4, ease: "easeIn" }
        });
        
        // Droplet impact and splash
        await controls.start({
          y: 100,
          scaleY: 0.4,
          scaleX: 1.6,
          opacity: 0.7,
          borderRadius: "60% 60% 40% 40%",
          transition: { duration: 0.2, ease: "easeOut" }
        });
        
        // Droplet reforming
        await controls.start({
          y: 100,
          scale: 0.8,
          opacity: 0.6,
          borderRadius: "50% 50% 50% 50%",
          transition: { duration: 0.3 }
        });
        
        // Droplet fading out
        await controls.start({
          y: 100,
          scale: 0.5,
          opacity: 0,
          transition: { duration: 0.3 }
        });
      }
    };
    
    animateDroplet();
  }, [controls]);
  
  // Ripple effect animation
  const rippleVariants = {
    initial: { scale: 0, opacity: 0.7 },
    animate: { 
      scale: 2.5, 
      opacity: 0,
      transition: { 
        repeat: Infinity, 
        duration: 1.5,
        ease: "easeOut",
        repeatDelay: 0.5
      }
    }
  };
  
  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 300,
          position: 'relative'
        }}
      >
        {/* Water surface */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            width: '100%',
            height: '2px',
            backgroundColor: 'rgba(0, 149, 255, 0.3)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            zIndex: 1
          }}
        />
        
        {/* Ripple effects */}
        <motion.div
          variants={rippleVariants}
          initial="initial"
          animate="animate"
          style={{
            position: 'absolute',
            bottom: 30,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid rgba(0, 149, 255, 0.4)',
            zIndex: 0
          }}
        />
        
        {/* Water droplet */}
        <motion.div
          animate={controls}
          style={{
            width: 40,
            height: 40,
            backgroundColor: 'rgba(0, 149, 255, 0.7)',
            borderRadius: '50%',
            filter: 'drop-shadow(0 0 10px rgba(0, 149, 255, 0.5))',
            position: 'absolute',
            top: 0,
            zIndex: 2
          }}
        />
        
        {/* Small water particles that appear on splash */}
        <Box sx={{ position: 'relative', mt: 20 }}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0],
              x: [0, -20, -30],
              y: [0, -15, -10]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 1.5,
              delay: 0.9,
              times: [0, 0.4, 1]
            }}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              backgroundColor: 'rgba(0, 149, 255, 0.7)',
              borderRadius: '50%'
            }}
          />
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0],
              x: [0, 20, 30],
              y: [0, -15, -10]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 1.5,
              delay: 0.9,
              times: [0, 0.4, 1]
            }}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              backgroundColor: 'rgba(0, 149, 255, 0.7)',
              borderRadius: '50%'
            }}
          />
        </Box>
      </Box>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography 
          variant="h6" 
          color="primary"
          sx={{ 
            fontWeight: 'medium', 
            letterSpacing: 1,
            mb: 1
          }}
        >
          Loading Elimu
        </Typography>
        
        <Typography 
          variant="body2" 
          color="textSecondary"
          sx={{ opacity: 0.7 }}
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: 'inline-block' }}
          >
            Preparing your workspace...
          </motion.span>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoadingScreen;

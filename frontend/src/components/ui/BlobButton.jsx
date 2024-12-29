import React from 'react';
import { motion } from 'framer-motion';

const BlobButton = ({ 
  children, 
  onClick, 
  disabled, 
  className, 
  type = 'button', 
  variant = 'primary'
}) => {
  const variants = {
    primary: {
      background: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      liquid: 'bg-blue-400',
    },
    secondary: {
      background: 'bg-gray-100',
      hover: 'hover:bg-gray-200',
      liquid: 'bg-gray-300',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        px-6 py-3 w-full
        text-sm font-medium
        ${variant === 'primary' ? 'text-white' : 'text-gray-700'}
        ${variants[variant].background}
        ${variants[variant].hover}
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className || ''}
      `}
    >
      <motion.div
        initial={{ scale: 0, x: '-50%', y: '-50%' }}
        whileHover={{ scale: 1.5 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.4, 0, 0.2, 1],
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 100,
          }
        }}
        className={`
          absolute left-1/2 top-1/2
          w-full aspect-square
          ${variants[variant].liquid}
          opacity-30 rounded-full
          pointer-events-none
          origin-center
          mix-blend-multiply
        `}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default BlobButton;
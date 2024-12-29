import React from 'react';

const Tabs = ({ children, defaultValue, className = "" }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const TabsList = ({ children, className = "" }) => {
  return (
    <div className={`flex space-x-2 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ children, value, onClick, active, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors
                 ${active 
                   ? 'text-blue-600 border-b-2 border-blue-600' 
                   : 'text-gray-600 hover:text-blue-600'}
                 ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, active, className = "" }) => {
  if (!active) return null;
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 
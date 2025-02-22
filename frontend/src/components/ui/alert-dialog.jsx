import React from 'react';

export const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={() => onOpenChange(false)}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({ children }) => <div>{children}</div>;

export const AlertDialogHeader = ({ children }) => <div className="mb-4">{children}</div>;

export const AlertDialogTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;

export const AlertDialogDescription = ({ children }) => <p className="text-gray-600">{children}</p>;

export const AlertDialogAction = ({ onClick, children }) => (
  <button onClick={onClick} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
    {children}
  </button>
);

export const AlertDialogCancel = ({ children }) => (
  <button className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
    {children}
  </button>
);

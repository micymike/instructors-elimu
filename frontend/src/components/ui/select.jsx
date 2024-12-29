import React from 'react';

const Select = React.forwardRef(({ children, value, onValueChange, className = "" }, ref) => {
  return (
    <select
      ref={ref}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm 
                 ring-offset-white focus-visible:outline-none focus-visible:ring-2 
                 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                 disabled:opacity-50 ${className}`}
    >
      {children}
    </select>
  );
});

const SelectTrigger = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-200 
                 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const SelectContent = ({ children, className = "" }) => {
  return (
    <div className={`relative mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 
                    bg-white text-base shadow-lg focus:outline-none sm:text-sm ${className}`}>
      {children}
    </div>
  );
};

const SelectItem = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 
                 pl-8 pr-2 text-sm outline-none focus:bg-blue-50 focus:text-blue-600 
                 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const SelectValue = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <span ref={ref} className={className} {...props}>
      {children}
    </span>
  );
});

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectItem.displayName = "SelectItem";
SelectValue.displayName = "SelectValue";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }; 
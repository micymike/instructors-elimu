const Alert = ({ children, className = "" }) => {
  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = "" }) => {
  return <p className={`text-sm text-blue-700 ${className}`}>{children}</p>;
};

export { Alert, AlertDescription }; 
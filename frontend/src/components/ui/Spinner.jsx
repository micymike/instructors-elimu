import React from 'react';
import './Spinner.css'; // Make sure to update the CSS accordingly

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="ring-container">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Spinner;

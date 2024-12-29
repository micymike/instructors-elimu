import React from 'react';
import './TermsOfService.css'; // Assuming we'll create a CSS file for styling

const TermsOfService = () => {
    return (
        <div className="terms-container">
            <h1>Terms of Service</h1>
            <p>Welcome to our platform! Please read these terms carefully before using our services.</p>
            
            <h2>User Responsibilities</h2>
            <ul>
                <li>Respect the privacy and rights of other users.</li>
                <li>Provide accurate and truthful information when creating an account.</li>
                <li>Use the platform in a manner that complies with all applicable laws and regulations.</li>
                <li>Report any suspicious activity or violations of platform rules.</li>
            </ul>
            
            <h2>Platform Rules</h2>
            <ul>
                <li>No harassment, bullying, or discrimination against other users.</li>
                <li>Do not share inappropriate or offensive content.</li>
                <li>Maintain the security of your account and do not share your login credentials.</li>
                <li>Follow any additional rules set forth by the platform administrators.</li>
            </ul>
        </div>
    );
};

export default TermsOfService;

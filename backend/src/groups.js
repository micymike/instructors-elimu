const express = require('express');
const router = express.Router();

// Sample data for demonstration
const groups = [
    { _id: '1', name: 'Group A', instructorId: 'Instructor 1', studentIds: ['Student 1', 'Student 2'] },
    { _id: '2', name: 'Group B', instructorId: 'Instructor 2', studentIds: ['Student 3'] },
];

// Define the endpoint
router.get('/api/groups', (req, res) => {
    res.json(groups); // Return groups as JSON
});

module.exports = router;

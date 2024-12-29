import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [studentIds, setStudentIds] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups'); // Adjust the endpoint as needed
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const createGroup = async () => {
    try {
      const response = await axios.post('/api/groups', {
        name: groupName,
        instructorId,
        studentIds: studentIds.split(',').map(id => id.trim()),
      });
      setGroups([...groups, response.data]);
      setGroupName('');
      setInstructorId('');
      setStudentIds('');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div>
      <h1>Group Management</h1>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Instructor ID"
        value={instructorId}
        onChange={(e) => setInstructorId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Student IDs (comma-separated)"
        value={studentIds}
        onChange={(e) => setStudentIds(e.target.value)}
      />
      <button onClick={createGroup}>Create Group</button>
      <h2>Existing Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group._id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupManagement;

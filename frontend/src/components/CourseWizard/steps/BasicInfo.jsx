import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const BasicInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const categories = [
    'Programming',
    'Mathematics',
    'Science',
    'Language',
    'Business',
    'Arts',
    'Other'
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="space-y-4">
      <TextField
        fullWidth
        label="Course Title"
        name="title"
        value={data.title}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        label="Description"
        name="description"
        value={data.description}
        onChange={handleChange}
        multiline
        rows={4}
        required
      />

      <TextField
        fullWidth
        select
        label="Category"
        name="category"
        value={data.category}
        onChange={handleChange}
        required
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Level"
        name="level"
        value={data.level}
        onChange={handleChange}
        required
      >
        {levels.map((level) => (
          <MenuItem key={level.value} value={level.value}>
            {level.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Duration (e.g., 8 weeks)"
        name="duration"
        value={data.duration}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        label="Price"
        name="price"
        type="number"
        value={data.price}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default BasicInfo;

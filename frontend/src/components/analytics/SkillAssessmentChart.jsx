import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Card, Typography } from '@mui/material';

const SkillAssessmentChart = ({ data, title }) => {
  return (
    <Card className="p-6">
      <Typography variant="h6" className="mb-4">{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Current Level"
            dataKey="currentLevel"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="Target Level"
            dataKey="targetLevel"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SkillAssessmentChart;

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const UpcomingSchedule = () => {
  const schedules = [
    {
      id: 1,
      title: 'Introduction to React',
      time: '10:00 AM - 11:30 AM',
      date: 'Today',
      type: 'lecture',
      status: 'default'
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      time: '2:00 PM - 3:30 PM',
      date: 'Tomorrow',
      type: 'workshop',
      status: 'secondary'
    },
    {
      id: 3,
      title: 'Project Review',
      time: '4:00 PM - 5:00 PM',
      date: 'Jan 28',
      type: 'meeting',
      status: 'outline'
    }
  ];

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Schedule</h3>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Badge variant={schedule.status}>{schedule.type}</Badge>
                <div>
                  <p className="font-medium">{schedule.title}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{schedule.date}</span>
                    <span>•</span>
                    <span>{schedule.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default UpcomingSchedule;

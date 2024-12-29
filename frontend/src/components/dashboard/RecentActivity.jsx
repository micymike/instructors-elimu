import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'course',
      title: 'Introduction to Programming',
      action: 'New enrollment',
      time: '2 hours ago',
      status: 'default'
    },
    {
      id: 2,
      type: 'review',
      title: 'Web Development Basics',
      action: 'New review',
      time: '5 hours ago',
      status: 'secondary'
    },
    {
      id: 3,
      type: 'message',
      title: 'Student Question',
      action: 'New message',
      time: '1 day ago',
      status: 'outline'
    }
  ];

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Badge variant={activity.status}>{activity.action}</Badge>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;

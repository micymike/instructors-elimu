import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { BookOpen, Clock, Users } from 'lucide-react';
import { formatDistance } from 'date-fns';

const ActivityIcon = {
  course: BookOpen,
  student: Users,
  session: Clock
};

const RecentActivity = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No recent activity
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {/* Dynamic icon based on activity type */}
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {activity.title || 'Course Update'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.status || 'Updated'} • 
                    {formatDistance(new Date(activity.updatedAt), new Date(), { addSuffix: true })}
                  </p>
                </div>
              </div>
              {activity.students && (
                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {activity.students} students
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;

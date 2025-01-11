import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format, formatDistance } from 'date-fns';

const UpcomingSchedule = ({ sessions = [] }) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No upcoming sessions
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {session.sessionTopic || 'Course Session'}
              </p>
              <p className="text-xs text-gray-500">
                {session.courseTitle} • {format(new Date(session.sessionDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {session.startTime} - {session.endTime}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingSchedule;

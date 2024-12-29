import React from 'react';
import { Card } from '../ui/Card';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  const isPositive = trend > 0;
  
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
          {Icon && (
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{trend}%
            </span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;

import React from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  MessageCircle,
  Award,
  BarChart2,
  FileText,
  Settings,
  Star,
  BookTemplate,
  Printer,
  Save,
  Share2
} from 'lucide-react';

const QuickActionsMenu = ({
  onOpenTemplates,
  onOpenRubric,
  onOpenAnalytics,
  onOpenFeedback,
  onSaveDraft,
  onPrint,
  onShare
}) => {
  const actions = [
    { 
      icon: <BookTemplate className="w-5 h-5" />, 
      name: 'Templates',
      onClick: onOpenTemplates,
      color: 'primary'
    },
    { 
      icon: <Award className="w-5 h-5" />, 
      name: 'Rubric',
      onClick: onOpenRubric
    },
    { 
      icon: <BarChart2 className="w-5 h-5" />, 
      name: 'Analytics',
      onClick: onOpenAnalytics
    },
    { 
      icon: <MessageCircle className="w-5 h-5" />, 
      name: 'Feedback',
      onClick: onOpenFeedback
    },
    { 
      icon: <Save className="w-5 h-5" />, 
      name: 'Save Draft',
      onClick: onSaveDraft
    },
    { 
      icon: <Printer className="w-5 h-5" />, 
      name: 'Print',
      onClick: onPrint
    },
    { 
      icon: <Share2 className="w-5 h-5" />, 
      name: 'Share',
      onClick: onShare
    }
  ];

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col space-y-2 p-2">
        {actions.map((action) => (
          <Tooltip
            key={action.name}
            title={action.name}
            placement="left"
          >
            <IconButton
              onClick={action.onClick}
              size="small"
              className={`w-10 h-10 ${
                action.color === 'primary' 
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsMenu;

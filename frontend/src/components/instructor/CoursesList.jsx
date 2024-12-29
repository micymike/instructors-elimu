import React from 'react';
import { FileText, Video, ExternalLink } from 'lucide-react';

export const CoursesList = ({ courses }) => {
    const getFileIcon = (type) => {
        if (type === 'document') return <FileText className="h-5 w-5 text-blue-500" />;
        if (type === 'video') return <Video className="h-5 w-5 text-red-500" />;
        return null;
    };

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
                <div key={course._id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{course.description}</p>

                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Level:</span>
                                <span className="text-gray-500">{course.level}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="font-medium">Duration:</span>
                                <span className="text-gray-500">{course.duration}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="font-medium">Price:</span>
                                <span className="text-gray-500">${course.pricing.amount}</span>
                            </div>
                        </div>

                        {course.modules[0]?.content.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-900">Course Materials:</h4>
                                <ul className="mt-2 divide-y divide-gray-200">
                                    {course.modules[0].content.map((item, index) => (
                                        <li key={index} className="py-2">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center hover:bg-gray-50 -mx-2 px-2 rounded-md"
                                            >
                                                {getFileIcon(item.type)}
                                                <span className="ml-2 text-sm text-gray-700">{item.title}</span>
                                                <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}; 
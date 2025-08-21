import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CourseCardProps {
  course: Course;
  onDelete: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/course/${course.id}`);
  };

  const progress = Math.round((course.subjects.reduce((a,s)=>a+s.contents.length,0) / 50) * 100);

  return (
    <div className="card group relative cursor-pointer transition-transform duration-200 hover:scale-[1.01] p-4" onClick={handleClick}>
      <div className="relative rounded-lg overflow-hidden">
        {/* Title/Image - smaller scale */}
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.name}
            className="w-full h-28 object-cover"
          />
        ) : (
          <div className="w-full h-28 flex items-center justify-center">
            <div className="text-white text-2xl font-semibold">
              {course.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-600/20 transition-colors"
        >
          <TrashIcon className="w-4 h-4 text-red-600" />
        </button>
      </div>

      {/* Subject Count Badge */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="bg-gray-500 dark:bg-gray-500 text-white dark:text-gray-300 text-xs px-2 py-1 rounded-full font-medium">
          {course.subjects.length} Subjects
        </span>
      </div>

      {/* Progress */}
      <div className="progress-bar mt-2 mb-2"><div style={{width:`${progress}%`}}></div></div>
      
      {/* Action area - simplified */}
      <div className="flex items-center justify-end">
        <button className="pill bg-white/90 text-gray-800 hover:bg-white dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">Continue</button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
          {course.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-xs">
          Created {new Date(course.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;

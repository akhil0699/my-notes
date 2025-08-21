import React from 'react';
import { Subject } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface SubjectCardProps {
  subject: Subject;
  onDelete: () => void;
  onClick: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onDelete, onClick }) => {
  return (
    <div className="card group cursor-pointer hover:scale-[1.02] transition-transform duration-200" onClick={onClick}>
      <div className="relative">
        {/* Subject Image - smaller height */}
        <div className="h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-t-xl flex items-center justify-center">
          {subject.image ? (
            <img 
              src={subject.image} 
              alt={subject.name}
              className="w-full h-24 object-cover rounded-t-xl"
            />
          ) : (
            <div className="text-white text-2xl font-semibold">
              {subject.name.charAt(0).toUpperCase()}
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

        {/* Content Count Badge - visible on hover only */}
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="bg-gray-500 dark:bg-gray-500 text-white dark:text-gray-300 text-xs px-2 py-1 rounded-full font-medium">
            {subject.contents.length} Contents
          </span>
        </div>
      </div>

      {/* Subject Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
          {subject.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          Created {new Date(subject.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default SubjectCard;


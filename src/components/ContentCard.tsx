import React from 'react';
import { Content } from '../types';
import { PencilIcon, TrashIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface ContentCardProps {
  content: Content;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onEdit, onDelete, onClick }) => {
  // Check if content has PDF or image based on the content field
  const hasPdf = content.content && content.content.includes('.pdf');
  const hasImage = content.content && content.content.includes('image');

  return (
    <div className="card group cursor-pointer hover:scale-[1.02] transition-transform duration-200" onClick={onClick}>
      <div className="relative">
        {/* Content Preview */}
        <div className="h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-xl flex items-center justify-center">
          {hasPdf ? (
            <DocumentTextIcon className="w-12 h-12 text-white" />
          ) : hasImage ? (
            <PhotoIcon className="w-12 h-12 text-white" />
          ) : (
            <div className="text-white text-2xl font-semibold">
              {content.title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <PencilIcon className="w-4 h-4 text-gray-600" />
            </button>
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
        </div>

        {/* Content Type Badge */}
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="bg-gray-500 dark:bg-gray-500 text-white dark:text-gray-300 text-xs px-2 py-1 rounded-full font-medium">
            {hasPdf ? 'PDF' : hasImage ? 'Image' : 'Text'}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
          {content.title}
        </h3>
        {content.content && (
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
            {content.content}
          </p>
        )}
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          Created {new Date(content.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ContentCard;

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusIcon } from '@heroicons/react/24/outline';
import CourseModal from '../components/CourseModal';
import CourseCard from '../components/CourseCard';

const Home: React.FC = () => {
  const { state, deleteCourse } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCourse = () => {
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(parseInt(courseId));
      } catch (error) {
        console.error('Failed to delete course:', error);
        // Error is already handled in the context
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to My Notes
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Organize your learning materials efficiently
          </p>
        </div>
        <button
          onClick={handleAddCourse}
          className="btn-primary flex items-center text-sm"
          disabled={state.loading}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{state.error}</p>
        </div>
      )}

      {/* Loading State */}
      {state.loading && state.courses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      )}

      {/* Course Grid */}
      {!state.loading && state.courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <PlusIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by creating your first course
          </p>
          <button
            onClick={handleAddCourse}
            className="btn-primary"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={() => handleDeleteCourse(course.id)}
            />
          ))}
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;

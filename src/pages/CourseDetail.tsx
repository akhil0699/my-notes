import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import SubjectModal from '../components/SubjectModal';
import SubjectCard from '../components/SubjectCard';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { state, fetchSubjects, deleteSubject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const course = state.courses.find(c => c.id === courseId);

  useEffect(() => {
    if (courseId) {
      // Fetch subjects for this specific course
      fetchSubjects(courseId);
    }
  }, [courseId]); // Only depend on courseId

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Course not found
        </h2>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const handleAddSubject = () => {
    setIsModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteSubject(parseInt(subjectId));
      } catch (error) {
        console.error('Failed to delete subject:', error);
        // Error is already handled in the context
      }
    }
  };

  const handleSubjectClick = (subject: any) => {
    navigate(`/course/${courseId}/subject/${subject.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {course.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {state.subjects.length} subjects • Created {new Date(course.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleAddSubject}
          className="btn-primary flex items-center"
          disabled={state.loading}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Subject
        </button>
      </div>

      {/* Course Image */}
      {course.image && (
        <div className="relative">
          <img
            src={course.image}
            alt={course.name}
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl"></div>
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{state.error}</p>
        </div>
      )}

      {/* Loading State */}
      {state.loading && state.subjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subjects...</p>
        </div>
      )}

      {/* Subjects Grid */}
      {!state.loading && state.subjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <PlusIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No subjects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by creating your first subject
          </p>
          <button
            onClick={handleAddSubject}
            className="btn-primary"
          >
            Create Your First Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onDelete={() => handleDeleteSubject(subject.id)}
              onClick={() => handleSubjectClick(subject)}
            />
          ))}
        </div>
      )}

      {/* Subject Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={course.id}
      />
    </div>
  );
};

export default CourseDetail;


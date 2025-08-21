import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeftIcon, PlusIcon, DocumentTextIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import ContentModal from '../components/ContentModal';

const SubjectDetail: React.FC = () => {
  const { courseId, subjectId } = useParams<{ courseId: string; subjectId: string }>();
  const navigate = useNavigate();
  const { state, fetchContents, deleteContent, fetchSubjects } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<any>(null);

  const course = state.courses.find(c => c.id === courseId);
  const subject = state.subjects.find(s => s.id === subjectId);

  useEffect(() => {
    if (courseId) {
      // Fetch subjects for this course first
      fetchSubjects(courseId);
    }
  }, [courseId, fetchSubjects]);

  useEffect(() => {
    if (subjectId) {
      // Fetch contents for this specific subject
      fetchContents(parseInt(subjectId));
    }
  }, [subjectId, fetchContents]);

  // Pre-select the first content when contents are loaded
  useEffect(() => {
    if (state.contents.length > 0 && !selectedContent) {
      setSelectedContent(state.contents[0]);
    }
  }, [state.contents, selectedContent]);

  // Show loading state while fetching data
  if (state.loading && (!course || !subject)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subject...</p>
        </div>
      </div>
    );
  }

  if (!course || !subject || !courseId || !subjectId) {
    return (
      <div className="h-screen">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Subject not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The subject you're looking for doesn't exist or hasn't loaded yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddContent = () => {
    setEditingContent(null); // Clear editing content for new content
    setIsModalOpen(true);
  };

  const handleEditContent = (content: any) => {
    setEditingContent(content); // Set the content being edited
    setIsModalOpen(true);
  };

  const handleDeleteContent = async (content: any) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(parseInt(content.id));
        if (selectedContent?.id === content.id) {
          setSelectedContent(null);
        }
      } catch (error) {
        console.error('Failed to delete content:', error);
        // Error is already handled in the context
      }
    }
  };

  const handleContentClick = (content: any) => {
    setSelectedContent(content);
  };

  return (
    <div className="h-screen overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200/70 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {course.name}
            </h1>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {subject.name}
          </h2>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Contents ({state.contents.length})
              </h3>
              <button
                onClick={handleAddContent}
                className="icon-btn w-8 h-8 rounded-lg text-gray-600 dark:text-gray-300"
                disabled={state.loading}
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Loading State */}
            {state.loading && (
              <div className="text-center py-8">
                <div className="w-6 h-6 mx-auto mb-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading contents...</p>
              </div>
            )}

            {/* Error Display */}
            {state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-red-800 dark:text-red-200 text-sm">{state.error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              {!state.loading && state.contents.map((content) => (
                <div
                  key={content.id}
                  className={`w-full p-3 rounded-lg transition-colors flex items-center justify-between group ${
                    selectedContent?.id === content.id
                      ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <button
                    onClick={() => handleContentClick(content)}
                    className="flex items-center space-x-3 flex-1 text-left"
                  >
                    <DocumentTextIcon className="w-5 h-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate max-w-[10rem] md:max-w-[14rem]">
                        {content.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                    <button
                      onClick={() => handleEditContent(content)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(content)}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-600/20"
                    >
                      <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
              
              {!state.loading && state.contents.length === 0 && (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No contents yet
                  </p>
                  <button
                    onClick={handleAddContent}
                    className="mt-2 text-primary-600 dark:text-primary-400 text-sm hover:underline"
                  >
                    Add your first content
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex flex-col overflow-y-auto">
        {selectedContent ? (
          <div className="flex-1 p-4 lg:p-6">
            <div className="max-w-5xl mx-auto">
              {/* Single Content Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedContent.title}
                      </h1>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                        <span className="flex items-center">
                          <DocumentTextIcon className="w-4 h-4 mr-1" />
                          Created {new Date(selectedContent.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {selectedContent.content_pdf && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                          PDF
                        </span>
                      )}
                      {selectedContent.content_image && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                          Image
                        </span>
                      )}
                      {selectedContent.content && selectedContent.content.trim() && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          Rich Text
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 lg:p-8 space-y-8">
                  {/* Content Text */}
                  {selectedContent.content && selectedContent.content.trim() && (
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: selectedContent.content }}
                    />
                  )}

                  {/* PDF Viewer */}
                  {selectedContent.content_pdf && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
                      <iframe
                        src={selectedContent.content_pdf}
                        className="w-full h-[500px] border-0"
                        title="PDF Viewer"
                      />
                    </div>
                  )}

                  {/* Content Image */}
                  {selectedContent.content_image && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <img 
                        src={selectedContent.content_image}
                        alt="Content Image"
                        className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg mx-auto"
                      />
                    </div>
                  )}

                  {/* Fallback for empty content */}
                  {(!selectedContent.content || selectedContent.content.trim() === '') && !selectedContent.content_image && !selectedContent.content_pdf && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DocumentTextIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Content Available
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        This content item doesn't have any text, images, or PDF files attached yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a content to view
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a content from the sidebar to start reading
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Modal */}
      <ContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={editingContent}
        subjectId={subjectId}
        onContentCreated={(title) => {
          // Find and select the newly created content
          const newContent = state.contents.find(c => c.title === title);
          if (newContent) {
            setSelectedContent(newContent);
          }
        }}
      />
    </div>
  );
};

export default SubjectDetail;

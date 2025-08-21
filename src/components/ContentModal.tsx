import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Content } from '../types';
import { XMarkIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Editor } from '@tinymce/tinymce-react';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: Content | null;
  subjectId: string;
  onContentCreated?: (title: string) => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, content, subjectId, onContentCreated }) => {
  const { createContent, updateContent } = useApp();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (content) {
        // Editing existing content
        setTitle(content.title);
        setText(content.content);
        setPdfFile(null);
        setImageFile(null);
      } else {
        // Creating new content
        setTitle('');
        setText('');
        setPdfFile(null);
        setImageFile(null);
      }
    }
  }, [content, isOpen]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a content title');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (content) {
        // Update existing content
        await updateContent(parseInt(content.id), {
          title: title.trim(),
          text: text.trim() || undefined,
          subjectId: parseInt(subjectId),
          pdf: pdfFile,
          image: imageFile,
        });
      } else {
        // Create new content
        const result = await createContent({
          title: title.trim(),
          text: text.trim() || undefined,
          subjectId: parseInt(subjectId),
          pdf: pdfFile,
          image: imageFile,
        });
        
        // Notify parent component about the newly created content
        if (onContentCreated && result) {
          onContentCreated(title.trim());
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save content:', error);
      // Error is already handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto my-8" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {content ? 'Edit Content' : 'Add New Content'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter content title"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Content Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Text
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                licenseKey="gpl"
                value={text}
                onEditorChange={(content) => setText(content)}
                disabled={isSubmitting}
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks fontsize | ' +
                    'bold italic underline strikethrough | forecolor backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist | outdent indent | ' +
                    'link image media table | code preview fullscreen | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height: 1.6; margin: 1rem; }',
                  skin: 'oxide',
                  content_css: 'default',
                  branding: false,
                  promotion: false,
                  resize: true,
                  statusbar: true,
                }}
              />
            </div>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              PDF File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> PDF
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  disabled={isSubmitting}
                />
              </label>
            </div>
            {pdfFile && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Selected: {pdfFile.name}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center">
                  <PhotoIcon className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> Image
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </label>
            </div>
            {imageFile && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (content ? 'Update Content' : 'Create Content')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;


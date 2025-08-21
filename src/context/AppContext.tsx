import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { Course, Subject, Content, ApiCourse, ApiSubject, ApiContent } from '../types';
import apiService from '../services/api';

interface AppState {
  courses: Course[];
  subjects: Subject[];
  contents: Content[];
  darkMode: boolean;
  currentCourse: Course | null;
  currentSubject: Subject | null;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'SET_SUBJECTS'; payload: Subject[] }
  | { type: 'SET_CONTENTS'; payload: Content[] }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'ADD_CONTENT'; payload: Content }
  | { type: 'DELETE_CONTENT'; payload: string }
  | { type: 'UPDATE_CONTENT'; payload: Content }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_CURRENT_COURSE'; payload: Course | null }
  | { type: 'SET_CURRENT_SUBJECT'; payload: Subject | null };

const initialState: AppState = {
  courses: [],
  subjects: [],
  contents: [],
  darkMode: false,
  currentCourse: null,
  currentSubject: null,
  loading: false,
  error: null,
};

// Helper function to convert API course to internal course format
const convertApiCourseToCourse = (apiCourse: ApiCourse): Course => ({
  id: apiCourse.id.toString(),
  name: apiCourse.course_name,
  image: apiCourse.course_image,
  subjects: [],
  createdAt: new Date(),
});

// Helper function to convert API subject to internal subject format
const convertApiSubjectToSubject = (apiSubject: ApiSubject): Subject => ({
  id: apiSubject.id.toString(),
  name: apiSubject.subject_name,
  image: apiSubject.subject_image,
  courseId: apiSubject.course_id.toString(),
  contents: [],
  createdAt: new Date(),
});

// Helper function to convert API content to internal content format
const convertApiContentToContent = (apiContent: ApiContent): Content => ({
  id: apiContent.id.toString(),
  title: apiContent.content_title,
  content: apiContent.content_text,
  subjectId: apiContent.subject_id.toString(),
  createdAt: new Date(),
  updatedAt: new Date(),
  // Store the additional API fields for later use
  content_pdf: apiContent.content_pdf,
  content_image: apiContent.content_image,
} as Content & { content_pdf?: string; content_image?: string });

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload,
        error: null,
      };
    case 'SET_SUBJECTS':
      return {
        ...state,
        subjects: action.payload,
        error: null,
      };
    case 'SET_CONTENTS':
      return {
        ...state,
        contents: action.payload,
        error: null,
      };
    case 'ADD_COURSE':
      return {
        ...state,
        courses: [...state.courses, action.payload],
        error: null,
      };
    case 'DELETE_COURSE':
      return {
        ...state,
        courses: state.courses.filter(course => course.id !== action.payload),
        currentCourse: state.currentCourse?.id === action.payload ? null : state.currentCourse,
        error: null,
      };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload.id ? action.payload : course
        ),
        currentCourse: state.currentCourse?.id === action.payload.id ? action.payload : state.currentCourse,
        error: null,
      };
    case 'ADD_SUBJECT':
      return {
        ...state,
        subjects: [...state.subjects, action.payload],
        error: null,
      };
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter(subject => subject.id !== action.payload),
        currentSubject: state.currentSubject?.id === action.payload ? null : state.currentSubject,
        error: null,
      };
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(subject =>
          subject.id === action.payload.id ? action.payload : subject
        ),
        currentSubject: state.currentSubject?.id === action.payload.id ? action.payload : state.currentSubject,
        error: null,
      };
    case 'ADD_CONTENT':
      return {
        ...state,
        contents: [...state.contents, action.payload],
        error: null,
      };
    case 'DELETE_CONTENT':
      return {
        ...state,
        contents: state.contents.filter(content => content.id !== action.payload),
        error: null,
      };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        contents: state.contents.map(content =>
          content.id === action.payload.id ? action.payload : content
        ),
        error: null,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'SET_CURRENT_COURSE':
      return {
        ...state,
        currentCourse: action.payload,
      };
    case 'SET_CURRENT_SUBJECT':
      return {
        ...state,
        currentSubject: action.payload,
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  fetchCourses: () => Promise<void>;
  fetchSubjects: (courseId?: string) => Promise<void>;
  fetchContents: (subjectId?: number) => Promise<void>;
  createCourse: (courseName: string, file: File | null) => Promise<void>;
  createSubject: (subjectName: string, courseId: number, file: File | null) => Promise<void>;
  createContent: (data: { title: string; text?: string; subjectId: number; pdf?: File | null; image?: File | null }) => Promise<{ success: boolean; title: string } | undefined>;
  updateContent: (contentId: number, data: { title: string; text?: string; subjectId: number; pdf?: File | null; image?: File | null }) => Promise<void>;
  deleteCourse: (courseId: number) => Promise<void>;
  deleteSubject: (subjectId: number) => Promise<void>;
  deleteContent: (contentId: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const apiCourses = await apiService.getCourses();
      const courses = apiCourses.map(convertApiCourseToCourse);
      
      dispatch({ type: 'SET_COURSES', payload: courses });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch courses' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch subjects from API
  const fetchSubjects = useCallback(async (courseId?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const apiSubjects = await apiService.getSubjects(undefined, courseId);
      const subjects = apiSubjects.map(convertApiSubjectToSubject);
      
      dispatch({ type: 'SET_SUBJECTS', payload: subjects });
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch subjects' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch contents from API
  const fetchContents = useCallback(async (subjectId?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const apiContents = await apiService.getContents(undefined, subjectId);
      const contents = apiContents.map(convertApiContentToContent);
      
      dispatch({ type: 'SET_CONTENTS', payload: contents });
    } catch (error) {
      console.error('Failed to fetch contents:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch contents' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Create course via API
  const createCourse = useCallback(async (courseName: string, file: File | null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await apiService.createCourse({ course_name: courseName, file });
      
      // Refresh courses after creation
      await fetchCourses();
    } catch (error) {
      console.error('Failed to create course:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create course' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchCourses]);

  // Create subject via API
  const createSubject = useCallback(async (subjectName: string, courseId: number, file: File | null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await apiService.createSubject({ subject_name: subjectName, course_id: courseId, file });
      
      // Refresh subjects after creation
      await fetchSubjects(courseId.toString());
    } catch (error) {
      console.error('Failed to create subject:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create subject' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchSubjects]);

  // Create content via API
  const createContent = useCallback(async (data: { title: string; text?: string; subjectId: number; pdf?: File | null; image?: File | null }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const result = await apiService.createContent({
        content_title: data.title,
        content_text: data.text,
        subject_id: data.subjectId,
        content_pdf: data.pdf,
        content_image: data.image,
      });
      
      // Refresh contents after creation
      await fetchContents(data.subjectId);
      
      // Return success to indicate creation completed
      return { success: true as boolean, title: data.title };
    } catch (error) {
      console.error('Failed to create content:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create content' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchContents]);

  // Update content via API
  const updateContent = useCallback(async (contentId: number, data: { title: string; text?: string; subjectId: number; pdf?: File | null; image?: File | null }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await apiService.updateContent(contentId, {
        content_title: data.title,
        content_text: data.text,
        subject_id: data.subjectId,
        content_pdf: data.pdf,
        content_image: data.image,
      });
      
      // Refresh contents after update
      await fetchContents(data.subjectId);
    } catch (error) {
      console.error('Failed to update content:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update content' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchContents]);

  // Delete course via API
  const deleteCourse = useCallback(async (courseId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await apiService.deleteCourse(courseId);
      
      // Remove from local state
      dispatch({ type: 'DELETE_COURSE', payload: courseId.toString() });
    } catch (error) {
      console.error('Failed to delete course:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete course' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Delete subject via API
  const deleteSubject = useCallback(async (subjectId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await apiService.deleteSubject(subjectId);
      
      // Remove from local state
      dispatch({ type: 'DELETE_SUBJECT', payload: subjectId.toString() });
    } catch (error) {
      console.error('Failed to delete subject:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete subject' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Delete content via API
  const deleteContent = useCallback(async (contentId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await apiService.deleteContent(contentId);
      
      // Remove from local state
      dispatch({ type: 'DELETE_CONTENT', payload: contentId.toString() });
    } catch (error) {
      console.error('Failed to delete content:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete content' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      fetchCourses, 
      fetchSubjects,
      fetchContents,
      createCourse, 
      createSubject,
      createContent,
      updateContent,
      deleteCourse,
      deleteSubject,
      deleteContent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

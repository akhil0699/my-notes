// Extend ImportMeta to include 'env' property for Vite
interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_BASE_URL = 'https://my-notes-backend-t5xa.onrender.com';

export interface CourseResponse {
  course_name: string;
  id: number;
  course_image: string;
}

export interface CreateCourseRequest {
  course_name: string;
  file: File | null;
}

export interface SubjectResponse {
  subject_name: string;
  course_id: number;
  id: number;
  subject_image: string;
}

export interface CreateSubjectRequest {
  subject_name: string;
  file: File | null;
}

export interface ContentResponse {
  content_title: string;
  content_text: string;
  subject_id: number;
  id: number;
  content_pdf: string;
  content_image: string;
}

export interface CreateContentRequest {
  content_title: string;
  content_text?: string;
  subject_id: number;
  content_pdf?: File | null;
  content_image?: File | null;
}

export interface UpdateContentRequest {
  content_title: string;
  content_text?: string;
  subject_id: number;
  content_pdf?: File | null;
  content_image?: File | null;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Create course with multipart data
  async createCourse(data: CreateCourseRequest): Promise<string> {
    const formData = new FormData();
    formData.append('course_name', data.course_name);
    
    if (data.file) {
      formData.append('file', data.file);
    }

    const url = `${API_BASE_URL}/notes/course`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        // Don't set Content-Type header for FormData, let browser set it
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Create course failed:', error);
      throw error;
    }
  }

  // Get all courses with optional filter
  async getCourses(courseName?: string): Promise<CourseResponse[]> {
    let endpoint = '/notes/course';
    if (courseName) {
      endpoint += `?course_name=${encodeURIComponent(courseName)}`;
    }
    
    return this.request<CourseResponse[]>(endpoint);
  }

  // Get course by ID
  async getCourseById(courseId: number): Promise<CourseResponse> {
    return this.request<CourseResponse>(`/notes/course/${courseId}`);
  }

  // Delete course by ID
  async deleteCourse(courseId: number): Promise<string> {
    return this.request<string>(`/notes/course/${courseId}`, {
      method: 'DELETE',
    });
  }

  // Create subject with multipart data
  async createSubject(data: CreateSubjectRequest): Promise<string> {
    const formData = new FormData();
    formData.append('subject_name', data.subject_name);
    
    if (data.file) {
      formData.append('file', data.file);
    }

    const url = `${API_BASE_URL}/notes/subject`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        // Don't set Content-Type header for FormData, let browser set it
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Create subject failed:', error);
      throw error;
    }
  }

  // Get subjects with optional filters
  async getSubjects(subjectName?: string, courseId?: string): Promise<SubjectResponse[]> {
    let endpoint = '/notes/subject';
    const params = new URLSearchParams();
    
    if (subjectName) {
      params.append('subject_name', subjectName);
    }
    if (courseId) {
      params.append('course_id', courseId);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.request<SubjectResponse[]>(endpoint);
  }

  // Get subject by ID
  async getSubjectById(subjectId: number): Promise<SubjectResponse> {
    return this.request<SubjectResponse>(`/notes/subject/${subjectId}`);
  }

  // Delete subject by ID
  async deleteSubject(subjectId: number): Promise<string> {
    return this.request<string>(`/notes/subject/${subjectId}`, {
      method: 'DELETE',
    });
  }

  // Create content with multipart data
  async createContent(data: CreateContentRequest): Promise<string> {
    const formData = new FormData();
    formData.append('content_title', data.content_title);
    formData.append('subject_id', data.subject_id.toString());
    
    if (data.content_text) {
      formData.append('content_text', data.content_text);
    }
    if (data.content_pdf) {
      formData.append('content_pdf', data.content_pdf);
    }
    if (data.content_image) {
      formData.append('content_image', data.content_image);
    }

    const url = `${API_BASE_URL}/notes/content`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        // Don't set Content-Type header for FormData, let browser set it
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Create content failed:', error);
      throw error;
    }
  }

  // Get contents with optional filters
  async getContents(contentTitle?: string, subjectId?: number): Promise<ContentResponse[]> {
    let endpoint = '/notes/content';
    const params = new URLSearchParams();
    
    if (contentTitle) {
      params.append('content_title', contentTitle);
    }
    if (subjectId) {
      params.append('subject_id', subjectId.toString());
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.request<ContentResponse[]>(endpoint);
  }

  // Get content by ID
  async getContentById(contentId: number): Promise<ContentResponse> {
    return this.request<ContentResponse>(`/notes/content/${contentId}`);
  }

  // Update content with multipart data
  async updateContent(contentId: number, data: UpdateContentRequest): Promise<string> {
    const formData = new FormData();
    formData.append('content_title', data.content_title);
    formData.append('subject_id', data.subject_id.toString());
    
    if (data.content_text) {
      formData.append('content_text', data.content_text);
    }
    if (data.content_pdf) {
      formData.append('content_pdf', data.content_pdf);
    }
    if (data.content_image) {
      formData.append('content_image', data.content_image);
    }

    const url = `${API_BASE_URL}/notes/content/${contentId}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        // Don't set Content-Type header for FormData, let browser set it
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Update content failed:', error);
      throw error;
    }
  }

  // Delete content by ID
  async deleteContent(contentId: number): Promise<string> {
    return this.request<string>(`/notes/content/${contentId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;

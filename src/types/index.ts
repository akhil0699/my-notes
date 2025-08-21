export interface Course {
  id: string;
  name: string;
  image: string;
  subjects: Subject[];
  createdAt: Date;
}

// API response interfaces
export interface ApiCourse {
  course_name: string;
  id: number;
  course_image: string;
}

export interface ApiSubject {
  subject_name: string;
  course_id: number;
  id: number;
  subject_image: string;
}

export interface ApiContent {
  content_title: string;
  content_text: string;
  subject_id: number;
  id: number;
  content_pdf: string;
  content_image: string;
}

export interface Subject {
  id: string;
  name: string;
  image: string;
  courseId: string;
  contents: Content[];
  createdAt: Date;
}

export interface Content {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  createdAt: Date;
  updatedAt: Date;
}


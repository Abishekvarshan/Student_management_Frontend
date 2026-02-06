
export enum AppTab {
  DASHBOARD = 'dashboard',
  STUDENTS = 'students',
  LECTURERS = 'lecturers',
  COURSES = 'courses'
}

export interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  enrollmentDate: string;
  major: string;
  gpa: number;
  status: 'Active' | 'On Leave' | 'Graduated';
}

export interface Lecturer {
  id: string;
  name: string;
  department: string;
  email: string;
  specialization: string;
  courses: string[];
  rating: number;
}

/**
 * Backend model: `lectures` table
 * - name, department, rating, subjects (collection), codes (collection), contact
 */
export interface Lecture {
  id: string;
  name: string;
  department: string;
  rating: number;
  subjects: string[];
  codes: string[];
  contact: string;
}


export interface DashboardStats {
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  avgAttendance: string;
}


export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  description: string;
  duration: string;
}


export interface CreateCourseDTO {
  courseCode: string;
  courseName: string;
  credits: number;
  description: string;
  duration: string;
}
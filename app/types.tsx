
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
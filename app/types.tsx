
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

export interface Course {
  id: string;
  title: string;
  code: string;
  credits: number;
  instructor: string;
  enrolled: number;
  category: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  avgAttendance: string;
}

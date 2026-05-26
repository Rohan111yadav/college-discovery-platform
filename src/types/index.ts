import { College as PrismaCollege, Course as PrismaCourse } from "@prisma/client";

export type College = PrismaCollege;
export type Course = PrismaCourse;

export interface CollegeWithCourses extends College {
  courses: Course[];
}

export interface CollegeWithCount extends College {
  _count?: {
    courses: number;
  };
}

export interface ComparisonWithColleges {
  id: string;
  collegeIds: string[];
  colleges: CollegeWithCourses[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CollegesResponse {
  colleges: CollegeWithCount[];
  pagination: PaginationInfo;
}

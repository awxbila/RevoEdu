export type MockEnrollment = {
  id: number;
  studentId: number;
  courseId: number;
  semester: string;
  status: string;
  enrolledAt: string;
};

import { mockCourses } from "../mockCourses";

// In-memory mock data for enrollments
export const mockEnrollments: MockEnrollment[] = [
  {
    id: 1,
    studentId: 3,
    courseId: 101,
    semester: "ganjil",
    status: "Aktif",
    enrolledAt: "2025-01-01",
  },
  {
    id: 2,
    studentId: 3,
    courseId: 102,
    semester: "ganjil",
    status: "Aktif",
    enrolledAt: "2025-01-01",
  },
];

export function addEnrollment(
  studentId: number,
  courseId: number,
  semester: string = "ganjil"
) {
  const nextId = Math.max(0, ...mockEnrollments.map((e) => e.id)) + 1;
  const newEnrollment: MockEnrollment = {
    id: nextId,
    studentId,
    courseId,
    semester,
    status: "Aktif",
    enrolledAt: new Date().toISOString().slice(0, 10),
  };
  mockEnrollments.push(newEnrollment);
  console.log(
    `[DEBUG] addEnrollment: student ${studentId} enrolled in course ${courseId}`
  );
  return newEnrollment;
}

export function updateEnrollmentSemester(id: number, semester: string) {
  const enrollment = mockEnrollments.find((e) => e.id === id);
  if (!enrollment) return null;
  enrollment.semester = semester;
  console.log(
    `[DEBUG] updateEnrollmentSemester: enrollment ${id} -> ${semester}`
  );
  return enrollment;
}

export function getEnrollmentWithCourse() {
  return mockEnrollments.map((e) => ({
    ...e,
    course: mockCourses.find((c) => c.id === e.courseId),
  }));
}

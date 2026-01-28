import { promises as fs } from "fs";
import path from "path";

export type StoredEnrollment = {
  id: number;
  studentId: number;
  courseId: number;
  semester: string;
  status: string;
  enrolledAt: string;
};

const ENROLLMENTS_FILE = path.join(
  process.cwd(),
  "app/api/enrollments/enrollments.json"
);

let cachedEnrollments: StoredEnrollment[] | null = null;

// Default enrollments untuk student ID 3
const defaultEnrollments: StoredEnrollment[] = [
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

async function loadEnrollments(): Promise<StoredEnrollment[]> {
  if (cachedEnrollments) return cachedEnrollments;

  try {
    const data = await fs.readFile(ENROLLMENTS_FILE, "utf-8");
    cachedEnrollments = JSON.parse(data) as StoredEnrollment[];
    console.log(
      `[enrollmentsStorage] Loaded ${cachedEnrollments.length} enrollments from file`
    );
    return cachedEnrollments;
  } catch (err) {
    // File doesn't exist, use defaults
    cachedEnrollments = [...defaultEnrollments];
    console.log(
      `[enrollmentsStorage] File not found, using ${cachedEnrollments.length} default enrollments`
    );
    return cachedEnrollments;
  }
}

async function saveEnrollments(enrollments: StoredEnrollment[]): Promise<void> {
  try {
    await fs.writeFile(ENROLLMENTS_FILE, JSON.stringify(enrollments, null, 2));
    cachedEnrollments = enrollments;
    console.log(
      `[enrollmentsStorage] Saved ${enrollments.length} enrollments to file`
    );
  } catch (err) {
    console.error("[enrollmentsStorage] Failed to save enrollments:", err);
  }
}

export async function getAllEnrollments(): Promise<StoredEnrollment[]> {
  return loadEnrollments();
}

export async function getEnrollmentsByUserId(
  userId: number
): Promise<StoredEnrollment[]> {
  const enrollments = await loadEnrollments();
  return enrollments.filter((e) => e.studentId === userId);
}

export async function addEnrollmentPersistent(
  studentId: number,
  courseId: number,
  semester: string = "ganjil"
): Promise<StoredEnrollment> {
  const enrollments = await loadEnrollments();
  const nextId = Math.max(0, ...enrollments.map((e) => e.id)) + 1;

  const newEnrollment: StoredEnrollment = {
    id: nextId,
    studentId,
    courseId,
    semester,
    status: "Aktif",
    enrolledAt: new Date().toISOString().slice(0, 10),
  };

  enrollments.push(newEnrollment);
  await saveEnrollments(enrollments);

  console.log(
    `[enrollmentsStorage] Added enrollment: student ${studentId} -> course ${courseId}`
  );
  return newEnrollment;
}

export async function updateEnrollmentSemesterPersistent(
  id: number,
  semester: string
): Promise<StoredEnrollment | null> {
  const enrollments = await loadEnrollments();
  const enrollment = enrollments.find((e) => e.id === id);

  if (!enrollment) return null;

  enrollment.semester = semester;
  await saveEnrollments(enrollments);

  console.log(
    `[enrollmentsStorage] Updated enrollment ${id} semester to ${semester}`
  );
  return enrollment;
}

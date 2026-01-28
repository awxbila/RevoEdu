export type MockAssignment = {
  id: number;
  title: string;
  description?: string;
  courseId?: number;
  isSubmitted?: boolean;
  brief?: string;
  dueDate?: string;
};

// Simple in-memory store so submissions can mark assignments submitted
export const mockAssignments: MockAssignment[] = [
  {
    id: 1,
    title: "Membuat Halaman Login",
    description: "Buat halaman login dengan validasi form",
    courseId: 101,
    course: { id: 101, title: "Web Development Basics" },
    isSubmitted: false,
    brief:
      "Buat halaman login dengan email dan password. Gunakan form validation untuk memastikan input valid.",
    dueDate: "2026-02-15",
  },
  {
    id: 2,
    title: "Implementasi Database",
    description: "Desain dan implementasi database untuk LMS",
    courseId: 101,
    course: { id: 101, title: "Web Development Basics" },
    isSubmitted: false,
    brief:
      "Desain database schema dengan tabel untuk users, assignments, submissions, dan courses.",
    dueDate: "2026-01-20",
  },
  {
    id: 3,
    title: "API REST Development",
    description: "Buat REST API endpoints untuk sistem",
    courseId: 102,
    course: { id: 102, title: "Backend Development" },
    isSubmitted: false,
    brief:
      "Implementasikan REST API dengan endpoints untuk CRUD assignments dan submissions.",
    dueDate: "2026-02-10",
  },
  {
    id: 4,
    title: "Frontend Testing",
    description: "Implementasi unit testing untuk komponen React",
    courseId: 102,
    course: { id: 102, title: "Backend Development" },
    isSubmitted: false,
    brief:
      "Buat unit test untuk komponen utama menggunakan Jest dan React Testing Library.",
    dueDate: "2026-01-28",
  },
];

export function markAssignmentSubmitted(assignmentId: string | number) {
  const idNum = Number(assignmentId);
  console.log(`[MOCK] Marking assignment ${idNum} as submitted`);
  const target = mockAssignments.find((a) => Number(a.id) === idNum);
  if (target) {
    console.log(
      `[MOCK] Found assignment: ${target.title}, setting isSubmitted=true`
    );
    target.isSubmitted = true;
  } else {
    console.log(`[MOCK] Assignment ${idNum} not found in mockAssignments`);
  }
  console.log(
    `[MOCK] Current state:`,
    mockAssignments.map((a) => ({
      id: a.id,
      title: a.title,
      isSubmitted: a.isSubmitted,
    }))
  );
}

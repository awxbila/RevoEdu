export type MockCourse = {
  id: number;
  title: string;
  description?: string;
  code?: string;
  lecturer?: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
  };
  imageUrl?: string;
  thumbnail?: string;
  deadline?: string; // ISO date string
};

export const mockCourses: MockCourse[] = [
  {
    id: 101,
    title: "Web Development Basics",
    description: "Dasar-dasar web development dengan HTML, CSS, JavaScript",
    code: "WEB-101",
    lecturer: {
      id: 1,
      name: "Dr. Budi Santoso",
      email: "budi@example.com",
      phone: "081234567890",
    },
    deadline: "2026-02-10T23:59:59Z",
  },
  {
    id: 102,
    title: "Backend Development",
    description: "Pengembangan backend dengan Node.js dan Express",
    code: "BACK-102",
    lecturer: {
      id: 2,
      name: "Prof. Adi Wijaya",
      email: "adi@example.com",
      phone: "082345678901",
    },
    deadline: "2026-02-15T23:59:59Z",
  },
  {
    id: 103,
    title: "Database Design",
    description: "Desain dan implementasi database relasional",
    code: "DB-103",
    lecturer: {
      id: 3,
      name: "Dr. Citra Rahma",
      email: "citra@example.com",
      phone: "083456789012",
    },
    deadline: "2026-02-20T23:59:59Z",
  },
];

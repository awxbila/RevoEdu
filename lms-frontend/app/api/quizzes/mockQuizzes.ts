export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
};

export type Quiz = {
  id: string;
  title: string;
  courseId: string;
  courseName?: string;
  questions: Question[];
  deadline?: string; // ISO date string
};

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Quiz HTML & CSS Basics",
    courseId: "101",
    courseName: "Web Development Basics",
    deadline: "2026-02-10T23:59:59Z",
    questions: [
      {
        id: "1-1",
        question: "Apa kepanjangan dari HTML?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
        ],
        correctAnswer: 0,
      },
      {
        id: "1-2",
        question:
          "Tag HTML mana yang digunakan untuk membuat heading terbesar?",
        options: ["<head>", "<h6>", "<heading>", "<h1>"],
        correctAnswer: 3,
      },
      {
        id: "1-3",
        question: "Properti CSS mana yang mengubah warna teks?",
        options: ["text-color", "color", "font-color", "text-style"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "2",
    title: "Quiz JavaScript Fundamentals",
    courseId: "101",
    courseName: "Web Development Basics",
    deadline: "2026-01-10T23:59:59Z", // overdue (lewat dari hari ini)
    questions: [
      {
        id: "2-1",
        question:
          "Keyword mana yang digunakan untuk mendeklarasikan variabel di JavaScript?",
        options: ["var", "let", "const", "Semua benar"],
        correctAnswer: 3,
      },
      {
        id: "2-2",
        question: "Apa output dari: typeof []?",
        options: ["array", "object", "null", "undefined"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "3",
    title: "Quiz Node.js Basics",
    courseId: "102",
    courseName: "Backend Development",
    deadline: "2026-02-15T23:59:59Z",
    questions: [
      {
        id: "3-1",
        question: "Apa fungsi dari package.json?",
        options: [
          "Menyimpan dependencies project",
          "File konfigurasi Node.js",
          "File untuk routing",
          "File untuk database",
        ],
        correctAnswer: 0,
      },
      {
        id: "3-2",
        question: "Middleware di Express.js berfungsi untuk?",
        options: [
          "Mengolah request sebelum mencapai route handler",
          "Menyimpan data ke database",
          "Membuat tampilan UI",
          "Kompilasi kode JavaScript",
        ],
        correctAnswer: 0,
      },
      {
        id: "3-3",
        question: "HTTP method mana yang digunakan untuk mengambil data?",
        options: ["POST", "PUT", "GET", "DELETE"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "4",
    title: "Quiz Database Fundamentals",
    courseId: "103",
    courseName: "Database Design",
    deadline: "2026-02-20T23:59:59Z",
    questions: [
      {
        id: "4-1",
        question: "Apa kepanjangan dari SQL?",
        options: [
          "Structured Query Language",
          "Simple Question Language",
          "Standard Quality Language",
          "System Query Logic",
        ],
        correctAnswer: 0,
      },
      {
        id: "4-2",
        question: "Primary key dalam database berfungsi untuk?",
        options: [
          "Mengidentifikasi record secara unik",
          "Menyimpan password",
          "Membuat index otomatis",
          "Menghubungkan ke server",
        ],
        correctAnswer: 0,
      },
      {
        id: "4-3",
        question: "Perintah SQL untuk mengambil semua data dari tabel users?",
        options: [
          "GET * FROM users",
          "SELECT * FROM users",
          "FETCH * FROM users",
          "RETRIEVE * FROM users",
        ],
        correctAnswer: 1,
      },
      {
        id: "4-4",
        question: "Apa yang dimaksud dengan normalisasi database?",
        options: [
          "Proses mengatur data untuk mengurangi redundansi",
          "Proses backup database",
          "Proses enkripsi data",
          "Proses kompresi data",
        ],
        correctAnswer: 0,
      },
    ],
  },
];

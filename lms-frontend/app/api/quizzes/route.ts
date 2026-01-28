import { NextRequest, NextResponse } from "next/server";

type Quiz = {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  deadline: string;
  duration: number;
  totalQuestions: number;
  status: string;
};

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Quiz HTML & CSS Basics",
    courseId: "101",
    courseName: "Web Development Basics",
    deadline: "2026-02-15",
    duration: 30,
    totalQuestions: 10,
    status: "available",
  },
  {
    id: "2",
    title: "Quiz JavaScript Fundamentals",
    courseId: "101",
    courseName: "Web Development Basics",
    deadline: "2026-02-20",
    duration: 45,
    totalQuestions: 15,
    status: "available",
  },
  {
    id: "3",
    title: "Quiz Node.js Basics",
    courseId: "102",
    courseName: "Backend Development",
    deadline: "2026-02-18",
    duration: 40,
    totalQuestions: 12,
    status: "available",
  },
];

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(mockQuizzes);
}

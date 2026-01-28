import { NextRequest, NextResponse } from "next/server";
import { mockCourses } from "../mockCourses";

export async function GET(request: NextRequest) {
  // Get token from request header
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(mockCourses);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, code } = body;

  // Create new course object
  const newCourse = {
    id: Math.max(...mockCourses.map((c) => c.id), 0) + 1,
    title: title || "Untitled Course",
    description: description || "",
    code: code || "",
    lecturer: {
      id: 1,
      name: "Lecturer Name",
      email: "lecturer@example.com",
      phone: "081234567890",
    },
  };

  // Add to mock data (in real app, save to database)
  mockCourses.push(newCourse);

  return NextResponse.json(newCourse, { status: 201 });
}

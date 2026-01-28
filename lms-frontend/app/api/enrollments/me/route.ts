import { NextRequest, NextResponse } from "next/server";
import { mockCourses } from "../../mockCourses";
import { getEnrollmentsByUserId } from "../enrollmentsStorage";

function extractUserIdFromToken(authHeader?: string | null): number | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.substring(7);
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload?.sub ? parseInt(payload.sub, 10) : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const userId = extractUserIdFromToken(authHeader);
  console.log(`[GET /api/enrollments/me] userId from token: ${userId}`);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await getEnrollmentsByUserId(userId);
  const withCourse = enrollments.map((e) => ({
    ...e,
    course: mockCourses.find((c) => c.id === e.courseId) ?? null,
  }));
  console.log(`[GET /api/enrollments/me] filtered enrollments:`, withCourse);
  return NextResponse.json(withCourse);
}

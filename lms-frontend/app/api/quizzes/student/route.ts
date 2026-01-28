import { NextRequest, NextResponse } from "next/server";
import { getEnrollmentsByUserId } from "../../enrollments/enrollmentsStorage";
import { mockQuizzes } from "../mockQuizzes";

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

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Get user's enrollments
  const enrollments = await getEnrollmentsByUserId(userId);
  const enrolledCourseIds = enrollments.map((e) => String(e.courseId));

  // Filter quizzes by enrolled courses and map questionCount
  const filteredQuizzes = mockQuizzes
    .filter((q) => enrolledCourseIds.includes(q.courseId))
    .map((q) => ({
      ...q,
      questionCount: q.questions.length,
      isCompleted: false,
    }));

  return NextResponse.json(filteredQuizzes);
}

import { NextRequest, NextResponse } from "next/server";
import {
  getAllEnrollments,
  addEnrollmentPersistent,
  updateEnrollmentSemesterPersistent,
} from "./enrollmentsStorage";

export async function GET(request: NextRequest) {
  // Get token from request header
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const enrollments = await getAllEnrollments();
  return NextResponse.json(enrollments);
}

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

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const userId = extractUserIdFromToken(authHeader);
  console.log(`[POST /api/enrollments] userId from token: ${userId}`);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const courseId = Number(body?.courseId);
    const semester = body?.semester || "ganjil";
    console.log(
      `[POST /api/enrollments] courseId: ${courseId}, semester: ${semester}`,
    );
    if (!courseId) {
      return NextResponse.json(
        { message: "courseId wajib diisi" },
        { status: 400 },
      );
    }
    const created = await addEnrollmentPersistent(userId, courseId, semester);
    console.log(`[POST /api/enrollments] created:`, created);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log(`[POST /api/enrollments] error:`, error);
    return NextResponse.json(
      { message: "Gagal menambah enrollment" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const userId = extractUserIdFromToken(authHeader);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : undefined;
  if (!id) {
    return NextResponse.json(
      { message: "id enrollment wajib" },
      { status: 400 },
    );
  }
  try {
    const body = await request.json();
    const semester = body?.semester;
    if (!semester) {
      return NextResponse.json({ message: "semester wajib" }, { status: 400 });
    }
    const updated = await updateEnrollmentSemesterPersistent(id, semester);
    if (!updated) {
      return NextResponse.json(
        { message: "Enrollment tidak ditemukan" },
        { status: 404 },
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal update enrollment" },
      { status: 500 },
    );
  }
}

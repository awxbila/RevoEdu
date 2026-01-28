import { NextRequest, NextResponse } from "next/server";
import { updateEnrollmentSemesterPersistent } from "../enrollmentsStorage";

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

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const authHeader = request.headers.get("authorization");
  const userId = extractUserIdFromToken(authHeader);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = Number(context.params.id);
  if (!id) {
    return NextResponse.json(
      { message: "id enrollment wajib" },
      { status: 400 }
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
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal update enrollment" },
      { status: 500 }
    );
  }
}

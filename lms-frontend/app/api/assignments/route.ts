import { NextRequest, NextResponse } from "next/server";
import { mockAssignments } from "../mockData";

export async function GET(request: NextRequest) {
  // Get token from request header
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(mockAssignments);
}

export async function POST(request: NextRequest) {
  // Get token from request header
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, courseId, dueDate, code, brief } = body;

    if (!title || !courseId) {
      return NextResponse.json(
        { message: "title dan courseId harus diisi" },
        { status: 400 }
      );
    }

    // Create new assignment
    const newAssignment = {
      id: Math.max(...mockAssignments.map((a) => a.id), 0) + 1,
      title,
      courseId,
      isSubmitted: false,
      dueDate: dueDate || undefined,
      code: code || undefined,
      brief: brief || undefined,
    };

    mockAssignments.push(newAssignment);

    console.log(
      `[MOCK] Created assignment: ${newAssignment.id} - ${title}` +
        (dueDate ? ` (deadline: ${dueDate})` : "") +
        (brief ? ` (with brief)` : "")
    );

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error("[MOCK] Error creating assignment:", error);
    return NextResponse.json(
      { message: "Gagal membuat assignment" },
      { status: 500 }
    );
  }
}

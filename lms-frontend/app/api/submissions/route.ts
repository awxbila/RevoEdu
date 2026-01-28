import { NextRequest, NextResponse } from "next/server";
import { markAssignmentSubmitted } from "../mockData";
// Mock in-memory submissions array
const mockSubmissions = [
  {
    id: 1,
    assignmentId: 1,
    studentId: 3,
    fileName: "login.pdf",
    submittedAt: "2026-01-25T10:00:00Z",
  },
  {
    id: 2,
    assignmentId: 2,
    studentId: 4,
    fileName: "db.docx",
    submittedAt: "2026-01-26T12:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  // Get token from request header
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(mockSubmissions);
}

export async function POST(request: NextRequest) {
  // Get token from request header
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const assignmentIdEntry = formData.get("assignmentId");
    const file = formData.get("file");

    // Validate assignmentId as string (FormData can return File | string)
    if (typeof assignmentIdEntry !== "string" || !assignmentIdEntry.trim()) {
      return NextResponse.json(
        { message: "assignmentId tidak valid" },
        { status: 400 },
      );
    }

    // Ensure a file is provided and is a File
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "File harus dikirim" },
        { status: 400 },
      );
    }

    console.log(
      `[MOCK] File submission: Assignment ID=${assignmentIdEntry}, File: ${file.name}`,
    );

    // Mark assignment as submitted in the in-memory store
    console.log(
      `[MOCK] Calling markAssignmentSubmitted with ID: ${Number(
        assignmentIdEntry,
      )}`,
    );
    markAssignmentSubmitted(Number(assignmentIdEntry));

    // Mock success response
    return NextResponse.json(
      {
        id: Math.floor(Math.random() * 10000),
        assignmentId: assignmentIdEntry,
        studentId: 1,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal memproses submission" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAllEnrollments } from "../../enrollmentsStorage";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const id = Number(context.params.id);
  if (!id) {
    return NextResponse.json(
      { message: "id enrollment wajib" },
      { status: 400 },
    );
  }
  // Cari enrollment
  const enrollments = await getAllEnrollments();
  const enrollment = enrollments.find((e) => e.id === id);
  if (!enrollment) {
    return NextResponse.json(
      { message: "Enrollment tidak ditemukan" },
      { status: 404 },
    );
  }
  // Cari student
  const usersPath = path.join(process.cwd(), "app/api/auth/users.json");
  let users: any[] = [];
  try {
    const data = await fs.readFile(usersPath, "utf-8");
    users = JSON.parse(data);
  } catch {
    return NextResponse.json({ message: "Gagal baca users" }, { status: 500 });
  }
  const student = users.find((u) => u.id === enrollment.studentId);
  if (!student) {
    return NextResponse.json(
      { message: "Student tidak ditemukan" },
      { status: 404 },
    );
  }
  // Hanya return info dasar student
  return NextResponse.json({
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone || null,
  });
}

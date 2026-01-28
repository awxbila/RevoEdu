import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  const courseId = context.params.id;
  if (!courseId) {
    return NextResponse.json(
      { message: "courseId tidak valid" },
      { status: 400 },
    );
  }
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/modules`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ message: err }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Internal error" },
      { status: 500 },
    );
  }
}

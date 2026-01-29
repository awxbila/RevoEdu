import { NextRequest, NextResponse } from "next/server";
import users from "../users.json";

export async function GET(request: NextRequest) {
  // Get token from request header
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(users);
}

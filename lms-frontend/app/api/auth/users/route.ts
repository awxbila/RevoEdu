import { NextRequest, NextResponse } from "next/server";

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
const USERS_FILE = path.join(process.cwd(), "app/api/auth/users.json");
import users from "../users.json";

export async function GET(request: NextRequest) {
  // Get token from request header
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(users);
}

// PATCH: update profile (name, phone, etc)
export async function PATCH(request: NextRequest) {
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, name, phone } = body;
  if (!id) {
    return NextResponse.json({ message: "Missing user id" }, { status: 400 });
  }
  let usersArr = users;
  const idx = usersArr.findIndex((u: any) => u.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (name !== undefined) usersArr[idx].name = name;
  if (phone !== undefined) usersArr[idx].phone = phone;
  await fs.writeFile(USERS_FILE, JSON.stringify(usersArr, null, 2));
  return NextResponse.json(usersArr[idx]);
}

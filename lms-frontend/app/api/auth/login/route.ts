import { NextResponse } from "next/server";
import { findUserByEmail } from "../usersStorage";

// Simple JWT-like token creator (base64 encoded for mock)
function createMockJWT(userId: number, email: string, role: string) {
  const payload = {
    sub: userId.toString(),
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  };
  const encoded = btoa(JSON.stringify(payload));
  return `${btoa(JSON.stringify({ alg: "none", typ: "JWT" }))}.${encoded}.mock`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(body?.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user || user.password !== password) {
      console.log(
        `[DEBUG] Login failed: user found=${!!user}, pwd match=${
          user ? user.password === password : "N/A"
        }`
      );
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    console.log(`[DEBUG] Login success for user #${user.id}`);
    const accessToken = createMockJWT(user.id, user.email, user.role);

    return NextResponse.json({
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: "Login gagal" }, { status: 500 });
  }
}

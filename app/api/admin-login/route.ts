import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const adminUser = process.env.ADMIN_USER || "";
  const adminPass = process.env.ADMIN_PASS || "";
  if (username === adminUser && password === adminPass) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });
}

import { adminAuth } from "../../lib/firebaseAdmin";
import { UserRecord } from "firebase-admin/auth";

export async function GET() {
  try {
    // Kiểm tra kết nối Firebase Admin
    await adminAuth.getUserByEmail("test@test.com").catch(() => {}); // Chỉ để test kết nối, có thể không tồn tại email này
    const listUsers = await adminAuth.listUsers();
    const users = listUsers.users.map((u: UserRecord) => ({
      id: u.uid,
      name: u.displayName || "(Chưa đặt tên)",
      email: u.email || "",
      lastLogin: u.metadata.lastSignInTime || ""
    }));
    console.log("Kết nối Firebase Admin thành công, số lượng user:", users.length);
    return Response.json({ success: true, users });
  } catch (err) {
    console.error("Lỗi kết nối Firebase Admin:", err);
    return Response.json({ success: false, error: "Không kết nối được Firebase Admin" }, { status: 500 });
  }
}

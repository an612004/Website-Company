"use client";
import { useEffect, useState } from "react";

export default function UserPage() {
    type User = {
        id: number;
        name: string;
        email: string;
        lastLogin: string;
    };
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data.users || []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Danh sách người dùng đã đăng ký & đăng nhập</h2>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">#</th>
                            <th className="border px-4 py-2">Tên</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Lần đăng nhập cuối</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <tr key={user.id} className="hover:bg-blue-50">
                                <td className="border px-4 py-2">{idx + 1}</td>
                                <td className="border px-4 py-2">{user.name}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2">{user.lastLogin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
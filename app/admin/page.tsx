
"use client";
import { useState, useEffect } from "react";
import Sidebar from "../admin/components/ui/Sidebar";

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsLoggedIn(document.cookie.includes("admin_logged_in=true"));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                document.cookie = "admin_logged_in=true; path=/; max-age=" + 60 * 60 * 24;
                setIsLoggedIn(true);
            } else {
                setError(data.error || "Sai tài khoản hoặc mật khẩu");
            }
        } catch (err) {
            setError("Lỗi kết nối server");
        }
        setLoading(false);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6"
                >
                    <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">Đăng nhập Admin</h1>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="font-medium">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="font-medium">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <Sidebar />
        </div>
    );
}
"use client";
import Link from "next/link";
// **🚨 Cần đảm bảo component này là Client Component**
// Nếu không, bạn phải thêm dòng sau ở đầu file: "use client"; 
import { usePathname } from 'next/navigation';
import {
    Settings,
    LayoutDashboard,
    Users,
    Newspaper,
    Mail,
} from 'lucide-react';

// Thêm dòng này vào đầu file nếu component này được đặt trong thư mục 'app' (App Router)
// Component Sidebar cần là Client Component để sử dụng hook usePathname
// "use client"; // <--- Bỏ comment dòng này nếu cần thiết

export default function Sidebar() {
    // 💡 SỬ DỤNG HOOK ĐỂ LẤY ĐƯỜNG DẪN HIỆN TẠI
    const currentPath = usePathname();

    // Định nghĩa cấu trúc menu
    const menuItems = [
        {
            href: "/admin/giao-dien",
            icon: LayoutDashboard,
            label: "Quản lý giao diện",
        },
        {
            href: "/admin/user",
            icon: Users,
            label: "Người dùng web",
        },
        {
            href: "/admin/tin-tuc",
            icon: Newspaper,
            label: "Tin tức",
        },
        {
            href: "/admin/lien-he",
            icon: Mail,
            label: "Liên hệ",
        },
    ];

    // --- LOGIC HIỂN THỊ ---

    // Hàm kiểm tra đường dẫn (xử lý cả trường hợp path có / cuối cùng hoặc không)
    const isActiveLink = (href: string) => {
        // Kiểm tra đường dẫn chính xác
        if (currentPath === href) {
            return true;
        }
        // Kiểm tra các đường dẫn con (nếu cần) - ví dụ: /admin/tin-tuc/abc
        // Hiện tại ta chỉ kiểm tra đường dẫn gốc (exact match)
        return false;
    };


    return (
        <aside className="w-64 h-screen bg-gray-900 border-r border-gray-700 p-4 flex flex-col">
            <div className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                Admin Panel
            </div>

            <nav className="flex flex-col gap-1">
                {menuItems.map((item) => {
                    // 🚨 ĐIỀU CHỈNH CHỖ NÀY: Dùng biến currentPath đã lấy được
                    const isActive = isActiveLink(item.href);

                    const linkClasses = `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                        ${isActive
                            ? "bg-blue-600 text-white shadow-md" // Active: Nền xanh đậm, chữ trắng
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }
                    `;

                    const IconComponent = item.icon;
                    const iconClasses = `w-5 h-5 ${isActive ? "text-white" : "text-blue-400"}`;

                    return (
                        <Link key={item.href} href={item.href} className={linkClasses}>
                            <IconComponent className={iconClasses} />
                            <span className="font-medium text-sm">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Phần Cài đặt (Settings) - kiểm tra active state cho mục Cài đặt */}
            <div className="mt-auto pt-4 border-t border-gray-700">
                {(() => {
                    const settingsHref = "/admin/cai-dat";
                    const isSettingsActive = isActiveLink(settingsHref);

                    const settingsLinkClasses = `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                        ${isSettingsActive
                            ? "bg-blue-600 text-white shadow-md" // Active
                            : "text-gray-300 hover:bg-gray-700 hover:text-white" // Inactive
                        }
                    `;

                    return (
                        <Link
                            href={settingsHref}
                            className={settingsLinkClasses}
                        >
                            <Settings className={`w-5 h-5 ${isSettingsActive ? "text-white" : "text-blue-400"}`} />
                            <span className="font-medium text-sm">Cài đặt</span>
                        </Link>
                    );
                })()}
            </div>
        </aside>
    );
}
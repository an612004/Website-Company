"use client";
import React, { useState, Suspense, lazy } from "react";
import {
    Settings,
    LayoutDashboard,
    Users,
    Newspaper,
    Box,
    ShoppingBasket,
    Mail,
} from 'lucide-react';

export default function Sidebar() {
    // State xác định mục đang chọn
    const [activeSection, setActiveSection] = useState("giao-dien");

    // Định nghĩa cấu trúc menu
    const menuItems = [
        {
            key: "giao-dien",
            icon: LayoutDashboard,
            label: "Quản lý giao diện",
        },
        {
            key: "nguoi-dung",
            icon: Users,
            label: "Người dùng web",
        },
        {
            key: "product",
            icon: ShoppingBasket,
            label: "Sản phẩm",
        },
        {
            key: "order",
            icon: Box,
            label: "Đơn hàng",
        },
        {
            key: "tin-tuc",
            icon: Newspaper,
            label: "Tin tức",
        },
        {
            key: "lien-he",
            icon: Mail,
            label: "Liên hệ",
        },
    ];

    // Import động UserPage bằng React.lazy
    const UserPage = lazy(() => import("../../user/page"));
    const ProductPage = lazy(() => import("../../product/page"));

    const renderSectionContent = () => {
        switch (activeSection) {
            case "giao-dien":
                return <div className="p-4">Nội dung Quản lý giao diện ở đây.</div>;
            case "nguoi-dung":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <UserPage />
                    </Suspense>
                );
            case "product":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <ProductPage />
                    </Suspense>
                );
            case "tin-tuc":
                return <div className="p-4">Nội dung Tin tức ở đây.</div>;
            case "lien-he":
                return <div className="p-4">Nội dung Liên hệ ở đây.</div>;
            case "cai-dat":
                return <div className="p-4">Nội dung Cài đặt ở đây.</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar trái */}
            <aside className="w-64 h-screen bg-gray-900 border-r border-gray-700 p-4 flex flex-col">
                <div className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                    Admin Anbi Web
                </div>
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                        const isActive = activeSection === item.key;
                        const linkClasses = `
                            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                            ${isActive
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }
                        `;
                        const IconComponent = item.icon;
                        const iconClasses = `w-5 h-5 ${isActive ? "text-white" : "text-blue-400"}`;
                        return (
                            <button
                                key={item.key}
                                className={linkClasses}
                                onClick={() => setActiveSection(item.key)}
                            >
                                <IconComponent className={iconClasses} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
                {/* Cài đặt */}
                <div className="mt-auto pt-4 border-t border-gray-700">
                    <button
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${activeSection === "cai-dat" ? "bg-blue-600 text-white shadow-md" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                        onClick={() => setActiveSection("cai-dat")}
                    >
                        <Settings className={`w-5 h-5 ${activeSection === "cai-dat" ? "text-white" : "text-blue-400"}`} />
                        <span className="font-medium text-sm">Cài đặt</span>
                    </button>
                </div>
            </aside>
            {/* Container nội dung động bên trái */}
            <div className="flex-1 bg-white">
                {renderSectionContent()}
            </div>
        </div>
    );
}
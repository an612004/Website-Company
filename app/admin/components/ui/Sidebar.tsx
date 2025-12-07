"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import {
    Settings,
    LayoutDashboard,
    Users,
    Newspaper,
    Box,
    Zap,
    ShoppingBasket,
    Mail,
    Receipt,
} from 'lucide-react';

// Import động các page bằng React.lazy - đặt ngoài component để không bị tạo lại mỗi lần render
const UserPage = lazy(() => import("../../user/page"));
const ProductPage = lazy(() => import("../../product/page"));
const InterfaceManagementPage = lazy(() => import("../../interface management/page"));
const ContactPage = lazy(() => import("../../contact/page"));
const WebManagementPage = lazy(() => import("../../web management/page"));
const VoucherPage = lazy(() => import("../../voucher/page"));

export default function Sidebar() {
    // State xác định mục đang chọn
    const [activeSection, setActiveSection] = useState("giao-dien");
    // State đếm số liên hệ mới
    const [newContactCount, setNewContactCount] = useState(0);
    // State ẩn badge khi đã xem
    const [hasViewedContacts, setHasViewedContacts] = useState(false);

    // Fetch số liên hệ mới
    const fetchNewContactCount = async () => {
        // Nếu đã xem rồi thì không fetch nữa
        if (hasViewedContacts) return;

        try {
            const response = await fetch('/api/contacts?status=new&limit=1');
            const data = await response.json();
            if (data.success && data.data.counts) {
                const newCount = data.data.counts.new || 0;
                setNewContactCount(newCount);
            }
        } catch (error) {
            console.error('Error fetching contact count:', error);
        }
    };

    // Fetch khi component mount và mỗi 30 giây (chỉ khi chưa xem)
    useEffect(() => {
        if (!hasViewedContacts) {
            fetchNewContactCount();
            const interval = setInterval(fetchNewContactCount, 30000); // 30 giây
            return () => clearInterval(interval);
        }
    }, [hasViewedContacts]);

    // Khi click vào tab contact, đánh dấu đã xem
    const handleMenuClick = (key: string) => {
        setActiveSection(key);
        if (key === 'contact') {
            setHasViewedContacts(true);
        }
    };

    // Định nghĩa cấu trúc menu
    const menuItems = [
        {
            key: "interface-management",
            icon: LayoutDashboard,
            label: "Quản lý giao diện",
        },
        {
            key: "nguoi-dung",
            icon: Users,
            label: "Quản Lý Người dùng",
        },
        {
            key: "product",
            icon: ShoppingBasket,
            label: "Quản lý Sản phẩm",
        },
        {
            key: "voucher",
            icon: Receipt,
            label: "Quản lý Voucher",
        },
        {
            key: "service",
            icon: Zap,
            label: "Quản lý dịch vụ",
        },
        {
            key: "order",
            icon: Box,
            label: "Quản lý Đơn hàng",
        },
        {
            key: "web-management",
            icon: Box,
            label: "Quản lý Website",
        },
        {
            key: "tin-tuc",
            icon: Newspaper,
            label: "Quản lý Tin tức",
        },
        {
            key: "contact",
            icon: Mail,
            label: "Quản lý Liên hệ",
        },
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case "interface-management":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <InterfaceManagementPage />
                    </Suspense>
                );
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
            case "voucher":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <VoucherPage />
                    </Suspense>
                );
            case "web-management":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <WebManagementPage />
                    </Suspense>
                );
            case "tin-tuc":
                return <div className="p-4">Nội dung Tin tức ở đây.</div>;
            case "contact":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <ContactPage />
                    </Suspense>
                );
            case "cai-dat":
                return <div className="p-4">Nội dung Cài đặt ở đây.</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar trái - Cố định */}
            <aside className="w-64 h-screen bg-gray-900 border-r border-gray-700 p-4 flex flex-col fixed top-0 left-0 overflow-y-auto z-40">
                <div className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                    Admin Anbi Web
                </div>
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                        const isActive = activeSection === item.key;
                        const linkClasses = `
                            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 relative
                            ${isActive
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }
                        `;
                        const IconComponent = item.icon;
                        const iconClasses = `w-5 h-5 ${isActive ? "text-white" : "text-blue-400"}`;
                        // Chỉ hiện badge nếu có liên hệ mới VÀ chưa xem (không đang ở tab contact)
                        const showBadge = item.key === "contact" && newContactCount > 0 && !hasViewedContacts && activeSection !== "contact";

                        return (
                            <button
                                key={item.key}
                                className={linkClasses}
                                onClick={() => handleMenuClick(item.key)}
                            >
                                <div className="relative">
                                    <IconComponent className={iconClasses} />
                                    {showBadge && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                                            {newContactCount > 99 ? '99+' : newContactCount}
                                        </span>
                                    )}
                                </div>
                                <span className="font-medium text-sm flex-1">{item.label}</span>
                                {showBadge && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                        {newContactCount > 99 ? '99+' : newContactCount}
                                    </span>
                                )}
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
            {/* Container nội dung động bên phải - thêm margin-left để tránh bị che bởi sidebar */}
            <div className="flex-1 bg-white ml-64 min-h-screen overflow-y-auto">
                {renderSectionContent()}
            </div>
        </div>
    );
}
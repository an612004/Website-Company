"use client";
import React, { useState, useEffect, Suspense, lazy, useCallback } from "react";
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
    BookUser,
} from 'lucide-react';

// Import động các page bằng React.lazy - đặt ngoài component để không bị tạo lại mỗi lần render
const UserPage = lazy(() => import("../../user/page"));
const ProductPage = lazy(() => import("../../product/page"));
const InterfaceManagementPage = lazy(() => import("../../interface management/page"));
const ContactPage = lazy(() => import("../../contact/page"));
const WebManagementPage = lazy(() => import("../../web management/page"));
const VoucherPage = lazy(() => import("../../voucher/page"));
const ContactWebPage = lazy(() => import("../../contactWeb/page"));
const BlogsPage = lazy(() => import("../../blogs/page"));
const AboutPage = lazy(() => import("../../about/page"));

export default function Sidebar() {
    // State xác định mục đang chọn
    const [activeSection, setActiveSection] = useState("giao-dien");
    // State thu gọn/mở rộng menu cha
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({ order: false });
    // State đếm số liên hệ mới
    const [newContactCount, setNewContactCount] = useState(0);
    // State đếm số liên hệ web mới
    const [newContactWebCount, setNewContactWebCount] = useState(0);
    // State lưu số liên hệ đã xem (để so sánh) - khởi tạo từ localStorage
    const [viewedContactCount, setViewedContactCount] = useState<number | null>(null);
    const [viewedContactWebCount, setViewedContactWebCount] = useState<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load từ localStorage khi component mount
    useEffect(() => {
        const savedContactViewed = localStorage.getItem('viewedContactCount');
        const savedContactWebViewed = localStorage.getItem('viewedContactWebCount');

        if (savedContactViewed !== null) {
            setViewedContactCount(parseInt(savedContactViewed, 10));
        }
        if (savedContactWebViewed !== null) {
            setViewedContactWebCount(parseInt(savedContactWebViewed, 10));
        }
        setIsInitialized(true);
    }, []);

    // Fetch số liên hệ mới
    const fetchNewContactCount = useCallback(async () => {
        try {
            const response = await fetch('/api/contacts?status=new&limit=1');
            const data = await response.json();
            if (data.success && data.data?.counts) {
                const newCount = data.data.counts.new || 0;
                setNewContactCount(newCount);
            }
        } catch (error) {
            console.error('Error fetching contact count:', error);
        }
    }, []);

    // Fetch số liên hệ web mới
    const fetchNewContactWebCount = useCallback(async () => {
        try {
            const response = await fetch('/api/contact-web?status=new&limit=1');
            const data = await response.json();
            if (data.success && data.counts) {
                const newCount = data.counts.new || 0;
                setNewContactWebCount(newCount);
            }
        } catch (error) {
            console.error('Error fetching contact web count:', error);
        }
    }, []);

    // Polling liên tục để cập nhật real-time (mỗi 5 giây)
    useEffect(() => {
        // Fetch ngay khi mount
        fetchNewContactCount();
        fetchNewContactWebCount();

        // Polling mỗi 5 giây để cập nhật real-time
        const interval = setInterval(() => {
            fetchNewContactCount();
            fetchNewContactWebCount();
        }, 5000); // 5 giây

        return () => clearInterval(interval);
    }, [fetchNewContactCount, fetchNewContactWebCount]);

    // Khi click vào tab contact, lưu số lượng hiện tại (đánh dấu đã xem) vào localStorage
    const handleMenuClick = (key: string) => {
        setActiveSection(key);
        if (key === 'contact') {
            setViewedContactCount(newContactCount);
            localStorage.setItem('viewedContactCount', newContactCount.toString());
        }
        if (key === 'contact-web') {
            setViewedContactWebCount(newContactWebCount);
            localStorage.setItem('viewedContactWebCount', newContactWebCount.toString());
        }
    };

    // Xử lý thu gọn/mở rộng menu cha
    const handleParentMenuToggle = (key: string) => {
        setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
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
            children: [
                { key: "order-service", label: "Đơn hàng dịch vụ" },
                { key: "order-hardware", label: "Đơn hàng phần cứng" },
                { key: "order-software", label: "Đơn hàng phần mềm" },
            ],
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
        {
            key: "contact-web",
            icon: Mail,
            label: "Quản lý Liên hệ Web",
        },
        {
            key: "about",
            icon: BookUser,
            label: "Quản lý trang giới thiệu",
        },
    ];

    // Import động các trang đơn hàng
    const ServiceOrdersPage = lazy(() => import("../../orders/service/page"));
    const HardwareOrdersPage = lazy(() => import("../../orders/hardware/page"));
    const SoftwareOrdersPage = lazy(() => import("../../orders/software/page"));

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
            case "order-service":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <ServiceOrdersPage />
                    </Suspense>
                );
            case "order-hardware":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <HardwareOrdersPage />
                    </Suspense>
                );
            case "order-software":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <SoftwareOrdersPage />
                    </Suspense>
                );
            case "web-management":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <WebManagementPage />
                    </Suspense>
                );
            case "tin-tuc":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <BlogsPage />
                    </Suspense>
                );
            case "contact":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <ContactPage />
                    </Suspense>
                );
            case "contact-web":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <ContactWebPage />
                    </Suspense>
                );
            case "about":
                return (
                    <Suspense fallback={<div>Đang tải...</div>}>
                        <AboutPage />
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
                        if (!item.children) {
                            // Mục không có menu con
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
                            // ...badge logic giữ nguyên...
                            let badgeCount = 0;
                            if (isInitialized) {
                                if (item.key === "contact") {
                                    if (viewedContactCount === null) {
                                        badgeCount = newContactCount;
                                    } else if (newContactCount > viewedContactCount) {
                                        badgeCount = newContactCount - viewedContactCount;
                                    }
                                } else if (item.key === "contact-web") {
                                    if (viewedContactWebCount === null) {
                                        badgeCount = newContactWebCount;
                                    } else if (newContactWebCount > viewedContactWebCount) {
                                        badgeCount = newContactWebCount - viewedContactWebCount;
                                    }
                                }
                            }
                            const shouldShowBadge = badgeCount > 0 && activeSection !== item.key;
                            return (
                                <button
                                    key={item.key}
                                    className={linkClasses}
                                    onClick={() => handleMenuClick(item.key)}
                                >
                                    <div className="relative">
                                        <IconComponent className={iconClasses} />
                                        {shouldShowBadge && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                                                {badgeCount > 99 ? '99+' : badgeCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-medium text-sm flex-1">{item.label}</span>
                                    {shouldShowBadge && (
                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                            {badgeCount > 99 ? '99+' : badgeCount}
                                        </span>
                                    )}
                                </button>
                            );
                        } else {
                            // Mục có menu con (ví dụ: Đơn hàng)
                            const isParentActive = item.children.some(child => activeSection === child.key);
                            const isOpen = openMenus[item.key] || isParentActive;
                            const linkClasses = `
                                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 relative cursor-pointer
                                ${isParentActive
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }
                            `;
                            const IconComponent = item.icon;
                            const iconClasses = `w-5 h-5 ${isParentActive ? "text-white" : "text-blue-400"}`;
                            return (
                                <div key={item.key}>
                                    <div className={linkClasses} onClick={() => handleParentMenuToggle(item.key)}>
                                        <IconComponent className={iconClasses} />
                                        <span className="font-medium text-sm flex-1">{item.label}</span>
                                        <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                    {isOpen && (
                                        <div className="ml-7 flex flex-col gap-1 mt-1">
                                            {item.children.map(child => {
                                                const isActive = activeSection === child.key;
                                                return (
                                                    <button
                                                        key={child.key}
                                                        className={`px-3 py-2 rounded-lg text-left transition-colors duration-200 text-sm ${isActive ? "bg-blue-100 text-blue-800 font-bold" : "text-gray-500 hover:bg-gray-200 hover:text-blue-700"}`}
                                                        onClick={() => handleMenuClick(child.key)}
                                                    >
                                                        {child.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }
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
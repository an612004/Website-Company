"use client";
import React, { useRef, useEffect, useState } from "react";
import { FileText, Grid, Calendar, History, Github, ChevronRight, Menu, X, } from 'lucide-react';

export default function Slidebarhandle() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [activeId, setActiveId] = useState(1);

    // 💡 STATE MỚI: Quản lý trạng thái mở/đóng Mobile Sidebar
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        // Giữ nguyên logic visible dựa trên scroll nếu cần
        const onScroll = () => {
            if (!ref.current) return;
            const top = ref.current.getBoundingClientRect().top;
            setVisible(top < window.innerHeight - 100);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const items: { id: number; icon: React.ReactElement<{ size?: number }>; href: string }[] = [
        { id: 1, icon: <FileText size={16} />, href: '#' },
        { id: 2, icon: <Grid size={16} />, href: '#' },
        { id: 3, icon: <Calendar size={16} />, href: '#' },
        { id: 4, icon: <History size={16} />, href: '#' },
        { id: 5, icon: <Github size={16} />, href: '#' },
        { id: 6, icon: <ChevronRight size={16} />, href: '#' },
    ];

    // Logic kích thước icon nhỏ (dành cho 2 item đầu tiên)
    const isSmallIcon = (id: number) => id <= 2;

    function createRipple(e: React.MouseEvent<HTMLAnchorElement>, id: number) {
        setActiveId(id);
        // Đóng mobile menu sau khi click
        if (isMobileOpen) {
            setIsMobileOpen(false);
        }

        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;

        const existingRipple = target.querySelector('.ripple-blue');
        if (existingRipple) {
            existingRipple.remove();
        }

        const circle = document.createElement('span');
        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = `${e.clientX - rect.left - size / 2}px`;
        circle.style.top = `${e.clientY - rect.top - size / 2}px`;
        circle.className = 'ripple-blue';

        target.appendChild(circle);

        window.setTimeout(() => {
            circle.remove();
        }, 650);
    }

    // 💡 COMPONENT LINK RIÊNG BIỆT cho việc tái sử dụng
    const SidebarLink: React.FC<{ it: { id: number; icon: React.ReactElement<{ size?: number }>; href: string } }> = ({ it }) => {
        const isActive = it.id === activeId;
        const isSmall = isSmallIcon(it.id);

        const iconSize = isSmall ? 16 : 20;
        const containerSize = isSmall ? 'w-8 h-8' : 'w-10 h-10';
        const linkSize = isSmall ? 'w-10 h-10' : 'w-12 h-12';

        const iconContainerClass = isActive
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600';

        return (
            <a
                key={it.id}
                href={it.href}
                aria-label={`action-${it.id}`}
                onClick={(e) => createRipple(e, it.id)}
                className={`relative ${linkSize} flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 overflow-hidden`}
                style={{
                    boxShadow: isActive ? `0 0 0 3px rgb(191 219 254), 0 4px 6px -1px rgb(0 0 0 / 0.1)` : ''
                }}
            >
                <div
                    className={`${containerSize} rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${iconContainerClass}`}
                >
                    <span className={isActive ? 'text-white' : 'text-gray-600'}>
                        {React.cloneElement(it.icon, { size: iconSize })}
                    </span>
                </div>
            </a>
        );
    };

    return (
        <>
            {/* 💡 1. MOBILE BUTTON: Hiện thị trên mobile, ẩn trên lg */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-xl lg:hidden hover:bg-blue-700 transition"
                aria-label="Open sidebar menu"
            >
                <Menu size={24} />
            </button>


            {/* 💡 2. MOBILE DRAWER/OVERLAY: Mobile Menu trượt */}
            <div
                // Ẩn Mobile Drawer trên lg
                className={`lg:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsMobileOpen(false)} // Click outside để đóng
            >
                {/* Mobile Menu Content - Kích thước nhỏ gọn */}
                <div
                    onClick={(e) => e.stopPropagation()} // Ngăn chặn việc đóng khi click vào nội dung
                    className={`
                        fixed top-0 left-0 h-full
                        bg-white/95 backdrop-blur-sm shadow-2xl 
                        p-4 py-8 w-20 
                        flex flex-col items-center gap-4
                        transition-transform duration-300
                        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition mb-6"
                    >
                        <X size={20} />
                    </button>
                    {/* Danh sách Icons Mobile */}
                    {items.map((it) => <SidebarLink key={it.id} it={it} />)}
                </div>
            </div>

            {/* 💡 3. DESKTOP SIDEBAR: Ẩn trên mobile, hiện trên lg */}
            <div
                ref={ref}
                // Thêm 'hidden' để ẩn trên mobile, giữ 'lg:block' để hiện trên desktop
                className={`hidden lg:block fixed top-28 left-3 z-50 transition-all duration-500 ease-in-out ${visible ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'}`}
            >
                <div className="flex flex-col items-center gap-2 bg-white/95 shadow-lg rounded-3xl py-3 px-2 w-14 overflow-hidden">
                    {/* Danh sách Icons Desktop */}
                    {items.map((it) => <SidebarLink key={it.id} it={it} />)}
                </div>
            </div>

            <style jsx>{`
                /* Giữ nguyên CSS ripple */
                .ripple-blue {
                    position: absolute;
                    border-radius: 50%;
                    transform: scale(0);
                    background: rgba(59, 130, 246, 0.3); 
                    animation: ripple 650ms linear;
                    pointer-events: none;
                    will-change: transform, opacity;
                    z-index: 10;
                }
                @keyframes ripple {
                    to { transform: scale(2.6); opacity: 0; }
                }
            `}</style>
        </>
    );
}
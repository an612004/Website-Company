"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, ShoppingCart } from 'lucide-react';
import Profile from './Profile';
import { usePathname } from 'next/navigation';
// import { link } from "fs"; // 💡 Đã xóa import không dùng tới

function Header() {
    type LangKey = "vi" | "en";
    const [lang, setLang] = useState<LangKey>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("lang") as LangKey) || "vi";
        }
        return "vi";
    });
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);

    const servicesRef = useRef<HTMLDivElement | null>(null);
    const servicesButtonRef = useRef<HTMLButtonElement | null>(null);
    const productsRef = useRef<HTMLDivElement | null>(null);
    const productsButtonRef = useRef<HTMLButtonElement | null>(null);
    const langMenuRef = useRef<HTMLDivElement | null>(null);
    const langToggleRef = useRef<HTMLButtonElement | null>(null);
    const closeTimeoutRef = useRef<number | null>(null);
    const [hoveredService, setHoveredService] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);

    const handleLangToggle = (newLang: LangKey) => {
        setLang(newLang);
        setIsLangOpen(false);
        setOpen(false);
    };

    const texts: Record<LangKey, {
        home: string;
        about: string;
        product: string;
        contact: string;
        news: string;
        logo: string;
        service: string;
        services: Array<{ href: string; icon: string; vi: string; en: string }>;
        products: Array<{ href: string; icon: string; vi: string; en: string }>;
        login: string;
        logout: string;
        callUs: string;
        emailUs: string;
        confirmLogoutTitle: string;
        confirmLogoutMessage: string;
        confirmLogoutCancel: string;
        confirmLogoutConfirm: string;
        langCode: string;
        langFull: string;
        flag: string;
    }> = {
        vi: {
            home: "Trang chủ",
            about: "Về Anbi",
            contact: "Liên hệ",
            product: "Sản phẩm",
            news: "Tin tức",
            logo: "Anbi ",
            service: "Dịch vụ",
            login: "Đăng nhập",
            logout: "Đăng xuất",
            callUs: "Gọi ngay",
            emailUs: "Gửi mail",
            confirmLogoutTitle: 'Xác nhận đăng xuất',
            confirmLogoutMessage: 'Bạn có chắc muốn đăng xuất khỏi tài khoản không?',
            confirmLogoutCancel: 'Hủy',
            confirmLogoutConfirm: 'Đăng xuất',
            langCode: "VI",
            langFull: "Tiếng Việt",
            flag: "🇻🇳",
            services: [
                { href: "/servicess/design-web", icon: "", vi: "Thiết Kế Website", en: "Web design" },
                { href: "/servicess/design-portfolio", icon: "", vi: "Lập Trình Phần Mềm", en: "Portfolio design" },
            ],
            products: [
                { href: "/product/phan-cung", icon: "", vi: "Phần cứng & Thiết bị", en: "Hardware & Devices" },
                { href: "/product/san-pham-so", icon: "", vi: "Sản phẩm số", en: "Digital Products" },
            ]
        },
        en: {
            home: "Home",
            about: "About Anbi",
            contact: "Contact",
            product: "Product",
            logout: "Logout",
            news: "News",
            logo: "Anbi ",
            service: "Services",
            login: "Login",
            callUs: "Call Us",
            emailUs: "Email Us",
            confirmLogoutTitle: 'Confirm sign out',
            confirmLogoutMessage: 'Are you sure you want to sign out?',
            confirmLogoutCancel: 'Cancel',
            confirmLogoutConfirm: 'Sign out',
            langCode: "EN",
            langFull: "English",
            flag: "🇺🇸",
            services: [
                { href: "/servicess/design-web", icon: "", vi: "Thiết kế web", en: "Web design" },
                { href: "/servicess/portfolio", icon: "", vi: "Thiết kế portfolio", en: "Portfolio design" },
            ],
            products: [
                { href: "/product/phan-cung", icon: "", vi: "Phần cứng & Thiết bị", en: "Hardware & Devices" },
                { href: "/product/san-pham-so", icon: "", vi: "Sản phẩm số", en: "Digital Products" },
            ]
        }
    }
    // 💡 Xóa interface HeaderProps không cần thiết vì không dùng props currentPage

    // Giữ nguyên useEffect khóa cuộn trang
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    // Giữ nguyên useEffect đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (isLangOpen) {
                if (langMenuRef.current && !langMenuRef.current.contains(target) && langToggleRef.current && !langToggleRef.current.contains(target)) {
                    setIsLangOpen(false);
                }
            }
            if (isServicesOpen) {
                if (servicesRef.current && !servicesRef.current.contains(target) && servicesButtonRef.current && !servicesButtonRef.current.contains(target)) {
                    setIsServicesOpen(false);
                }
            }
            if (isProductOpen) {
                if (productsRef.current && !productsRef.current.contains(target) && productsButtonRef.current && !productsButtonRef.current.contains(target)) {
                    setIsProductOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isLangOpen, isServicesOpen, isProductOpen]);

    // 💡 CẬP NHẬT: commonLinkClass để áp dụng màu và gạch dưới cho active state
    const commonLinkClass = (isActive: boolean) => {
        return `
            relative block py-3 px-1 transition duration-200
            ${isActive
                ? 'text-orange-600 after:w-full after:left-0'
                : 'text-gray-600 hover:text-orange-600 after:w-0 after:hover:w-full after:left-0'
            }
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-600 after:transition-all after:duration-300
        `;
    };

    // Ngôn ngữ thay thế (langAlt)
    const langAlt = lang === "vi" ? "en" : "vi";
    const currentLangText = texts[lang];
    const alternateLangText = texts[langAlt as LangKey];

    const pathname = usePathname();

    // Giữ nguyên hàm kiểm tra đường dẫn
    function isActivePath(href: string) {
        try {
            const norm = (p: string | null | undefined) => {
                const s = (p || '').replaceAll('\\', '/');
                // Xóa dấu '/' thừa ở cuối, trừ trường hợp nó là '/'
                return s.replace(/\/+$/, '') || '/';
            };
            const p = norm(pathname);
            const h = norm(href);
            // Kiểm tra khớp hoàn toàn HOẶC đường dẫn hiện tại bắt đầu bằng liên kết (cho các đường dẫn con)
            return p === h || (h !== '/' && p.startsWith(h + '/'));
        } catch {
            return false;
        }
    }

    // Profile texts for the Profile component
    const profileTexts = {
        login: currentLangText.login,
        logout: currentLangText.logout,
        confirmLogoutTitle: currentLangText.confirmLogoutTitle,
        confirmLogoutMessage: currentLangText.confirmLogoutMessage,
        confirmLogoutCancel: currentLangText.confirmLogoutCancel,
        confirmLogoutConfirm: currentLangText.confirmLogoutConfirm,
    };

    return (
        <>
            {/* MAIN HEADER */}
            <header className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="
                            w-14 h-14 md:w-16 md:h-16 
                            flex items-center justify-center 
                            rounded-full 
                            bg-white 
                            shadow-xl 
                            ring-2 ring-red-200 transition duration-300 hover:scale-105
                        ">
                            <Image
                                src="/logo.png"
                                alt="Anbi"
                                width={56}
                                height={56}
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div className="hidden md:flex flex-col leading-tight">
                            <span className="text-xl font-extrabold text-red-400">Anbi</span>
                        </div>
                    </Link>

                    {/* NAV DESKTOP */}
                    <nav className="hidden lg:flex flex-1 justify-center">
                        <ul className="flex gap-8 text-base font-semibold">
                            {/* 💡 CẬP NHẬT: ÁP DỤNG commonLinkClass */}
                            <li>
                                <Link href="/" className={commonLinkClass(isActivePath('/'))}>
                                    {currentLangText.home}
                                </Link>
                            </li>

                            {/* SERVICES DROPDOWN DESKTOP */}
                            <li
                                className="relative cursor-pointer"
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                    }
                                    setIsServicesOpen(true);
                                    setIsProductOpen(false);
                                }}
                                onMouseLeave={() => {
                                    closeTimeoutRef.current = window.setTimeout(() => {
                                        setIsServicesOpen(false);
                                        setHoveredService(null);
                                    }, 180);
                                }}
                            >
                                {/* 💡 CẬP NHẬT: Áp dụng commonLinkClass cho DIV bọc ngoài để có gạch chân active */}
                                <div className={`flex items-center gap-1 transition duration-200 ${commonLinkClass(isActivePath('/servicess'))} !py-3`}>
                                    <button
                                        ref={servicesButtonRef}
                                        onClick={() => setIsServicesOpen(s => !s)}
                                        aria-expanded={isServicesOpen}
                                        aria-haspopup="menu"
                                        className="flex items-center gap-1" // Loại bỏ text-blue-600/hover:text-blue-600 khỏi button, để div xử lý
                                    >
                                        {currentLangText.service}
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>
                                </div>

                                {/* Dropdown giữ nguyên */}
                                <div
                                    ref={servicesRef}
                                    className={`${isServicesOpen ? 'block' : 'hidden'} absolute left-1/2 -translate-x-1/2 top-full pt-2 z-20`}
                                    role="menu"
                                >
                                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden min-w-[200px]">
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45"></div>

                                        <div className="py-2">
                                            {currentLangText.services.map((item, index) => {
                                                const active = isActivePath(item.href) || hoveredService === item.href;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`
                                                            flex items-center gap-3 px-5 py-3 text-sm font-medium
                                                            transition-all duration-200
                                                            ${active
                                                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-[3px] border-blue-500'
                                                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:pl-6'
                                                            }
                                                            ${index !== currentLangText.services.length - 1 ? 'border-b border-gray-50' : ''}
                                                        `}
                                                        onClick={() => { setOpen(false); setIsServicesOpen(false); setHoveredService(null); }}
                                                        onMouseEnter={() => setHoveredService(item.href)}
                                                        onMouseLeave={() => setHoveredService(null)}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                        {lang === "vi" ? item.vi : item.en}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* PRODUCT DROPDOWN DESKTOP */}
                            <li
                                className="relative cursor-pointer"
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                    }
                                    setIsProductOpen(true);
                                    setIsServicesOpen(false);
                                }}
                                onMouseLeave={() => {
                                    closeTimeoutRef.current = window.setTimeout(() => {
                                        setIsProductOpen(false);
                                        setHoveredService(null);
                                    }, 180);
                                }}
                            >
                                {/* 💡 CẬP NHẬT: Áp dụng commonLinkClass cho DIV bọc ngoài để có gạch chân active */}
                                <div className={`flex items-center gap-1 transition duration-200 ${commonLinkClass(isActivePath('/product'))} !py-3`}>
                                    <button
                                        ref={productsButtonRef}
                                        onClick={() => setIsProductOpen(s => !s)}
                                        aria-expanded={isProductOpen}
                                        aria-haspopup="menu"
                                        className="flex items-center gap-1" // Loại bỏ các class active không cần thiết trên button
                                    >
                                        {currentLangText.product}
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${isProductOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>
                                </div>

                                {/* Dropdown giữ nguyên */}
                                <div
                                    ref={productsRef}
                                    className={`${isProductOpen ? 'block' : 'hidden'} absolute left-1/2 -translate-x-1/2 top-full pt-2 z-20`}
                                    role="menu"
                                >
                                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden min-w-[220px]">
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45"></div>

                                        <div className="py-2">
                                            {currentLangText.products.map((item, index) => {
                                                const active = isActivePath(item.href) || hoveredService === item.href;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`
                                                            flex items-center gap-3 px-5 py-3 text-sm font-medium
                                                            transition-all duration-200
                                                            ${active
                                                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-[3px] border-blue-500'
                                                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:pl-6'
                                                            }
                                                            ${index !== currentLangText.products.length - 1 ? 'border-b border-gray-50' : ''}
                                                        `}
                                                        onClick={() => { setOpen(false); setIsProductOpen(false); setHoveredService(null); }}
                                                        onMouseEnter={() => setHoveredService(item.href)}
                                                        onMouseLeave={() => setHoveredService(null)}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                        {lang === "vi" ? item.vi : item.en}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* 💡 CẬP NHẬT: ÁP DỤNG commonLinkClass */}
                            <li><Link href="/news" className={commonLinkClass(isActivePath('/news'))}>{currentLangText.news}</Link></li>
                            <li><Link href="/about" className={commonLinkClass(isActivePath('/about'))}>{currentLangText.about}</Link></li>
                            <li><Link href="/contact" className={commonLinkClass(isActivePath('/contact'))}>{currentLangText.contact}</Link></li>
                        </ul>
                    </nav>

                    {/* 💡 ACTIONS & LANGUAGE SWITCHER DESKTOP */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Profile texts={profileTexts} variant="desktop" />
                        <button className="relative px-3 py-2 rounded-full hover:bg-gray-100 transition active:scale-95" aria-label="Giỏ hàng">
                            <ShoppingCart size={22} className="text-gray-700" />
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow-lg">0</span>
                        </button>
                    </div>

                    {/* MOBILE MENU BUTTON & LANGUAGE TOGGLE (MOBILE) */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button className="relative px-2 py-2 rounded-full hover:bg-gray-100 transition active:scale-95" aria-label="Giỏ hàng">
                            <ShoppingCart size={22} className="text-gray-700" />
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow-lg">0</span>
                        </button>
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-gray-800 p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition"
                        >
                            {open ? <X size={30} /> : <Menu size={30} />}
                        </button>
                    </div>

                </div>

                {/* MOBILE MENU OVERLAY */}
                <div
                    className={`
                        fixed inset-0 lg:hidden transform transition-all duration-300 z-40
                        ${open ? "translate-x-0 bg-black/50" : "translate-x-full bg-transparent"}
                    `}
                    onClick={() => setOpen(false)}
                >
                    <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* MOBILE LOGO + CLOSE BUTTON */}
                        <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                            <span className="text-xl font-extrabold text-gray-900">{currentLangText.logo}</span>
                            <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-red-500">
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="flex flex-col gap-1 mt-4 text-gray-800 text-base font-medium">
                            {/* 💡 CẬP NHẬT: THÊM ACTIVE STATE CHO MOBILE */}
                            <Link href="/"
                                className={`block py-3 transition ${isActivePath('/') ? 'text-orange-600 font-bold' : 'hover:text-orange-600'}`}
                                onClick={() => setOpen(false)}
                            >
                                {currentLangText.home}
                            </Link>
                            <Link href="/news"
                                className={`block py-3 transition ${isActivePath('/news') ? 'text-orange-600 font-bold' : 'hover:text-orange-600'}`}
                                onClick={() => setOpen(false)}
                            >
                                {currentLangText.news}
                            </Link>
                            <Link href="/about"
                                className={`block py-3 transition ${isActivePath('/about') ? 'text-orange-600 font-bold' : 'hover:text-orange-600'}`}
                                onClick={() => setOpen(false)}
                            >
                                {currentLangText.about}
                            </Link>
                            <Link href="/contact"
                                className={`block py-3 transition ${isActivePath('/contact') ? 'text-orange-600 font-bold' : 'hover:text-orange-600'}`}
                                onClick={() => setOpen(false)}
                            >
                                {currentLangText.contact}
                            </Link>

                            {/* SERVICES MOBILE - Giữ nguyên logic active bên trong map */}
                            <details className="group border-t border-gray-100 mt-2 pt-2" open={isActivePath('/servicess')}> {/* 💡 Mở mặc định nếu đang ở trang con */}
                                <summary className={`flex items-center justify-between py-3 cursor-pointer list-none transition ${isActivePath('/servicess') ? 'text-orange-600 font-bold' : 'hover:text-orange-600'}`}>
                                    {currentLangText.service}
                                    <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180" />
                                </summary>
                                <div className="flex flex-col gap-2 ml-4 mt-2 pb-2 text-sm">
                                    {currentLangText.services.map((item) => {
                                        const active = isActivePath(item.href);
                                        return (
                                            <Link key={item.href} href={item.href}
                                                className={`flex items-center gap-3 py-2 px-2 rounded-lg ${active ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-100 hover:text-orange-600'}`}
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="text-lg">{item.icon}</span>
                                                {lang === "vi" ? item.vi : item.en}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </details>

                            {/* PRODUCT MOBILE (MỚI) - Giữ nguyên logic active bên trong map */}
                            <details className="group border-t border-gray-100 mt-2 pt-2" open={isActivePath('/product')}> {/* 💡 Mở mặc định nếu đang ở trang con */}
                                <summary className={`flex items-center justify-between py-3 cursor-pointer list-none transition ${isActivePath('/product') ? 'text-orange-600 font-bold' : 'hover:text-orange-600'}`}>
                                    {currentLangText.product}
                                    <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180" />
                                </summary>
                                <div className="flex flex-col gap-2 ml-4 mt-2 pb-2 text-sm">
                                    {currentLangText.products.map((item) => {
                                        const active = isActivePath(item.href);
                                        return (
                                            <Link key={item.href} href={item.href}
                                                className={`flex items-center gap-3 py-2 px-2 rounded-lg ${active ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-100 hover:text-orange-600'}`}
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="text-lg">{item.icon}</span>
                                                {lang === "vi" ? item.vi : item.en}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </details>

                            {/* ACTIONS MOBILE - Profile Component */}
                            <div className="flex flex-col gap-3 mt-6 border-t pt-4">
                                <Profile texts={profileTexts} variant="mobile" onMenuClose={() => setOpen(false)} />
                            </div>

                        </ul>
                    </div>
                </div>
            </header>

        </>
    );
}

export default Header;
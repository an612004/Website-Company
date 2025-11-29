"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
// Thêm icon HardHat và Code cho Sản phẩm
import { Phone, ChevronDown, Menu, X, User2, Globe, HardHat, Code } from 'lucide-react';
import LoginModal from '../ui/LoginModal';
import ConfirmLogoutModal from '../ui/ConfirmLogoutModal';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { usePathname } from 'next/navigation';

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
    const [isProductOpen, setIsProductOpen] = useState(false); // 💡 State MỚI cho Product Dropdown
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const servicesRef = useRef<HTMLDivElement | null>(null);
    const servicesButtonRef = useRef<HTMLButtonElement | null>(null);
    const productsRef = useRef<HTMLDivElement | null>(null); // 💡 Ref MỚI cho Product Dropdown
    const productsButtonRef = useRef<HTMLButtonElement | null>(null); // 💡 Ref MỚI cho nút Product
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

    // 💡 CẬP NHẬT: Thêm mảng products
    const texts: Record<LangKey, {
        home: string;
        about: string;
        product: string;
        contact: string;
        news: string;
        logo: string;
        service: string;
        services: Array<{ href: string; icon: string; vi: string; en: string }>;
        products: Array<{ href: string; icon: string; vi: string; en: string }>; // 💡 MỤC PRODUCT MỚI
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
            logo: "Anbi Solutions",
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
                { href: "/dich-vu/thiet-ke-web", icon: "🌐", vi: "Thiết kế web", en: "Web design" },
                { href: "/dich-vu/thiet-ke-web-gia-re", icon: "💸", vi: "Thiết kế portfolio", en: "Portfolio design" },
            ],
            // 💡 DỮ LIỆU PRODUCT
            products: [
                { href: "/product/phan-cung", icon: "💻", vi: "Phần cứng & Thiết bị", en: "Hardware & Devices" },
                { href: "/product/san-pham-so", icon: "📱", vi: "Sản phẩm số", en: "Digital Products" },
            ]
        },
        en: {
            home: "Home",
            about: "About Anbi",
            contact: "Contact",
            product: "Product",
            logout: "Logout",
            news: "News",
            logo: "Anbi Solutions",
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
                { href: "/dich-vu/thiet-ke-web", icon: "🌐", vi: "Thiết kế web", en: "Web design" },
                { href: "/dich-vu/thiet-ke-web-gia-re", icon: "💸", vi: "Thiết kế portfolio", en: "Portfolio design" },
            ],
            // 💡 DỮ LIỆU PRODUCT
            products: [
                { href: "/product/phan-cung", icon: "💻", vi: "Phần cứng & Thiết bị", en: "Hardware & Devices" },
                { href: "/product/san-pham-so", icon: "📱", vi: "Sản phẩm số", en: "Digital Products" },
            ]
        }
    }


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

    // Đóng dropdown khi click ra ngoài (dành cho desktop)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            // Close language menu if click outside
            if (isLangOpen) {
                if (langMenuRef.current && !langMenuRef.current.contains(target) && langToggleRef.current && !langToggleRef.current.contains(target)) {
                    setIsLangOpen(false);
                }
            }
            // Close services menu if click outside
            if (isServicesOpen) {
                if (servicesRef.current && !servicesRef.current.contains(target) && servicesButtonRef.current && !servicesButtonRef.current.contains(target)) {
                    setIsServicesOpen(false);
                }
            }
            // 💡 Close products menu if click outside
            if (isProductOpen) {
                if (productsRef.current && !productsRef.current.contains(target) && productsButtonRef.current && !productsButtonRef.current.contains(target)) {
                    setIsProductOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        // 💡 Thêm isProductOpen vào dependency array
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isLangOpen, isServicesOpen, isProductOpen]);

    const commonLinkClass = "relative block py-3 px-1 transition duration-200 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:hover:w-full after:hover:left-0";
    const serviceLinkClass = "flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition duration-200";

    // Ngôn ngữ thay thế (langAlt)
    const langAlt = lang === "vi" ? "en" : "vi";
    const currentLangText = texts[lang];
    const alternateLangText = texts[langAlt as LangKey];

    const pathname = usePathname();

    function isActivePath(href: string) {
        try {
            const norm = (p: string | null | undefined) => {
                const s = (p || '').replaceAll('\\', '/');
                return s.replace(/\/+$/, '') || '/';
            };
            const p = norm(pathname);
            const h = norm(href);
            return p === h || p.startsWith(h + '/');
        } catch {
            return false;
        }
    }

    // Login modal handlers
    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    // Close modal on Escape
    useEffect(() => {
        if (!showLoginModal) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLoginModal();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [showLoginModal]);

    // Auth state and actions from Firebase
    const { user, loading, signInWithGoogle, signOut } = useFirebaseAuth();

    // If the user becomes authenticated, ensure the login modal is closed
    useEffect(() => {
        if (user) {
            setShowLoginModal(false);
        }
    }, [user]);

    const handleGoogleSignIn = async () => {
        if (!signInWithGoogle) return;
        try {
            await signInWithGoogle();
            closeLoginModal();
        } catch (err) {
            console.error('Google sign-in failed', err);
            throw err;
        }
    };

    function getInitials(name?: string | null, email?: string | null) {
        const source = name || email || '';
        const parts = source.split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'U';
        if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
        return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase();
    }

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
                        <ul className="flex gap-8 text-base font-semibold text-gray-600">
                            <li><Link href="/home" className={commonLinkClass}>{currentLangText.home}</Link></li>

                            {/* SERVICES DROPDOWN DESKTOP */}
                            <li
                                className="relative cursor-pointer"
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                    }
                                    setIsServicesOpen(true);
                                }}
                                onMouseLeave={() => {
                                    closeTimeoutRef.current = window.setTimeout(() => {
                                        setIsServicesOpen(false);
                                        setHoveredService(null);
                                    }, 180);
                                }}
                            >
                                <div className="flex items-center gap-1 hover:text-blue-600 transition duration-200 py-3">
                                    <button
                                        ref={servicesButtonRef}
                                        onClick={() => setIsServicesOpen(s => !s)}
                                        aria-expanded={isServicesOpen}
                                        aria-haspopup="menu"
                                        className="flex items-center gap-1"
                                    >
                                        {currentLangText.service}
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>
                                </div>

                                <div
                                    ref={servicesRef}
                                    // ✅ ĐÃ SỬA: Thay đổi left-1/2 -translate-x-1/2 thành left-0
                                    className={`${isServicesOpen ? 'grid' : 'hidden'} absolute left-0 top-full
                                    mt-4 w-[480px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-6
                                    grid-cols-2 gap-4 z-20 animate-fade-in-down`}
                                    style={{ animationDuration: '0.3s' }}
                                    role="menu"
                                >
                                    {currentLangText.services.map((item) => {
                                        const active = isActivePath(item.href) || hoveredService === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`${serviceLinkClass} ${active ? 'bg-blue-50 text-blue-700' : ''}`}
                                                onClick={() => { setOpen(false); setIsServicesOpen(false); setHoveredService(null); }}
                                                onMouseEnter={() => setHoveredService(item.href)}
                                                onMouseLeave={() => setHoveredService(null)}
                                            >
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="text-sm font-medium">{lang === "vi" ? item.vi : item.en}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </li>

                            {/* 💡 PRODUCT DROPDOWN DESKTOP (MỚI) */}
                            <li
                                className="relative cursor-pointer"
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                    }
                                    setIsProductOpen(true);
                                }}
                                onMouseLeave={() => {
                                    closeTimeoutRef.current = window.setTimeout(() => {
                                        setIsProductOpen(false);
                                        setHoveredService(null);
                                    }, 180);
                                }}
                            >
                                <div className="flex items-center gap-1 hover:text-blue-600 transition duration-200 py-3">
                                    <button
                                        ref={productsButtonRef}
                                        onClick={() => setIsProductOpen(s => !s)}
                                        aria-expanded={isProductOpen}
                                        aria-haspopup="menu"
                                        className={`flex items-center gap-1 ${isActivePath('/product') ? 'text-blue-600' : ''}`}
                                    >
                                        {currentLangText.product}
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${isProductOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>
                                </div>

                                {/* 💡 Dropdown Content cho Sản phẩm */}
                                <div
                                    ref={productsRef}
                                    // ✅ ĐÃ SỬA: Thay đổi left-1/2 -translate-x-1/2 thành right-0
                                    className={`${isProductOpen ? 'grid' : 'hidden'} absolute right-0 top-full
                                    mt-4 w-[480px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-6
                                    grid-cols-2 gap-4 z-20 animate-fade-in-down`}
                                    style={{ animationDuration: '0.3s' }}
                                    role="menu"
                                >
                                    {currentLangText.products.map((item) => {
                                        const active = isActivePath(item.href) || hoveredService === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`${serviceLinkClass} ${active ? 'bg-blue-50 text-blue-700' : ''}`}
                                                onClick={() => { setOpen(false); setIsProductOpen(false); setHoveredService(null); }}
                                                onMouseEnter={() => setHoveredService(item.href)}
                                                onMouseLeave={() => setHoveredService(null)}
                                            >
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="text-sm font-medium">{lang === "vi" ? item.vi : item.en}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </li>

                            <li><Link href="/news" className={commonLinkClass}>{currentLangText.news}</Link></li>
                            <li><Link href="/about" className={commonLinkClass}>{currentLangText.about}</Link></li>
                            <li><Link href="/contact" className={commonLinkClass}>{currentLangText.contact}</Link></li>
                        </ul>
                    </nav>

                    {/* 💡 ACTIONS & LANGUAGE SWITCHER DESKTOP */}
                    <div className="hidden lg:flex items-center gap-3">

                        {/* Login / User */}
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
                            </div>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                {user.photoURL ? (
                                    <Image src={user.photoURL} alt={user.displayName || 'User'} width={36} height={36} className="rounded-full object-cover" />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">{getInitials(user.displayName, user.email)}</div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-800">{user.displayName || user.email}</span>
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="px-3 py-2 text-sm bg-gray-100 rounded-md"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={openLoginModal}
                                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 rounded-full hover:opacity-90 transition shadow-lg shadow-red-500/50 active:scale-95"
                            >
                                <User2 size={18} />
                                <span>{currentLangText.login}</span>
                            </button>
                        )}
                        <button
                            ref={langToggleRef}
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 transition active:scale-95"
                        >
                            <span className="text-xl">{currentLangText.flag}</span>
                            <span>{currentLangText.langCode}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                        {isLangOpen && (
                            <div ref={langMenuRef} className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-30 animate-fade-in-down"
                                style={{ animationDuration: '0.2s' }}
                            >
                                {/* Ngôn ngữ hiện tại */}
                                <div className="flex items-center gap-3 p-3 text-sm font-bold text-blue-600 bg-blue-50/50 rounded-t-lg">
                                    <span className="text-xl">{currentLangText.flag}</span>
                                    {currentLangText.langFull}
                                </div>

                                {/* Ngôn ngữ thay thế (có thể click) */}
                                <button
                                    onClick={() => handleLangToggle(langAlt as LangKey)}
                                    className="flex items-center gap-3 p-3 w-full text-left text-sm font-medium text-gray-700 hover:bg-gray-100 transition rounded-b-lg"
                                >
                                    <span className="text-xl">{alternateLangText.flag}</span>
                                    {alternateLangText.langFull}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON & LANGUAGE TOGGLE (MOBILE) */}
                    <div className="lg:hidden flex items-center gap-2">
                        {/* 💡 2. NÚT CHUYỂN NGÔN NGỮ ĐƠN GIẢN TRÊN HEADER MOBILE */}
                        <button
                            onClick={() => handleLangToggle(langAlt as LangKey)}
                            className="text-gray-800 p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition flex items-center gap-1 font-bold text-sm"
                        >
                            <Globe size={24} className="text-blue-600" />
                            {currentLangText.langCode}
                        </button>

                        {/* Mobile Menu Button */}
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
                            <Link href="/home" className="block py-3 hover:text-blue-600 transition" onClick={() => setOpen(false)}>{currentLangText.home}</Link>
                            <Link href="/news" className="block py-3 hover:text-blue-600 transition" onClick={() => setOpen(false)}>{currentLangText.news}</Link>
                            <Link href="/about" className="block py-3 hover:text-blue-600 transition" onClick={() => setOpen(false)}>{currentLangText.about}</Link>
                            <Link href="/contact" className="block py-3 hover:text-blue-600 transition" onClick={() => setOpen(false)}>{currentLangText.contact}</Link>

                            {/* SERVICES MOBILE */}
                            <details className="group border-t border-gray-100 mt-2 pt-2">
                                <summary className="flex items-center justify-between py-3 cursor-pointer list-none hover:text-blue-600 transition">
                                    {currentLangText.service}
                                    <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180" />
                                </summary>

                                <div className="flex flex-col gap-2 ml-4 mt-2 pb-2 text-sm">
                                    {currentLangText.services.map((item) => {
                                        const active = isActivePath(item.href);
                                        return (
                                            <Link key={item.href} href={item.href}
                                                className={`flex items-center gap-3 py-2 px-2 rounded-lg ${active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 hover:text-blue-600'}`}
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="text-lg">{item.icon}</span>
                                                {lang === "vi" ? item.vi : item.en}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </details>

                            {/* 💡 PRODUCT MOBILE (MỚI) */}
                            <details className="group border-t border-gray-100 mt-2 pt-2">
                                <summary className="flex items-center justify-between py-3 cursor-pointer list-none hover:text-blue-600 transition">
                                    {currentLangText.product}
                                    <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180" />
                                </summary>

                                <div className="flex flex-col gap-2 ml-4 mt-2 pb-2 text-sm">
                                    {currentLangText.products.map((item) => {
                                        const active = isActivePath(item.href);
                                        return (
                                            <Link key={item.href} href={item.href}
                                                className={`flex items-center gap-3 py-2 px-2 rounded-lg ${active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 hover:text-blue-600'}`}
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="text-lg">{item.icon}</span>
                                                {lang === "vi" ? item.vi : item.en}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </details>

                            {/* ACTIONS MOBILE */}
                            <div className="flex flex-col gap-3 mt-6 border-t pt-4">
                                <button
                                    onClick={() => { openLoginModal(); setOpen(false); }}
                                    className="flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                                >
                                    <User2 size={18} /> {currentLangText.login}
                                </button>
                                <a href="tel:0987654321"
                                    className="flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/50"
                                    onClick={() => setOpen(false)}
                                >
                                    <Phone size={18} /> {currentLangText.callUs}
                                </a>
                            </div>

                        </ul>
                    </div>
                </div>
            </header>

            <LoginModal open={showLoginModal} onClose={closeLoginModal} onGoogleSignIn={handleGoogleSignIn} />
            <ConfirmLogoutModal
                open={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={async () => {
                    try {
                        await signOut();
                        // reload to reset any popup/COOP state and ensure a clean client state
                        if (typeof window !== 'undefined') {
                            window.location.reload();
                        }
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setShowLogoutConfirm(false);
                    }
                }}
                title={currentLangText.confirmLogoutTitle}
                message={currentLangText.confirmLogoutMessage}
                cancelLabel={currentLangText.confirmLogoutCancel}
                confirmLabel={currentLangText.confirmLogoutConfirm}
            />
        </>
    );
}

export default Header;
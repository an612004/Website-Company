"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Phone, Mail, Facebook, ChevronDown, Menu, X, User2, Globe } from 'lucide-react'; // Thêm Globe icon

function Header() {
    type LangKey = "vi" | "en";
    const [lang, setLang] = useState<LangKey>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("lang") as LangKey) || "vi";
        }
        return "vi";
    });
    const [isLangOpen, setIsLangOpen] = useState(false); // 💡 State mới cho Language Dropdown
    const [open, setOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);

    const handleLangToggle = (newLang: LangKey) => {
        setLang(newLang);
        setIsLangOpen(false); // Đóng dropdown sau khi chọn
        setOpen(false); // Đóng mobile menu nếu đang mở
    };

    // 💡 CẬP NHẬT: Thêm cờ và tên đầy đủ
    const texts: Record<LangKey, {
        // ... (các mục cũ)
        home: string;
        about: string;
        contact: string;
        news: string;
        logo: string;
        service: string;
        services: Array<{ href: string; icon: string; vi: string; en: string }>;
        login: string;
        callUs: string;
        emailUs: string;
        // 💡 MỤC NGÔN NGỮ MỚI
        langCode: string; // VI / EN
        langFull: string; // Tiếng Việt / English
        flag: string; // Biểu tượng cờ hoặc biểu tượng toàn cầu
    }> = {
        vi: {
            home: "Trang chủ",
            about: "Về Anbi",
            contact: "Liên hệ",
            news: "Tin tức",
            logo: "Anbi Solutions",
            service: "Dịch vụ",
            login: "Đăng nhập",
            callUs: "Gọi ngay",
            emailUs: "Gửi mail",
            langCode: "VI", // 💡
            langFull: "Tiếng Việt", // 💡
            flag: "🇻🇳", // 💡
            services: [
                { href: "/dich-vu/thiet-ke-web", icon: "🌐", vi: "Dịch vụ thiết kế web", en: "Web design service" },
                { href: "/dich-vu/thiet-ke-web-chuyen-nghiep", icon: "🖥️", vi: "Thiết kế web chuyên nghiệp", en: "Professional web design" },
                { href: "/dich-vu/thiet-ke-web-gia-re", icon: "💸", vi: "Thiết kế web giá rẻ", en: "Cheap web design" },
                { href: "/dich-vu/thiet-ke-web-ban-hang", icon: "🛒", vi: "Thiết kế web bán hàng", en: "E-commerce web design" },
                { href: "/dich-vu/thiet-ke-web-bat-dong-san", icon: "🏠", vi: "Thiết kế web bất động sản", en: "Real estate web design" },
            ]
        },
        en: {
            home: "Home",
            about: "About Anbi",
            contact: "Contact",
            news: "News",
            logo: "Anbi Solutions",
            service: "Services",
            login: "Login",
            callUs: "Call Us",
            emailUs: "Email Us",
            langCode: "EN", // 💡
            langFull: "English", // 💡
            flag: "🇺🇸", // 💡
            services: [
                { href: "/dich-vu/thiet-ke-web", icon: "🌐", vi: "Dịch vụ thiết kế web", en: "Web design service" },
                { href: "/dich-vu/thiet-ke-web-chuyen-nghiep", icon: "🖥️", vi: "Thiết kế web chuyên nghiệp", en: "Professional web design" },
                { href: "/dich-vu/thiet-ke-web-gia-re", icon: "💸", vi: "Thiết kế web giá rẻ", en: "Cheap web design" },
                { href: "/dich-vu/thiet-ke-web-ban-hang", icon: "🛒", vi: "Thiết kế web bán hàng", en: "E-commerce web design" },
                { href: "/dich-vu/thiet-ke-web-bat-dong-san", icon: "🏠", vi: "Thiết kế web bất động sản", en: "Real estate web design" },
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
            // Kiểm tra xem click có nằm ngoài language dropdown hay không
            // (Thao tác này yêu cầu thêm ref hoặc sử dụng kỹ thuật phức tạp hơn)
            // Tạm thời chỉ đóng dropdown khi click vào một ngôn ngữ khác
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const commonLinkClass = "relative block py-3 px-1 transition duration-200 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:hover:w-full after:hover:left-0";
    const serviceLinkClass = "flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition duration-200";

    // Ngôn ngữ thay thế (langAlt)
    const langAlt = lang === "vi" ? "en" : "vi";
    const currentLangText = texts[lang];
    const alternateLangText = texts[langAlt as LangKey];

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
                            <li className="relative group cursor-pointer">
                                <div className="flex items-center gap-1 hover:text-blue-600 transition duration-200 py-3">
                                    {currentLangText.service}
                                    <ChevronDown size={18} className="transition-transform duration-300 group-hover:rotate-180" />
                                </div>
                                {/* ... Dropdown Content giữ nguyên ... */}
                                <div className="hidden group-hover:grid absolute left-1/2 -translate-x-1/2 top-full
                                    mt-4 w-[480px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-6
                                    grid-cols-2 gap-4 z-20 animate-fade-in-down"
                                    style={{ animationDuration: '0.3s' }}
                                >
                                    {currentLangText.services.map((item) => (
                                        <Link key={item.href} href={item.href} className={serviceLinkClass}>
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="text-sm font-medium">{lang === "vi" ? item.vi : item.en}</span>
                                        </Link>
                                    ))}
                                </div>
                            </li>

                            <li><Link href="/news" className={commonLinkClass}>{currentLangText.news}</Link></li>
                            <li><Link href="/about" className={commonLinkClass}>{currentLangText.about}</Link></li>
                            <li><Link href="/contact" className={commonLinkClass}>{currentLangText.contact}</Link></li>
                        </ul>
                    </nav>

                    {/* 💡 ACTIONS & LANGUAGE SWITCHER DESKTOP */}
                    <div className="hidden lg:flex items-center gap-3">

                        {/* 💡 1. NÚT CHUYỂN ĐỔI NGÔN NGỮ (DROPDOWN) */}
                        <div className="relative">
                            {/* <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 transition active:scale-95"
                            >
                                <span className="text-xl">{currentLangText.flag}</span>
                                <span>{currentLangText.langCode}</span>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button> */}

                            {/* 💡 Dropdown Content */}

                        </div>

                        {/* Login Button */}
                        <Link href="/login" className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 rounded-full hover:opacity-90 transition shadow-lg shadow-red-500/50 active:scale-95">
                            <User2 size={18} />
                            <span>{currentLangText.login}</span>
                        </Link>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 transition active:scale-95"
                        >
                            <span className="text-xl">{currentLangText.flag}</span>
                            <span>{currentLangText.langCode}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                        {isLangOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-30 animate-fade-in-down"
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


                        {/* Main CTA Button */}
                        {/* <a href="tel:0987654321" className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 rounded-full hover:opacity-90 transition shadow-lg shadow-red-500/50 active:scale-95">
                            <Phone size={18} />
                            {currentLangText.callUs}
                        </a> */}
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
                            {/* ... Các mục menu mobile giữ nguyên ... */}
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
                                    {currentLangText.services.map((item) => (
                                        <Link key={item.href} href={item.href}
                                            className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-100 hover:text-blue-600"
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            {lang === "vi" ? item.vi : item.en}
                                        </Link>
                                    ))}
                                </div>
                            </details>

                            {/* ACTIONS MOBILE */}
                            <div className="flex flex-col gap-3 mt-6 border-t pt-4">
                                <Link href="/login"
                                    className="flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    <User2 size={18} /> {currentLangText.login}
                                </Link>
                                <a href="tel:0987654321"
                                    className="flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/50"
                                    onClick={() => setOpen(false)}
                                >
                                    <Phone size={18} /> {currentLangText.callUs}
                                </a>

                                {/* LANGUAGE MOBILE BUTTON (DƯỚI MENU) - XÓA BẢN CŨ VÌ ĐÃ CÓ BUTTON TRÊN HEADER */}
                                {/* Bạn có thể thêm lại nút này nếu muốn 2 tùy chọn chuyển đổi trên mobile */}
                            </div>

                        </ul>
                    </div>
                </div>
            </header>
        </>
    );
}
export default Header;
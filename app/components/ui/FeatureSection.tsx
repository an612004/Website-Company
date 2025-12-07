"use client";
import React from "react";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Code, Settings, HardDrive, Zap, CheckCircle } from 'lucide-react'; // 💡 Import Lucide Icons

// 1. ĐỊNH NGHĨA INTERFACE CHO TAB
interface ITab {
    id: number;
    title: string;
    icon: React.ReactNode;
    headline: string;
    content: string[];
    ctaText: string;
    ctaLink: string;
    imageSrc: {
        phone: string;
        tablet: string;
    };
    imageAlt: string;
}

// 2. DỮ LIỆU CÁC TABS VÀ NỘI DUNG RIÊNG BIỆT CỦA CHÚNG
const tabsData: ITab[] = [
    {
        id: 1,
        title: "Thiết kế Website",
        icon: <Code size={24} />, // 💡 Thay thế SVG bằng Lucide Icon
        headline: "Thiết Kế Website Chuyên Nghiệp - Tối Ưu Hiệu Quả Kinh Doanh",
        content: [
            "Thiết kế website chuẩn SEO, giao diện hiện đại, thân thiện người dùng.",
            "Phân tích hành vi người dùng – nguồn lưu lượng.",
            "Tối ưu trải nghiệm người dùng để tăng tỷ lệ chuyển đổi.",
            "Bảo trì và hỗ trợ kỹ thuật 24/7." // Thêm 1 mục để danh sách đồng đều hơn
        ],
        ctaText: "Tham khảo dịch vụ thiết kế web",
        ctaLink: "/design-services",
        imageSrc: { phone: "/logo.png", tablet: "/logo.png" },
        imageAlt: "Giao diện website responsive trên điện thoại và máy tính bảng"
    },
    {
        id: 2,
        title: "Tool Phần Mềm",
        icon: <Settings size={24} />, // 💡 Thay thế SVG bằng Lucide Icon
        headline: "Tool Phần Mềm Hỗ Trợ Thiết Kế & Phát Triển Nhanh Chóng",
        content: [
            "Tool dò mật khẩu WiFi hiệu quả, an toàn, bảo mật.",
            "Tool dịch phim ảnh và video phụ đề chính xác, đa ngôn ngữ.",
            "Tool tạo mã QR nhanh chóng và tiện lợi cho chiến dịch marketing.",
            "Các công cụ AI tự động hóa quy trình làm việc."
        ],
        ctaText: "Xem ngay các Tool",
        ctaLink: "/signup",
        imageSrc: { phone: "/images/mockup/phone-design.png", tablet: "/images/mockup/tablet-design.png" },
        imageAlt: "Giao diện ứng dụng phần mềm trên thiết bị di động"
    },
    {
        id: 3,
        title: "Tool Phần Cứng",
        icon: <HardDrive size={24} />, // 💡 Thay thế SVG bằng Lucide Icon
        headline: "Tool Phần cứng chính hãng - Hiệu năng cao cho công việc và giải trí",
        content: [
            "Linh kiện máy tính: CPU, Mainboard, RAM, Ổ cứng (SSD NVMe) và GPU (Card đồ họa) mạnh mẽ.",
            "Thiết bị ngoại vi: Màn hình tần số quét cao (144Hz, 240Hz), Bàn phím cơ/membrane, Chuột gaming.",
            "Hỗ trợ xây dựng cấu hình PC theo nhu cầu ngân sách cá nhân.",
            "Bảo hành chính hãng, lắp đặt tận nơi."
        ],
        ctaText: "Xem ngay sản phẩm",
        ctaLink: "/speed-test",
        imageSrc: { phone: "/images/mockup/phone-speed.png", tablet: "/images/mockup/tablet-speed.png" },
        imageAlt: "Thiết bị phần cứng máy tính và phụ kiện"
    },
    {
        id: 4,
        title: "Tối ưu Marketing",
        icon: <Zap size={24} />, // 💡 Thay thế SVG bằng Lucide Icon
        headline: "Công cụ Marketing hiệu quả, tăng tỷ lệ chuyển đổi bán hàng",
        content: [
            "Tối ưu hóa cho SEO, giúp nội dung của bạn lên top tìm kiếm Google.",
            "Tích hợp các công cụ Email Marketing tự động hóa và Chatbot hỗ trợ khách hàng.",
            "Quản lý và đo lường các chiến dịch quảng cáo đa kênh (Google Ads, Facebook Ads).",
            "Tư vấn chiến lược nội dung và phân tích đối thủ cạnh tranh."
        ],
        ctaText: "Khám phá công cụ Marketing",
        ctaLink: "/marketing-tools",
        imageSrc: { phone: "/images/mockup/phone-marketing.png", tablet: "/images/mockup/tablet-marketing.png" },
        imageAlt: "Biểu đồ marketing và công cụ quảng cáo trên thiết bị"
    }
];

// 3. HÀM TÌM KIẾM TAB (Đã thêm type)
const findActiveTab = (activeId: number): ITab | undefined => tabsData.find(t => t.id === activeId);

// 4. COMPONENT CHÍNH
export default function FeatureSection() {
    const [active, setActive] = useState(1);
    const [loading, setLoading] = useState(true);

    // Sử dụng useMemo để tránh currentTab được tính toán lại không cần thiết
    const currentTab = useMemo(() => findActiveTab(active), [active]);

    // Giữ nguyên logic loading
    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500); // Giảm thời gian loading
        return () => clearTimeout(timer);
    }, []);

    if (!currentTab) {
        return null;
    }

    return (
        <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
                {/* TIÊU ĐỀ SECTION */}
                <div className="text-center mb-8 sm:mb-10 md:mb-14">
                    <span className="inline-block px-4 py-1.5 mb-4 text-xs sm:text-sm font-semibold text-teal-600 bg-teal-50 rounded-full border border-teal-100">
                        🚀 Dịch vụ chuyên nghiệp
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 animate-gradient">
                            Dịch Vụ chỉ có Tại Anbi
                        </span>
                    </h2>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto px-4">
                        Giải pháp toàn diện từ Website, Phần mềm, Phần cứng đến Marketing.
                    </p>
                </div>

                {/* CONTAINER TABS CHÍNH */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-100/50 p-3 sm:p-5 md:p-8 relative overflow-hidden border border-white/50 ring-1 ring-gray-100/50">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-blue-50/30 pointer-events-none" />

                    {/* Loading animation overlay */}
                    {loading && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md">
                            <div className="relative">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-teal-500/20 rounded-full" />
                                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-t-teal-500 rounded-full animate-spin" />
                            </div>
                        </div>
                    )}

                    {/* 💡 1. TABS MENU: Modern Pill Style */}
                    <div className="relative p-1 sm:p-1.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 md:mb-10 overflow-x-auto scrollbar-hide z-10">
                        <div className="flex gap-1 sm:gap-2 min-w-max">
                            {tabsData.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActive(t.id)}
                                    className={`
                                        group relative flex items-center gap-1.5 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 font-medium text-xs sm:text-sm md:text-base whitespace-nowrap
                                        ${active === t.id
                                            ? "bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white shadow-lg shadow-teal-500/25 scale-[1.02]"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-md"
                                        }
                                    `}
                                >
                                    <div className={`transition-transform duration-300 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5 ${active === t.id ? "scale-110" : "text-teal-500 group-hover:scale-110"}`}>
                                        {t.icon}
                                    </div>
                                    <span className="hidden md:inline font-semibold">{t.title}</span>
                                    <span className="md:hidden font-semibold">{t.title.split(' ').slice(0, 2).join(' ')}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 💡 2. KHU VỰC NỘI DUNG & HÌNH ẢNH */}
                    <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <ContentDisplay currentTab={currentTab} />
                    </div>

                </div>
                {/* Modern CSS animations */}
                <style jsx global>{`
                    @keyframes fadeIn {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    @keyframes slideIn {
                        0% { opacity: 0; transform: translateY(20px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0) rotate(-3deg); }
                        50% { transform: translateY(-10px) rotate(-3deg); }
                    }
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.05); }
                    }
                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.5s ease-out;
                    }
                    .animate-slideIn {
                        animation: slideIn 0.6s ease-out;
                    }
                    .animate-float {
                        animation: float 4s ease-in-out infinite;
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 3s ease-in-out infinite;
                    }
                    .animate-pulse-slow {
                        animation: pulse-slow 4s ease-in-out infinite;
                    }
                    .animate-gradient {
                        background-size: 200% 200%;
                        animation: gradient 3s ease infinite;
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    /* Hide scrollbar */
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </div>
        </section>
    );
}

// 5. COMPONENT HIỂN THỊ NỘI DUNG (Modern & Beautiful)
const ContentDisplay = ({ currentTab }: { currentTab: ITab }) => {
    return (
        <div
            key={currentTab.id}
            className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 w-full animate-slideIn relative z-10"
        >
            {/* Văn bản */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1 flex flex-col justify-center">
                {/* Badge */}
                <div className="mb-3 sm:mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-medium text-teal-700 bg-teal-50 rounded-full border border-teal-100">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                        {currentTab.title}
                    </span>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
                    {currentTab.headline}
                </h3>

                <div className="space-y-2.5 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8">
                    {currentTab.content.map((item: string, i: number) => (
                        <div
                            key={i}
                            className="flex gap-2.5 sm:gap-3 items-start p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-gray-50 to-transparent hover:from-teal-50 hover:to-transparent transition-all duration-300 group"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3} />
                            </span>
                            <p className="flex-1 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">{item}</p>
                        </div>
                    ))}
                </div>

                <a
                    href={currentTab.ctaLink}
                    className="inline-flex items-center gap-2 w-fit bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0 group"
                >
                    <span>{currentTab.ctaText}</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
            </div>

            {/* Hình ảnh Mockup */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[380px] order-1 lg:order-2 mb-2 sm:mb-4 lg:mb-0">
                {/* Background glow effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-br from-teal-400/20 via-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-slow" />
                </div>

                {/* Mockup 1: Tablet */}
                <div className="absolute z-10 animate-float" style={{ animationDelay: '0.1s' }}>
                    <Image
                        src={currentTab.imageSrc.tablet}
                        alt={`${currentTab.imageAlt} (Tablet)`}
                        width={450}
                        height={300}
                        className="w-[180px] sm:w-[240px] md:w-[300px] lg:w-[380px] xl:w-[420px] h-auto rounded-xl sm:rounded-2xl shadow-2xl ring-1 ring-black/5"
                        style={{
                            transform: 'rotate(-3deg) translateX(8%)',
                        }}
                        unoptimized
                    />
                </div>

                {/* Mockup 2: Phone */}
                <div className="absolute z-20 animate-float" style={{ animationDelay: '0.3s' }}>
                    <Image
                        src={currentTab.imageSrc.phone}
                        alt={`${currentTab.imageAlt} (Phone)`}
                        width={180}
                        height={350}
                        className="w-[70px] sm:w-[100px] md:w-[130px] lg:w-[160px] xl:w-[180px] h-auto rounded-lg sm:rounded-xl shadow-2xl ring-1 ring-black/5"
                        style={{
                            transform: 'rotate(6deg) translateX(-60%) translateY(-5%)',
                        }}
                        unoptimized
                    />
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg animate-bounce-slow opacity-80" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg shadow-lg animate-bounce-slow opacity-80" style={{ animationDelay: '0.7s' }} />
            </div>
        </div>
    );
};
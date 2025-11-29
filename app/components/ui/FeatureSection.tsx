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
        <section className="py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* TIÊU ĐỀ SECTION */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                            Dịch Vụ chỉ có Tại Anbi
                        </span>
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Giải pháp toàn diện từ Website, Phần mềm, Phần cứng đến Marketing.
                    </p>
                </div>

                {/* CONTAINER TABS CHÍNH */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-200/50 p-4 md:p-8 relative overflow-hidden border border-gray-100">

                    {/* Loading animation overlay (Sử dụng CSS hiện đại hơn) */}
                    {loading && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-fadeIn">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* 💡 1. TABS MENU: Horizontal Tab Pill Style (Đẹp và Hiện đại) */}
                    <div className="relative p-1 bg-gray-100 rounded-xl mb-10 overflow-x-auto">
                        <div className="flex space-x-2 md:space-x-4 min-w-max">
                            {tabsData.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActive(t.id)}
                                    className={`
                                        flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 font-semibold text-base whitespace-nowrap 
                                        ${active === t.id
                                            ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/30"
                                            : "text-gray-700 hover:bg-white hover:text-blue-600"
                                        }
                                    `}
                                >
                                    <div className={`${active === t.id ? "" : "text-teal-600"}`}>
                                        {t.icon}
                                    </div>
                                    {t.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 💡 2. KHU VỰC NỘI DUNG & HÌNH ẢNH */}
                    <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <ContentDisplay currentTab={currentTab} />
                    </div>

                </div>
                {/* Thêm CSS cho animations */}
                <style jsx global>{`
                    @keyframes fadeIn {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.7s ease-out;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes mockupIn {
                        0% { opacity: 0; transform: translateY(20px) rotate(0deg); }
                        100% { opacity: 1; transform: translateY(0) rotate(0deg); }
                    }
                `}</style>
            </div>
        </section>
    );
}

// 5. COMPONENT HIỂN THỊ NỘI DUNG (Đã làm nổi bật và hiện đại hóa)
const ContentDisplay = ({ currentTab }: { currentTab: ITab }) => {
    // Sử dụng key để kích hoạt animation khi chuyển tab
    return (
        <div
            key={currentTab.id}
            // 💡 Thêm min-h-toàn diện để tránh layout nhảy khi chuyển tab
            className="flex flex-col lg:flex-row gap-12 w-full animate-fadeIn min-h-[500px] md:min-h-[400px]"
        >
            {/* Văn bản (Chiếm 50% trên Desktop) */}
            <div className="w-full lg:w-1/2">
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-snug">
                    <span className="text-blue-600">{currentTab.title}:</span> {currentTab.headline}
                </h3>
                <div className="space-y-5 mb-8">
                    {currentTab.content.map((item: string, i: number) => (
                        <div key={i} className="flex gap-4 text-gray-700 items-start">
                            <span className="flex-shrink-0 mt-1 text-teal-500">
                                <CheckCircle size={20} fill="currentColor" />
                            </span>
                            <p className="flex-1 text-lg font-medium">{item}</p>
                        </div>
                    ))}
                </div>
                <a href={currentTab.ctaLink}
                    className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-xl transition-all transform hover:scale-[1.04] active:scale-95 shadow-blue-500/50"
                >
                    {currentTab.ctaText} →
                </a>
            </div>

            {/* Hình ảnh (Mockup 3D Hiện đại - Chiếm 50% trên Desktop) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[350px]">
                {/* Mockup 1: Tablet (Lớn hơn, phía sau) */}
                <Image
                    src={currentTab.imageSrc.tablet}
                    alt={`${currentTab.imageAlt} (Tablet)`}
                    width={450}
                    height={300}
                    className="absolute z-10 drop-shadow-2xl transition-all duration-1000 animate-mockupIn max-w-full h-auto"
                    style={{
                        transform: 'rotate(-5deg) translateX(10%)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        borderRadius: '1.5rem',
                        animationDelay: '0.1s'
                    }}
                    unoptimized
                />

                {/* Mockup 2: Phone (Nhỏ hơn, phía trước) */}
                <Image
                    src={currentTab.imageSrc.phone}
                    alt={`${currentTab.imageAlt} (Phone)`}
                    width={180}
                    height={350}
                    className="absolute z-20 drop-shadow-2xl transition-all duration-1000 animate-mockupIn max-w-full h-auto"
                    style={{
                        transform: 'rotate(10deg) translateX(-40%) translateY(-10%)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                        borderRadius: '1.5rem',
                        animationDelay: '0.3s'
                    }}
                    unoptimized
                />
                {/* CSS cho mockupIn animation chỉ áp dụng trong phạm vi này (hoặc global) */}
                <style jsx>{`
                    .animate-mockupIn {
                        animation: mockupIn 0.7s cubic-bezier(0.2, 0.8, 0.6, 1.2);
                    }
                `}</style>
            </div>
        </div>
    );
};
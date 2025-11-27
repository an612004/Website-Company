"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";

// 1. ĐỊNH NGHĨA INTERFACE CHO TAB
interface ITab {
    id: number;
    title: string;
    icon: React.ReactNode; // Updated to use React.ReactNode for icon property
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
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.764 1.764 0 01-3.21 1.055L6 17H4a2 2 0 01-2-2v-4a2 2 0 012-2h2L8 6.64a1.764 1.764 0 013.21-1.058zM15 11l4-4m0 0l-4-4m4 4l-4 4"></path>
            </svg>
        ),
        headline: "Thiết Kế Website Chuyên Nghiệp - Tối Ưu Hiệu Quả Kinh Doanh",
        content: [
            "Thiết kế website chuẩn SEO, giao diện hiện đại, thân thiện người dùng.",
            "Phân tích hành vi người dùng – nguồn lưu lượng.",
            "Tối ưu trải nghiệm người dùng để tăng tỷ lệ chuyển đổi.",
            "..."

        ],
        ctaText: "Tham khảo dịch vụ thiết kế web",
        ctaLink: "/design-services",
        imageSrc: { phone: "/logo.png", tablet: "/logo.png" },
        imageAlt: "Dashboard báo cáo analytics trên thiết bị"
    },
    {

        id: 2,
        title: "Tool Phần Mềm",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1l-.75-3M3 8h18M5.25 10h13.5l-1 5H6.25l-1-5zM9 4l1.5-1h3L15 4M7 4h10"></path>
            </svg>
        ),
        headline: "Tool Phần Mềm Hỗ Trợ Thiết Kế & Phát Triển Nhanh Chóng",
        content: [
            "Tool dò mật khẩu WiFi Hiệu quả - An toàn - bảo mật.",
            "Tool dịch phim ảnh và video phụ đề chính xác.",
            "Tool tạo mã QR nhanh chóng và tiện lợi.",
            "...."
        ],
        ctaText: "Xem ngay các Tool",
        ctaLink: "/signup",
        imageSrc: { phone: "/images/mockup/phone-design.png", tablet: "/images/mockup/tablet-design.png" },
        imageAlt: "Giao diện trên thiết bị di động và tablet"
    },
    {
        id: 3,
        title: "Tool Phần Cứng",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
        ),
        headline: "Tool Phần cứng chính hãng - hiệu năng cao",
        content: [
            "CPU , Mainboard , RAM , Ổ cứng ( HDD , SSD SATA , SSD NVMe) , GPU (Card đồ họa)... .",
            "Thiết bị ngoại vi : Màn hình (60Hz, 75Hz, 144Hz, 240Hz...) , Bàn phím (Cơ / membrane) , Chuột (Wireless / có dây) , Tai nghe / Loa.",
            "..."
        ],
        ctaText: "Xem ngay sản phẩm",
        ctaLink: "/speed-test",
        imageSrc: { phone: "/images/mockup/phone-speed.png", tablet: "/images/mockup/tablet-speed.png" },
        imageAlt: "Biểu đồ tốc độ tải trang trên thiết bị"
    },
    // {
    //     id: 3,
    //     title: "Thiết kế Website",
    //     icon: (
    //         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.764 1.764 0 01-3.21 1.055L6 17H4a2 2 0 01-2-2v-4a2 2 0 012-2h2L8 6.64a1.764 1.764 0 013.21-1.058zM15 11l4-4m0 0l-4-4m4 4l-4 4"></path>
    //         </svg>
    //     ),
    //     headline: "Thiết Kế Website Chuyên Nghiệp - Tối Ưu Hiệu Quả Kinh Doanh",
    //     content: [
    //         "Thiết kế website chuẩn SEO, giao diện hiện đại, thân thiện người dùng.",
    //         "Phân tích hành vi người dùng – nguồn lưu lượng.",
    //         "Tối ưu trải nghiệm người dùng để tăng tỷ lệ chuyển đổi.",
    //         "..."

    //     ],
    //     ctaText: "Tham khảo dịch vụ thiết kế web",
    //     ctaLink: "/design-services",
    //     imageSrc: { phone: "/logo.png", tablet: "/logo.png" },
    //     imageAlt: "Dashboard báo cáo analytics trên thiết bị"
    // },
    {
        id: 4,
        title: "Tối ưu Marketing",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM15 10a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
        ),
        headline: "Công cụ Marketing hiệu quả, tăng tỷ lệ chuyển đổi",
        content: [
            "Tối ưu hóa cho SEO, giúp nội dung của bạn lên top tìm kiếm.",
            "Tích hợp các công cụ Email Marketing và Chatbot.",
            "Quản lý các chiến dịch quảng cáo đa kênh (Google, Facebook)."
        ],
        ctaText: "Khám phá công cụ Marketing",
        ctaLink: "/marketing-tools",
        imageSrc: { phone: "/images/mockup/phone-marketing.png", tablet: "/images/mockup/tablet-marketing.png" },
        imageAlt: "Công cụ marketing và email trên thiết bị"
    }
];

// 3. HÀM TÌM KIẾM TAB (Đã thêm type)
const findActiveTab = (activeId: number): ITab | undefined => tabsData.find(t => t.id === activeId);

// 4. COMPONENT CHÍNH
export default function FeatureSection() {
    const [active, setActive] = useState(1);
    const [loading, setLoading] = useState(true);
    const currentTab = findActiveTab(active);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    if (!currentTab) {
        return null;
    }

    return (
        <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-10 my-10 relative overflow-hidden border border-blue-100">
            {/* Loading animation overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md animate-fadeIn">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-semibold text-teal-600 animate-pulse">Đang tải...</span>
                    </div>
                </div>
            )}
            <div className={`flex flex-col lg:flex-row gap-8 transition-all duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                {/* Cột 1: Tabs Menu */}
                <div className="w-full lg:w-2/5 flex flex-col">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                        {tabsData.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActive(t.id)}
                                className={`
                                    flex flex-col items-center justify-center p-4 h-24 rounded-xl border-2 transition-all duration-300 transform 
                                    ${active === t.id
                                        ? "bg-gradient-to-br from-teal-400 to-blue-400 border-teal-400 text-white shadow-xl scale-105"
                                        : "bg-white border-blue-100 text-blue-600 hover:bg-teal-50 hover:border-teal-200"
                                    }
                                `}
                            >
                                <div className={`${active === t.id ? "text-white" : "text-teal-600"}`}>
                                    {t.icon}
                                </div>
                                <div className="mt-2 font-semibold text-center text-xs md:text-sm">{t.title}</div>
                                {active === t.id && <div className="w-2/3 h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full mt-2 animate-slideIn"></div>}
                            </button>
                        ))}
                    </div>
                    {/* Nội dung trên Mobile/Tablet (Optional) */}
                    <div className="lg:hidden mt-4">
                        <ContentDisplay currentTab={currentTab} />
                    </div>
                </div>
                {/* Cột 2: Nội dung & Hình ảnh (Desktop View) */}
                <div className="hidden lg:flex w-full lg:w-3/5 items-center justify-between gap-8">
                    <ContentDisplay currentTab={currentTab} />
                </div>
            </div>
            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.7s;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse {
                    animation: pulse 1.2s infinite;
                }
                @keyframes slideIn {
                    0% { width: 0; opacity: 0; }
                    100% { width: 66%; opacity: 1; }
                }
                .animate-slideIn {
                    animation: slideIn 0.7s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>
        </div>
    );
}

// 5. COMPONENT HIỂN THỊ NỘI DUNG (Đã thêm type)
const ContentDisplay = ({ currentTab }: { currentTab: ITab }) => {
    // Sử dụng key để kích hoạt animation khi chuyển tab
    return (
        <div key={currentTab.id} className="flex flex-col md:flex-row gap-8 w-full animate-fadeIn">
            {/* Văn bản (Chiếm 60%) */}
            <div className="w-full md:w-3/5">
                <h3 className="text-2xl font-extrabold text-blue-800 mb-5 border-l-4 border-teal-400 pl-3">
                    {currentTab.headline}
                </h3>
                <div className="space-y-4 mb-8">
                    {currentTab.content.map((item: string, i: number) => (
                        <div key={i} className="flex gap-3 text-gray-900 items-start">
                            <span className="text-teal-500 text-lg font-bold">✔</span>
                            <p className="flex-1 text-base md:text-lg font-medium">{item}</p>
                        </div>
                    ))}s
                </div>
                <a href={currentTab.ctaLink} className="inline-flex items-center mt-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all transform hover:scale-[1.04]">
                    {currentTab.ctaText} →
                </a>
            </div>
            {/* Hình ảnh (Chiếm 40%) */}
            <div className="w-full md:w-2/5 flex items-center justify-center relative min-h-[300px]">
                <Image
                    src={currentTab.imageSrc.phone}
                    alt={`${currentTab.imageAlt} (Phone)`}
                    width={150}
                    height={300}
                    className="absolute left-0 bottom-0 drop-shadow-2xl transition-all duration-700 opacity-100"
                    style={{ transform: 'rotate(-5deg)', background: 'linear-gradient(135deg, #e0f7fa 0%, #e3f2fd 100%)', borderRadius: '1.5rem' }}
                    unoptimized
                />
                <Image
                    src={currentTab.imageSrc.tablet}
                    alt={`${currentTab.imageAlt} (Tablet)`}
                    width={400}
                    height={300}
                    className="absolute right-0 bottom-0 drop-shadow-2xl transition-all duration-700 opacity-100"
                    style={{ transform: 'rotate(5deg)', background: 'linear-gradient(135deg, #e0f7fa 0%, #e3f2fd 100%)', borderRadius: '2rem' }}
                    unoptimized
                />
            </div>
        </div>
    );
};
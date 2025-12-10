'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaCheck, FaRocket, FaCrown, FaStar, FaExternalLinkAlt } from 'react-icons/fa';

interface PricingPlan {
    id: string;
    name: string;
    price: string;
    priceNote?: string;
    description: string;
    gradient: string;
    buttonGradient: string;
    icon: React.ReactNode;
    popular?: boolean;
    features: {
        title: string;
        items: string[];
        link?: string;
    }[];
}

const pricingPlans: PricingPlan[] = [
    {
        id: 'basic',
        name: 'GÓI CƠ BẢN',
        price: '1 - 3 Triệu',
        description: 'THIẾT KẾ THEO MẪU CÓ SẴN',
        gradient: 'from-cyan-400 via-blue-500 to-purple-500',
        buttonGradient: 'from-cyan-500 to-blue-600',
        icon: <FaStar className="w-6 h-6" />,
        features: [
            {
                title: 'MODULE WEBSITE',
                items: ['Chức năng cơ bản Website'],
                link: '/servicess/design-web'
            },
            {
                title: 'PHẦN TÍCH HỢP',
                items: [
                    'Dành cho: Sinh viên/Nhà khởi nghiệp mới tập tành làm website',
                    'Thời gian hoàn thành: 1 - 3 ngày làm việc',
                    'Tên miền (Domain) cơ bản (Miễn phí 1 năm)',
                    'Hosting (Lưu trữ) cơ bản (Miễn phí 1 năm)',
                    'Live chat messenger/zalo (Tích hợp mã nhúng)',
                    'Google Analytics cơ bản',
                    'Tối ưu hóa hình ảnh cơ bản (5 ảnh đầu tiên)',
                    'Tối ưu hóa tốc độ tải trang (Cấp độ Basic)',
                    'Tư vấn nội dung (Content) chuẩn SEO (1 buổi)',
                    'Bàn giao mã nguồn và hướng dẫn sử dụng',
                    'Hỗ trợ kỹ thuật: Qua Email/Zalo trong giờ hành chính',
                    'Bảo hành: 1 tháng kể từ ngày bàn giao'
                ]

            }
        ]
    },
    {
        id: 'advanced',
        name: 'GÓI NÂNG CAO',
        price: 'Từ 7 - 10 Triệu',
        description: 'TÙY BIẾN GIAO DIỆN THEO YÊU CẦU',
        gradient: 'from-purple-400 via-pink-500 to-red-500',
        buttonGradient: 'from-purple-500 to-pink-600',
        icon: <FaRocket className="w-6 h-6" />,
        popular: true,
        features: [
            {
                title: 'MODULE WEBSITE',
                items: ['Chức năng cơ bản Website'],
                link: '/servicess/design-web'
            },
            {
                title: 'PHẦN TÍCH HỢP',
                items: [
                    'Dành cho: Doanh nghiệp vừa và nhỏ muốn có website chuyên nghiệp',
                    'Thời gian hoàn thành: 3 - 5 ngày làm việc',
                    'Tên miền (Domain) TLD quốc tế (Miễn phí 1 năm)',
                    'Hosting SSD tốc độ cao (Miễn phí 1 năm)',
                    'Live chat messenger/zalo (Tích hợp API)',
                    'Google Analytics và Google Search Console',
                    'Tối ưu hóa hình ảnh toàn bộ nội dung (Tối đa 50 ảnh)',
                    'Tối ưu hóa tốc độ tải trang (Cấp độ Standard)',
                    'Tư vấn chiến lược SEO tổng thể (3 buổi)',
                    'Tích hợp Google Maps & các mạng xã hội',
                    'Hỗ trợ kỹ thuật: 24/7 qua Zalo/Điện thoại',
                    'Bảo hành: 6 tháng và Hỗ trợ chỉnh sửa nhỏ miễn phí'
                ]
            }
        ]
    },
    {
        id: 'premium',
        name: 'GÓI CAO CẤP',
        price: 'Từ 15 - 20 Triệu',
        description: 'THIẾT KẾ ĐẶC BIỆT THEO YÊU CẦU',
        gradient: 'from-orange-400 via-pink-500 to-purple-500',
        buttonGradient: 'from-orange-500 to-pink-600',
        icon: <FaCrown className="w-6 h-6" />,
        features: [
            {
                title: 'MODULE WEBSITE',
                items: ['Chức năng theo yêu cầu / Thiết kế độc quyền'],
                // link: '/product/digital'
            },
            {
                title: 'PHẦN TÍCH HỢP',
                items: [
                    'Dành cho: Doanh nghiệp lớn/Hệ thống cần phát triển tính năng riêng biệt',
                    'Thời gian hoàn thành: 15 - 45 ngày làm việc (Theo tính năng)',
                    'Tên miền (Domain) cao cấp (Miễn phí 1 năm)',
                    'Sử dụng Hosting/VPS chuyên dụng tốc độ cao (Miễn phí 1 năm)',
                    'Băng thông không giới hạn',
                    'Chứng chỉ bảo mật SSL vĩnh viễn (HTTPS)',
                    'Tối ưu hóa hình ảnh, video (Không giới hạn)',
                    'Tối ưu hóa tốc độ tải trang (Cấp độ Performance)',
                    'Tư vấn chiến lược Marketing Online/SEO chuyên sâu',
                    'Thiết kế Logo & Bộ nhận diện thương hiệu (Gói cơ bản)',
                    'Tích hợp Hệ thống thanh toán/API bên thứ 3 theo yêu cầu',
                    'Bảo hành: 12 tháng, Hỗ trợ Ưu tiên và Cập nhật định kỳ'
                ]
            }
        ]
    }
];

function PriceQuote() {
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Bảng báo giá thiết kế Website / Phần mềm trọn gói
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chọn gói dịch vụ phù hợp với nhu cầu của bạn. Tất cả các gói đều bao gồm hỗ trợ kỹ thuật 24/7.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 flex flex-col ${hoveredPlan === plan.id ? 'shadow-2xl' : 'hover:shadow-xl'
                                } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                            onMouseEnter={() => setHoveredPlan(plan.id)}
                            onMouseLeave={() => setHoveredPlan(null)}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse hover:animate-none hover:scale-110 transition-transform duration-300 cursor-default">
                                        PHỔ BIẾN
                                    </span>
                                </div>
                            )}

                            {/* Header with Gradient */}
                            <div className={`bg-gradient-to-r ${plan.gradient} p-8 text-center text-white relative overflow-hidden group/header`}>
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover/header:scale-150"></div>
                                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-1/2 translate-y-1/2 transition-transform duration-700 group-hover/header:scale-150"></div>
                                </div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-110 hover:rotate-3 hover:bg-white/30 cursor-pointer">
                                        {plan.icon}
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="text-xl font-bold tracking-wide mb-3">{plan.name}</h3>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <span className="text-4xl font-extrabold">{plan.price}</span>
                                    </div>

                                    {/* Description Button */}
                                    <button className={`px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300`}>
                                        {plan.description}
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                    {plan.features.map((section, idx) => (
                                        <div key={idx} className="mb-6 last:mb-0">
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <h4 className="text-lg font-bold text-gray-800 transition-all duration-300 hover:text-purple-600 cursor-default">
                                                    {section.title}
                                                </h4>
                                                {section.link && (
                                                    <Link
                                                        href={section.link}
                                                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full hover:bg-purple-200 hover:text-purple-700 transition-all duration-300 hover:scale-105"
                                                    >
                                                        Xem mẫu
                                                        <FaExternalLinkAlt className="w-2.5 h-2.5" />
                                                    </Link>
                                                )}
                                            </div>
                                            <ul className="space-y-3">
                                                {section.items.map((item, itemIdx) => (
                                                    <li key={itemIdx} className="flex items-start gap-3 group/item transition-all duration-300 hover:translate-x-1 cursor-default p-2 -mx-2 rounded-lg hover:bg-gray-50">
                                                        <span className="flex-shrink-0 min-w-[24px] w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300 group-hover/item:bg-green-500 group-hover/item:scale-110">
                                                            <FaCheck className="w-3 h-3 text-green-600 flex-shrink-0 transition-colors duration-300 group-hover/item:text-white" />
                                                        </span>
                                                        <span className="text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover/item:text-gray-900">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button - Always at bottom */}
                                <a
                                    href="#contact-form"
                                    className={`w-full mt-6 py-3.5 bg-gradient-to-r ${plan.buttonGradient} text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 relative overflow-hidden group/btn flex items-center justify-center`}
                                >
                                    <span className="relative z-10">Đăng Ký</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PriceQuote;
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, DollarSign, Zap, Package, ArrowRight, Frown, Eye, Heart, Star, ShoppingCart, ExternalLink, TrendingUp } from 'lucide-react';

// Định nghĩa Interface cho dữ liệu Theme
interface Theme {
    title: string;
    description: string;
    price: string;
    originalPrice?: string;
    image: string;
    rating?: number;
    reviews?: number;
    sales?: number;
    isNew?: boolean;
    discount?: number;
}

// Dữ liệu mẫu bị loại bỏ và thay bằng state rỗng
const INITIAL_TAB_CONTENT: Record<string, Theme[]> = {
    new: [],
    free: [],
    under_1m: [],
    most_bought: [],
};

// Component thẻ giao diện - Ultra Modern Design
interface ThemeProps {
    theme: Theme;
    index: number;
}

const ThemeCard: React.FC<ThemeProps> = ({ theme, index }) => {
    const [mockImageLoaded, setMockImageLoaded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative"
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow effect behind card */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700 ${isHovered ? 'animate-pulse-glow' : ''}`} />

            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 transform hover:-translate-y-3 hover:scale-[1.02]">

                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Vùng Ảnh */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
                    {/* Shimmer loading effect */}
                    {!mockImageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
                    )}

                    <Image
                        src="https://via.placeholder.com/400x300/f8fafc/cbd5e1?text=THEME"
                        alt={`Preview ${theme.title}`}
                        width={400}
                        height={300}
                        unoptimized
                        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:blur-[1px]"
                        onLoad={() => setMockImageLoaded(true)}
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Top Badges Row */}
                    <div className="absolute top-2 sm:top-3 inset-x-2 sm:inset-x-3 flex justify-between items-start">
                        {/* Left badges */}
                        <div className="flex flex-col gap-1.5">
                            {theme.isNew && (
                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    NEW
                                </span>
                            )}
                            {theme.price === "Miễn phí" && (
                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-lg shadow-emerald-500/40">
                                    <Zap className="w-2.5 h-2.5" />
                                    FREE
                                </span>
                            )}
                            {theme.discount && theme.discount > 0 && (
                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-lg shadow-red-500/40">
                                    -{theme.discount}%
                                </span>
                            )}
                        </div>

                        {/* Right actions */}
                        <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-md ${isLiked
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 scale-110'
                                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/50'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                            </button>
                            <button className="w-8 h-8 sm:w-9 sm:h-9 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom action buttons */}
                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 bg-white/95 backdrop-blur-md rounded-xl text-xs sm:text-sm font-bold text-gray-900 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Xem trước
                        </button>
                        <button className="flex items-center justify-center w-10 sm:w-11 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                            <ShoppingCart className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chi tiết */}
                <div className="p-3 sm:p-4 md:p-5 relative">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white opacity-50" />

                    <div className="relative">
                        {/* Rating & Sales row */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center gap-1">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${star <= (theme.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-500 ml-1 font-medium">({theme.reviews || 24})</span>
                            </div>
                            {theme.sales && (
                                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 font-semibold">
                                    <TrendingUp className="w-3 h-3" />
                                    {theme.sales}+ mua
                                </div>
                            )}
                        </div>

                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {theme.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                            {theme.description}
                        </p>

                        {/* Price & CTA */}
                        <div className="flex justify-between items-end pt-3 sm:pt-4 border-t border-gray-100/80">
                            <div className="flex flex-col">
                                {theme.originalPrice && (
                                    <span className="text-[10px] sm:text-xs text-gray-400 line-through">{theme.originalPrice}</span>
                                )}
                                <span className={`text-lg sm:text-xl md:text-2xl font-black tracking-tight ${theme.price === "Miễn phí" ? 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'}`}>
                                    {theme.price}
                                </span>
                            </div>
                            <button className="flex items-center gap-1.5 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white text-xs sm:text-sm font-bold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 group/btn">
                                <span className="hidden sm:inline">Chi tiết</span>
                                <span className="sm:hidden">Xem</span>
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function SideWebsite() {
    const [tabData] = useState<Record<string, Theme[]>>(INITIAL_TAB_CONTENT);
    const [activeTab, setActiveTab] = useState('most_bought');

    const tabs = [
        { key: 'new', label: 'Website mới', shortLabel: 'Mới', icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'from-violet-600 to-purple-600', shadow: 'shadow-violet-500/30' },
        { key: 'free', label: 'Miễn phí', shortLabel: 'Free', icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/30' },
        { key: 'under_1m', label: 'Dưới 1 triệu', shortLabel: '<1tr', icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/30' },
        { key: 'most_bought', label: 'Được mua nhiều', shortLabel: 'Hot', icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-500/30' },
    ];

    const currentContent = tabData[activeTab] || [];
    const currentTab = tabs.find(t => t.key === activeTab);

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-28 relative overflow-hidden">
            {/* Modern gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating orbs */}
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-slow" />
                <div className="absolute top-40 right-[15%] w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-20 left-[20%] w-80 h-80 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '4s' }} />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">

                {/* Tiêu đề & Mô tả - Enhanced */}
                <div className="text-center mb-10 sm:mb-14 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-5 sm:mb-6 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Bộ sưu tập mới nhất
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6 tracking-tight">
                        <span className="inline-block">Mẫu Website &</span>
                        <br className="hidden sm:block" />
                        <span className="inline-block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent animate-gradient-x">
                            Sản phẩm nổi bật
                        </span>
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto px-4 leading-relaxed">
                        Anbi liên tục cập nhật các mẫu giao diện và sản phẩm
                        <span className="text-blue-600 font-medium"> chất lượng cao</span> cho tất cả ngành nghề
                    </p>
                </div>

                {/* ========================================= */}
                {/* PHẦN THANH TAB - Ultra Modern */}
                {/* ========================================= */}
                <div className="flex justify-center mb-10 sm:mb-12 md:mb-16">
                    <div className="relative p-1.5 sm:p-2 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-white/80 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-1.5 sm:gap-2">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`
                                            relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold whitespace-nowrap transition-all duration-500
                                            ${isActive
                                                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg ${tab.shadow}`
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/80'
                                            }
                                        `}
                                    >
                                        <span className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : ''}`}>
                                            {tab.icon}
                                        </span>
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">{tab.shortLabel}</span>

                                        {/* Active indicator dot */}
                                        {isActive && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-sm" />
                                        )}

                                        {/* Hot badge for most_bought */}
                                        {tab.key === 'most_bought' && (
                                            <span className={`hidden sm:flex absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[9px] font-bold items-center justify-center shadow-md transition-all duration-300 ${isActive ? 'bg-white text-red-500' : 'bg-red-500 text-white'}`}>
                                                🔥
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ========================================= */}
                {/* PHẦN NỘI DUNG TAB */}
                {/* ========================================= */}
                <div className="animate-fadeIn">
                    {currentContent.length === 0 ? (
                        <div className="relative text-center p-10 sm:p-16 md:p-20 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl sm:rounded-[2rem] shadow-xl overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.05),transparent_50%)]" />

                            <div className="relative">
                                <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${currentTab?.color || 'from-blue-500 to-cyan-500'} rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl ${currentTab?.shadow || ''} rotate-3`}>
                                    <Frown className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                                </div>
                                <p className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-3">Chưa có giao diện nào</p>
                                <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-md mx-auto mb-6 sm:mb-8">
                                    Danh mục &quot;{tabs.find(t => t.key === activeTab)?.label}&quot; đang được cập nhật
                                </p>
                                <button className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentTab?.color || 'from-blue-500 to-cyan-500'} text-white text-sm font-bold rounded-xl shadow-lg ${currentTab?.shadow || ''} hover:-translate-y-0.5 transition-all duration-300`}>
                                    <Sparkles className="w-4 h-4" />
                                    Khám phá danh mục khác
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
                            {currentContent.map((theme, index) => (
                                <ThemeCard key={index} theme={theme} index={index} />
                            ))}
                        </div>
                    )}

                    {/* Nút xem tất cả - Enhanced */}
                    <div className="text-center mt-12 sm:mt-16 md:mt-20">
                        <button className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white text-sm sm:text-base font-bold rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            <span className="relative">Xem tất cả giao diện</span>
                            <ArrowRight className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modern CSS Animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
                }
                .animate-shimmer {
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 4s ease infinite;
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}

export default SideWebsite;
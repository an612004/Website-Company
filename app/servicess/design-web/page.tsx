"use client";
import Header from "@/app/components/layout/Header";
import { useState, useRef, TouchEvent, MouseEvent, useEffect } from "react";
import { Search, Grid3X3, Tag, ChevronDown, ChevronLeft, ChevronRight, Images, Layers } from "lucide-react";

// Interface cho WebCategory từ API
interface WebCategory {
    _id: string;
    name: string;
    createdAt?: string;
}

// Interface cho WebType từ API
interface WebType {
    _id: string;
    name: string;
    category: WebCategory | string;
    createdAt?: string;
}

// Interface cho slider image từ API
interface SliderImage {
    _id: string;
    url: string;
    alt?: string;
    link?: string;
    order?: number;
}

function DesignWebPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<"left" | "right">("right");

    // State cho slider images từ API
    const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
    const [loadingSliders, setLoadingSliders] = useState(true);

    // State cho categories và types từ API
    const [categories, setCategories] = useState<WebCategory[]>([]);
    const [types, setTypes] = useState<WebType[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Fetch categories và types từ API
    useEffect(() => {
        const fetchCategoriesAndTypes = async () => {
            try {
                const [catRes, typeRes] = await Promise.all([
                    fetch('/api/admin/web-category'),
                    fetch('/api/admin/web-type')
                ]);
                const catData = await catRes.json();
                const typeData = await typeRes.json();
                if (catData.categories) {
                    setCategories(catData.categories);
                }
                if (typeData.types) {
                    setTypes(typeData.types);
                }
            } catch (err) {
                console.error('Lỗi lấy danh mục và loại:', err);
            }
        };
        fetchCategoriesAndTypes();
    }, []);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.category-dropdown')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Fetch slider images từ API
    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const res = await fetch('/api/sliders');
                const data = await res.json();
                if (data.sliders) {
                    setSliderImages(data.sliders);
                }
            } catch (err) {
                console.error('Lỗi lấy danh sách slider:', err);
            } finally {
                setLoadingSliders(false);
            }
        };
        fetchSliders();
    }, []);

    // State cho swipe/drag
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    // Chuyển slide trước (trượt từ trái sang)
    const prevSlide = () => {
        if (isAnimating) return;
        setDirection("left");
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
            setIsAnimating(false);
        }, 500);
    };

    // Chuyển slide sau (trượt từ phải sang)
    const nextSlide = () => {
        if (isAnimating) return;
        setDirection("right");
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
            setIsAnimating(false);
        }, 500);
    };

    // Chuyển đến slide cụ thể
    const goToSlide = (index: number) => {
        if (isAnimating || index === currentSlide) return;
        setDirection(index > currentSlide ? "right" : "left");
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide(index);
            setIsAnimating(false);
        }, 500);
    };

    // Touch events cho điện thoại
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (isAnimating) return;
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        setDragOffset(diff);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // Nếu kéo quá 50px thì chuyển slide
        if (dragOffset > 50) {
            prevSlide();
        } else if (dragOffset < -50) {
            nextSlide();
        }
        setDragOffset(0);
    };

    // Mouse events cho desktop
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (isAnimating) return;
        setIsDragging(true);
        setStartX(e.clientX);
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = currentX - startX;
        setDragOffset(diff);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // Nếu kéo quá 50px thì chuyển slide
        if (dragOffset > 50) {
            prevSlide();
        } else if (dragOffset < -50) {
            nextSlide();
        }
        setDragOffset(0);
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleMouseUp();
        }
    };
    return (
        <>
            <Header />
            {/* Hero Section - Nền trắng hiện đại với hiệu ứng động */}
            <div className="relative bg-white w-full py-20 lg:py-28 px-4 md:px-8 overflow-hidden">
                {/* Hiệu ứng nền động - các hình tròn mờ chuyển động */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-yellow-100 rounded-full blur-2xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }}></div>

                <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 z-10">
                    {/* Phần thông tin dịch vụ */}
                    <div className="flex-1 text-center lg:text-left animate-fade-in-up order-1 lg:order-1">
                        {/* Tagline */}
                        <p className="text-sm md:text-base font-semibold text-orange-500 uppercase tracking-widest mb-3 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                            🚀 Dịch vụ thiết kế chuyên nghiệp
                        </p>

                        {/* Tiêu đề chính với gradient */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-5 leading-tight">
                            THIẾT KẾ{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-gradient-x">
                                WEBSITE
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-6">
                            Chuyên Nghiệp – <span className="text-red-500">Chuẩn SEO</span> – Trọn Gói
                        </h2>

                        {/* Mô tả */}
                        <p className="text-base md:text-lg text-gray-600 mb-6 max-w-xl leading-relaxed">
                            <b className="text-gray-800">Thiết kế website</b> chuẩn SEO giúp doanh nghiệp bứt phá trong kỷ nguyên số.
                            Đội ngũ <span className="font-bold text-orange-500">Anbi</span> cam kết mang đến giải pháp chuyên nghiệp,
                            tối ưu trải nghiệm người dùng và giúp thương hiệu của bạn nổi bật.
                        </p>

                        {/* Danh sách tính năng với icon */}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-gray-700">
                            <li className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">
                                <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm">✓</span>
                                Giao diện độc quyền, phù hợp ngành nghề
                            </li>
                            <li className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">
                                <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm">✓</span>
                                Tối ưu tốc độ, thân thiện di động
                            </li>
                            <li className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">
                                <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm">✓</span>
                                Chuẩn SEO, dễ dàng lên top Google
                            </li>
                            <li className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">
                                <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm">✓</span>
                                Bảo mật cao, dễ quản trị
                            </li>
                        </ul>

                        {/* Nút CTA với hiệu ứng */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center gap-2">
                                Nhận tư vấn miễn phí
                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </button>
                            <button className="px-8 py-4 border-2 border-orange-500 text-orange-600 font-bold rounded-full hover:bg-orange-50 transition-all duration-300 text-lg">
                                Xem báo giá
                            </button>
                        </div>
                    </div>

                    {/* Phần hình ảnh minh họa với hiệu ứng - Slider */}
                    <div className="flex-1 w-full flex justify-center items-center relative px-4 order-2 lg:order-2 mt-8 lg:mt-0">
                        {/* Nền gradient mờ */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl opacity-80"></div>

                        {/* Hiển thị khi đang loading hoặc chưa có slider */}
                        {loadingSliders ? (
                            <div className="relative z-10 w-full max-w-md py-16 text-center">
                                <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-500">Đang tải giao diện...</p>
                            </div>
                        ) : sliderImages.length === 0 ? (
                            <div className="relative z-10 w-full max-w-md py-16 text-center">
                                <Images className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500 text-lg">Chưa có giao diện nào</p>
                                <p className="text-gray-400 text-sm mt-2">Vui lòng thêm ảnh slider trong trang quản trị</p>
                            </div>
                        ) : (
                            <>
                                {/* Nút mũi tên trái */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-0 sm:left-2 lg:left-4 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-orange-500"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                {/* Slider Container với ảnh mờ 2 bên */}
                                <div
                                    ref={sliderRef}
                                    className={`relative z-10 w-full max-w-2xl flex items-center justify-center py-8 overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {/* Ảnh mờ bên trái - Ẩn trên mobile */}
                                    <div className={`hidden lg:block absolute left-0 w-32 lg:w-40 h-[300px] z-0 -translate-x-4 scale-90 transition-all duration-500 ${isAnimating && direction === "left" ? "translate-x-8 opacity-100 scale-95" : isAnimating && direction === "right" ? "-translate-x-12 opacity-0 scale-75" : ""
                                        }`}>
                                        <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden opacity-50 blur-[1px]">
                                            <img
                                                src={sliderImages[(currentSlide - 1 + sliderImages.length) % sliderImages.length].url}
                                                alt={sliderImages[(currentSlide - 1 + sliderImages.length) % sliderImages.length].alt || "Previous"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Ảnh chính ở giữa - Hiệu ứng trượt ngang */}
                                    <div
                                        className="relative z-20 w-full max-w-md mx-4 sm:mx-8 lg:mx-16 overflow-hidden"
                                        style={{ height: '380px' }}
                                    >
                                        <div
                                            className={isDragging ? "" : "transition-all duration-500 ease-in-out"}
                                            style={{
                                                transform: isDragging
                                                    ? `translateX(${dragOffset}px)`
                                                    : isAnimating
                                                        ? direction === "right"
                                                            ? 'translateX(-100%)'
                                                            : 'translateX(100%)'
                                                        : 'translateX(0)',
                                                opacity: isAnimating ? 0 : 1
                                            }}
                                        >
                                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                                                {/* Hình ảnh */}
                                                <div className="relative overflow-hidden">
                                                    {sliderImages[currentSlide].link ? (
                                                        <a
                                                            href={sliderImages[currentSlide].link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block cursor-pointer"
                                                        >
                                                            <img
                                                                src={sliderImages[currentSlide].url}
                                                                alt={sliderImages[currentSlide].alt || "Giao diện"}
                                                                className="w-full h-64 object-cover transition-transform duration-700 hover:scale-105"
                                                            />
                                                        </a>
                                                    ) : (
                                                        <img
                                                            src={sliderImages[currentSlide].url}
                                                            alt={sliderImages[currentSlide].alt || "Giao diện"}
                                                            className="w-full h-64 object-cover transition-transform duration-700 hover:scale-105"
                                                        />
                                                    )}
                                                </div>

                                                {/* Thông tin giao diện */}
                                                <div className="p-5 text-center bg-white">
                                                    {sliderImages[currentSlide].link ? (
                                                        <a
                                                            href={sliderImages[currentSlide].link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xl font-bold text-gray-800 mb-3 hover:text-orange-500 transition-colors cursor-pointer block"
                                                        >
                                                            {sliderImages[currentSlide].alt || "Giao diện web"}
                                                            <span className="text-orange-500 text-sm ml-2">→</span>
                                                        </a>
                                                    ) : (
                                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{sliderImages[currentSlide].alt || "Giao diện web"}</h3>
                                                    )}
                                                    <p className="text-gray-500 text-sm">Thiết kế chuyên nghiệp</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ảnh mờ bên phải - Ẩn trên mobile */}
                                    <div className={`hidden lg:block absolute right-0 w-32 lg:w-40 h-[300px] z-0 translate-x-4 scale-90 transition-all duration-500 ${isAnimating && direction === "right" ? "-translate-x-8 opacity-100 scale-95" : isAnimating && direction === "left" ? "translate-x-12 opacity-0 scale-75" : ""
                                        }`}>
                                        <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden opacity-50 blur-[1px]">
                                            <img
                                                src={sliderImages[(currentSlide + 1) % sliderImages.length].url}
                                                alt={sliderImages[(currentSlide + 1) % sliderImages.length].alt || "Next"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Dots indicator */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex justify-center gap-2">
                                        {sliderImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === index
                                                    ? 'bg-green-500 w-6'
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Nút mũi tên phải */}
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-0 sm:right-2 lg:right-4 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-orange-500"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS Animation tùy chỉnh */}
            <style jsx>{`
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.6s ease-out forwards;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>

            {/* Filter Section - Thanh lọc giao diện */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                        {/* Nút Tất cả */}
                        <button
                            onClick={() => {
                                setActiveFilter("all");
                                setOpenDropdown(null);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 font-medium text-sm md:text-base transition-all duration-300 ${activeFilter === "all"
                                ? "text-orange-600"
                                : "text-gray-600 hover:text-orange-600"
                                }`}
                        >
                            <Grid3X3 className="w-5 h-5 text-orange-500" />
                            <span>Tất cả</span>
                        </button>

                        {/* Nút Khuyến mãi */}
                        <button
                            onClick={() => {
                                setActiveFilter("sale");
                                setOpenDropdown(null);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 font-medium text-sm md:text-base transition-all duration-300 ${activeFilter === "sale"
                                ? "text-orange-600"
                                : "text-gray-600 hover:text-orange-600"
                                }`}
                        >
                            <Tag className="w-5 h-5 text-orange-500" />
                            <span>Khuyến mãi</span>
                        </button>

                        {/* Danh mục từ database với dropdown types */}
                        {categories.map((cat) => {
                            const isActive = activeFilter === cat._id;
                            const isOpen = openDropdown === cat._id;
                            // Lọc các types thuộc category này
                            const categoryTypes = types.filter((t) => {
                                if (typeof t.category === 'object' && t.category !== null) {
                                    return t.category._id === cat._id;
                                }
                                return t.category === cat._id;
                            });

                            return (
                                <div key={cat._id} className="relative category-dropdown">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveFilter(cat._id);
                                            setOpenDropdown(isOpen ? null : cat._id);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 font-medium text-sm md:text-base transition-all duration-300 ${isActive
                                            ? "text-orange-600"
                                            : "text-gray-600 hover:text-orange-600"
                                            }`}
                                    >
                                        <Layers className="w-5 h-5 text-orange-500" />
                                        <span>{cat.name}</span>
                                        {categoryTypes.length > 0 && (
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {/* Dropdown menu cho types */}
                                    {isOpen && categoryTypes.length > 0 && (
                                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] py-2">
                                            {categoryTypes.map((type) => (
                                                <button
                                                    key={type._id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilter(type._id);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeFilter === type._id
                                                        ? "bg-orange-50 text-orange-600"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-orange-600"
                                                        }`}
                                                >
                                                    {type.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Thanh tìm kiếm */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm giao diện theo từ khóa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-48 md:w-56 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-gray-700 text-sm"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-all duration-300">
                                <Search className="w-4 h-4" />
                                <span>Tìm giao diện</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Giao diện được mua nhiều nhất */}
            <div className="bg-white py-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Tiêu đề section */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-4 italic">
                            Giao diện web được mua nhiều nhất
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Những mẫu thiết kế web bán hàng được nhiều người dùng nhất
                        </p>
                    </div>

                    {/* Grid hiển thị templates - để trống chờ dữ liệu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Placeholder cards */}
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                {/* Placeholder hình ảnh */}
                                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                                    <div className="text-gray-300 text-center">
                                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg"></div>
                                        <span className="text-sm">Hình ảnh giao diện</span>
                                    </div>
                                </div>
                                {/* Placeholder thông tin */}
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default DesignWebPage;
'use client';

import React, { useState, useEffect, useRef } from 'react';
// Đã thay thế next/image bằng thẻ img tiêu chuẩn để tránh lỗi môi trường
import { Star } from 'lucide-react';

// Dữ liệu mẫu cho các bình luận và đánh giá (giữ nguyên)
const testimonials = [
    {
        id: 1,
        name: 'kyong',
        username: '@kyongshiiii06',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'Keploy can record and replay complex, distributed API flows as mocks and stubs. It\'s like having a time machine for your tests—saving you tons of time.',
        rating: 5,
    },
    {
        id: 2,
        name: 'yadon',
        username: '@Seipann11',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'Keploy is seriously amazing, a genius tool crushing issues at lightning speed.',
        rating: 4,
    },
    {
        id: 3,
        name: 'TadasG',
        username: '@JustADude404',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'Keploy is a tool which can automatically generate tests based on data from your running app. It simply attaches to your app, reads the data being passed through, and generates tests with real data. Pretty cool, huh?',
        rating: 5,
    },
    {
        id: 4,
        name: 'Jane Doe',
        username: '@JaneDoeDev',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'This service transformed our workflow. Highly recommend for any serious developer!',
        rating: 5,
    },
    {
        id: 5,
        name: 'John Smith',
        username: '@JohnS_Tech',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'An absolute game-changer for testing. Saves countless hours and improves reliability significantly.',
        rating: 4,
    },
    {
        id: 6,
        name: 'Alice Wonder',
        username: '@AliceW_Codes',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'Fantastic product with amazing support. Integrates seamlessly with existing projects. A must-have!',
        rating: 5,
    },
];

const App = () => {
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Tốc độ cuộn (pixel/mili giây). Giá trị dương cuộn TỪ PHẢI QUA TRÁI.
    const scrollSpeedRightToLeft = 0.5;

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        let animationFrameId: number | null = null;
        let startTime: number | null = null;
        let currentScroll = 0;

        // Khởi tạo cuộn ban đầu ở bên phải (bắt đầu từ giữa bộ nhân đôi) để cuộn từ phải sang trái
        const totalWidthInit = carousel.scrollWidth;
        let singleSetWidth = totalWidthInit / 2;
        currentScroll = singleSetWidth;
        carousel.scrollLeft = currentScroll;

        const animateScroll = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - (startTime as number);

            if (!isPaused) {
                // TÍNH TOÁN CUỘN (TỪ PHẢI QUA TRÁI)
                // Giảm scrollLeft để nội dung dịch sang trái.
                currentScroll -= scrollSpeedRightToLeft * (progress / 1000) * 60;

                // Cập nhật vị trí cuộn
                carousel.scrollLeft = currentScroll;
            }

            // LOGIC RESET LẶP VÔ HẠN (cho cuộn từ Phải -> Trái)
            // Khi cuộn về đầu (<= 0), reset về giữa bộ nhân đôi để tiếp tục mượt.
            const totalWidth = carousel.scrollWidth;
            singleSetWidth = totalWidth / 2;

            if (carousel.scrollLeft <= 0) {
                carousel.scrollLeft = singleSetWidth;
                currentScroll = singleSetWidth;
            }

            // Đảm bảo cập nhật startTime để tính toán tiến độ cuộn chính xác
            startTime = timestamp;

            animationFrameId = requestAnimationFrame(animateScroll);
        };

        animationFrameId = requestAnimationFrame(animateScroll);

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isPaused]);

    // Dừng/tiếp tục cuộn khi hover hoặc chạm vào carousel
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <section className="py-12 md:py-20 bg-white dark:bg-gray-900 overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                    Khách hàng nói gì về chúng tôi?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                    Những đánh giá chân thật từ cộng đồng tuyệt vời của chúng ta.
                </p>
            </div>

            {/* Carousel Container với hiệu ứng Fade */}
            <div className="relative">
                {/* Fade Left (tăng tính thẩm mỹ, che giấu điểm xuất phát/kết thúc) */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none"></div>

                <div
                    ref={carouselRef}
                    // Bổ sung các lớp Tailwind cần thiết cho hiệu ứng Marquee
                    className="flex overflow-x-hidden scroll-smooth whitespace-nowrap py-4 cursor-grab"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleMouseEnter}
                    onTouchEnd={handleMouseLeave}
                >
                    {/* Lặp lại danh sách testimonial 2 lần để tạo hiệu ứng cuộn vô hạn mượt mà */}
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div
                            key={`${testimonial.id}-${index}`}
                            className="inline-block w-80 md:w-96 flex-shrink-0 mx-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative border border-pink-100 dark:border-pink-900/50 transform hover:scale-[1.01]"
                        >
                            {/* Visual Hover Effect */}
                            <div className="absolute inset-0 bg-transparent group-hover:bg-pink-50/5 dark:group-hover:bg-white/5 transition-all duration-300 rounded-2xl"></div>

                            <div className="flex items-center mb-4">
                                {/* ĐÃ THAY THẾ next/image BẰNG THẺ <img> TIÊU CHUẨN */}
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    // Đảm bảo CSS cho thẻ img vẫn áp dụng đúng kích thước và kiểu dáng
                                    className="rounded-full object-cover border-2 border-pink-500 ring-2 ring-white dark:ring-gray-800 h-12 w-12"
                                />
                                <div className="ml-3 text-left">
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                                    <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">{testimonial.username}</p>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-500'}
                                    />
                                ))}
                                <span className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-300">{testimonial.rating}.0</span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-normal italic">
                                &ldquo;{testimonial.comment}&rdquo;
                            </p>
                        </div>
                    ))}
                </div>

                {/* Fade Right (tăng tính thẩm mỹ) */}
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
            </div>
        </section>
    );
};

export default App;
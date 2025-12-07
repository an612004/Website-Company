'use client';

import React, { useState } from 'react';
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
    const [isPaused, setIsPaused] = useState(false);

    // Dừng/tiếp tục cuộn khi hover hoặc chạm vào carousel
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <section className="py-12 md:py-20 bg-white dark:bg-gray-900 overflow-hidden font-sans">
            {/* CSS Animation */}
            <style jsx>{`
                @keyframes scroll-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll-left {
                    animation: scroll-left 30s linear infinite;
                }
                .animate-scroll-left:hover,
                .animate-scroll-left.paused {
                    animation-play-state: paused;
                }
            `}</style>

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
                {/* Fade Left */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none"></div>

                <div
                    className="overflow-hidden py-4"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleMouseEnter}
                    onTouchEnd={handleMouseLeave}
                >
                    <div
                        className={`flex gap-6 animate-scroll-left ${isPaused ? 'paused' : ''}`}
                        style={{ width: 'fit-content' }}
                    >
                        {/* Lặp lại danh sách testimonial 2 lần để tạo hiệu ứng cuộn vô hạn mượt mà */}
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <div
                                key={`${testimonial.id}-${index}`}
                                className="w-80 md:w-96 flex-shrink-0 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative border border-pink-100 dark:border-pink-900/50 transform hover:scale-105 hover:-translate-y-2 group"
                            >
                                {/* Visual Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover border-2 border-pink-500 ring-2 ring-white dark:ring-gray-800 h-12 w-12 transition-transform duration-300 group-hover:scale-110"
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
                                                className={`transition-all duration-300 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400 group-hover:scale-110' : 'text-gray-300 dark:text-gray-500'}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-300">{testimonial.rating}.0</span>
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-normal italic">
                                        &ldquo;{testimonial.comment}&rdquo;
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fade Right */}
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
            </div>
        </section>
    );
};

export default App;
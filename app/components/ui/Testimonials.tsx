'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

// Dữ liệu mẫu cho các bình luận và đánh giá (Đã thêm trường 'jobTitle')
interface Testimonial {
    id: number;
    name: string;
    username: string;
    jobTitle: string;
    avatar: string;
    comment: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Huy Anh',
        username: '@huyanh1999',
        jobTitle: 'Bán hàng', // Thêm nghề nghiệp
        avatar: 'https://i.pinimg.com/736x/34/5c/6d/345c6d52234bbc72407ea25d49ad945e.jpg',
        comment: 'Công Ty hỗ trợ rất nhiệt tình và chuyên nghiệp. Mình rất hài lòng với dịch vụ!',
        rating: 5,
    },
    {
        id: 2,
        name: 'Thế Nam',
        username: '@Nam11',
        jobTitle: 'Kinh doanh', // Thêm nghề nghiệp
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'Website rất dễ sử dụng và giao diện đẹp mắt. Rất ấn tượng với trải nghiệm người dùng!',
        rating: 4,
    },
    {
        id: 3,
        name: 'Minh Châu Anh',
        username: '@ChauAnhne',
        jobTitle: 'Kinh Doanh', // Thêm nghề nghiệp
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'Dịch vụ tốt và đội ngũ hỗ trợ rất tận tâm, Website hiện đại thiết kế đúng mẫu. Mình sẽ tiếp tục sử dụng trong tương lai!',
        rating: 5,
    },
    {
        id: 4,
        name: 'Anh vũ',
        username: '@LamAnhVu',
        jobTitle: 'Sinh Viên', // Thêm nghề nghiệp
        avatar: 'https://i.pinimg.com/736x/f5/77/bf/f577bf937d3af725cffd8c6974b1fccd.jpg',
        comment: 'Tài khoản Key dùng rất ok ,rất hài lòng với trải nghiệm mua sắm tại đây. Sản phẩm chất lượng và giao hàng nhanh chóng.',
        rating: 5,
    },
    {
        id: 5,
        name: 'Tùng Nguyễn',
        username: '@NguyenAnhtung1998',
        jobTitle: 'Kỹ sư', // Thêm nghề nghiệp
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        comment: 'Sản phẩm wenbsite Ok lắm , tải nhanh, giao diện thân thiện, rất dễ sử dụng, chi phí không quá măc , mình tham khảo nhiểu chỗ thấy chỗ này rẻ hơn',
        rating: 4,
    },
    {
        id: 6,
        name: 'Tâm Lê',
        username: '@ThaiTamLe',
        jobTitle: 'Giảng viên', // Thêm nghề nghiệp
        avatar: 'https://i.pinimg.com/736x/68/78/1a/68781a69af4517d39531fcf33fd9f53e.jpg',
        comment: 'Thiết kế Pofolio rất đẹp và chuyên nghiệp, tôi rất ấn tượng với cách bố trí nội dung và hình ảnh.',
        rating: 5,
    },
    {
        id: 7,
        name: 'Trâm Anh',
        username: '@anh04',
        jobTitle: 'Sinh viên', // Thêm nghề nghiệp
        avatar: 'https://i.pinimg.com/736x/db/d0/cf/dbd0cff5dfcdaa2789ce596edcbf114b.jpg',
        comment: 'Website làm đẹp lắm tải nhanh , seo tốt nữa giá cũng vừa túi tiền , Thanks AD.',
        rating: 5,
    },
    {
        id: 8,
        name: 'Long ne',
        username: '@Nguyenanhlong97',
        jobTitle: 'Văn phòng', // Thêm nghề nghiệp
        avatar: 'https://i.pinimg.com/736x/33/c9/64/33c9644ad122909901a70e1dd069c411.jpg',
        comment: 'Web làm ok , hỗ trợ nhiệt tình , tận tâm , web sài 5 tháng chưa có lỗi vặt.',
        rating: 5,
    },
    {
        id: 9,
        name: 'chopepe',
        username: '@Nguyenanhlong97',
        jobTitle: ' Xây dựng', // Thêm nghề nghiệp
        avatar: 'https://i.pinimg.com/736x/97/44/31/9744315ef0fdc8325bb62b5f848fdba5.jpg',
        comment: 'Tôi làm về 1 web bán vật tư xây dựng, nhờ có web mà doanh số tăng lên rõ rệt, khách hàng dễ dàng tìm thấy sản phẩm của tôi hơn.',
        rating: 5,
    },
    {
        id: 10,
        name: 'Lâm barber shop',
        username: '@lambarbershop',
        jobTitle: 'Thợ làm tóc', // Thêm nghề nghiệp
        avatar: 'https://i.pinimg.com/736x/ca/89/cd/ca89cd213421f03ad0a5d8db1f3fd6f5.jpg',
        comment: 'Vừa làm 1 webite cho cửa hang tóc, khách hàng phản hồi rất tốt về giao diện và tính năng đặt lịch trực tuyến.',
        rating: 5,
    },
    {
        id: 11,
        name: 'HUU PHONG',
        username: '@huuphong1389',
        jobTitle: 'Kinh doanh', // Thêm nghề nghiệp
        avatar: 'https://i.pinimg.com/736x/bd/36/19/bd3619853f73d9272739e34de87a0220.jpg',
        comment: 'Ship nhanh trong ngày đã có hàng rồi, phục vụ rất tốt.',
        rating: 5,
    },
];

const Testimonials: React.FC = () => {
    const [isPaused, setIsPaused] = useState<boolean>(false);

    // Dừng/tiếp tục cuộn khi hover hoặc chạm vào carousel
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    // Hàm hiển thị số sao dựa trên rating
    const renderStars = (rating: number) => (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={18}
                    className={`transition-all duration-300 ${i < rating ? 'text-yellow-400 fill-yellow-400 group-hover:scale-110' : 'text-gray-300 dark:text-gray-500'}`}
                />
            ))}
        </div>
    );

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
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{testimonial.jobTitle}</p> {/* Hiển thị nghề nghiệp */}
                                            <p className="text-xs text-pink-600 dark:text-pink-400">{testimonial.username}</p> {/* Hiển thị username */}
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex items-center mb-4">
                                        {renderStars(testimonial.rating)}
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

export default Testimonials;
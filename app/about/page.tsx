import Header from "../components/layout/Header";
import React from "react";
import Footer from "../components/layout/Footer";
import OurTeam from "../components/ui/about/OurTeam";
import FAQs from "../components/ui/about/FAQs";
import Image from 'next/image';
// ... các ảnh khác

function About() {
    // Đoạn giới thiệu dùng JSX thay vì chuỗi có HTML
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* --- Phần Giới Thiệu Chính --- */}
            <main className="flex-grow py-12 md:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">

                        {/* Cột Trái: Văn bản Giới thiệu */}
                        <div className="lg:w-1/2 relative bg-white p-6 md:p-10 rounded-lg shadow-lg lg:shadow-none"
                            style={{
                                // Mô phỏng hiệu ứng nền cong như trong hình
                                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)',
                                zIndex: 1 // Đảm bảo văn bản nổi bật
                            }}>
                            <p className="text-xl font-semibold text-gray-700 mb-2">Về chúng tôi</p>
                            <h2 className="text-5xl md:text-6xl font-extrabold text-red-400 mb-6 border-b-4 border-[#eed388] inline-block pb-1">
                                Anbi
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Khởi đầu từ tháng 03/2017 với khát vọng tạo ra những sản phẩm công nghệ hữu ích,
                                <span className="text-red-400 font-bold">Anbi Technology</span>
                                đã từng bước xây dựng vị thế trong lĩnh vực thiết kế Website và giải pháp phần mềm cho doanh nghiệp. Hơn 6 năm đồng hành cùng khách hàng, chúng tôi luôn đề cao chất lượng, sáng tạo và sự tử tế trong từng dự án, xem sự hài lòng của khách hàng là thành công lớn nhất.
                            </p>
                            {/* Nút Khám Phá */}
                            <button className="flex items-center space-x-2 text-lg font-bold text-[#FF5733] uppercase hover:text-[#e04526] transition duration-300">
                                <div className="bg-[#FF5733] text-white p-2 rounded-full shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <span>KHÁM PHÁ</span>
                            </button>
                        </div>
                        {/* Cột Phải: Hình ảnh */}
                        <div className="lg:w-1/2 w-full grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-lg shadow-inner">
                            {/* Hàng 1: Ảnh lớn (Team Photo) */}
                            <div className="col-span-3">
                                <div className="bg-gray-200 h-40 md:h-56 rounded-lg flex items-center justify-center text-gray-400 text-lg">No Image</div>
                            </div>
                            {/* Hàng 2: Các ảnh nhỏ (mô phỏng bố cục) */}
                            <div className="col-span-1">
                                <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                            </div>
                            <div className="col-span-1">
                                <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                            </div>
                            <div className="col-span-1">
                                {/* Thêm một ảnh nữa nếu có, hoặc để trống để mô phỏng khoảng trắng */}
                                <div className="bg-gray-200 h-32 rounded-lg"></div>
                            </div>
                            {/* ... Thêm các div ảnh khác để mô phỏng lưới ảnh (như trong hình gốc) ... */}
                        </div>
                    </div>
                </div>
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <section className="py-10 md:py-16 lg:py-20 bg-white rounded-3xl shadow-2xl border border-gray-200 w-full mt-16">
                        <div className="text-center mb-10 md:mb-16">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                                SỨ MỆNH CỦA CHÚNG TÔI
                            </h3>
                            <p className="mt-2 text-base text-gray-600 max-w-2xl mx-auto">
                                Tại Anbi Technology, chúng tôi cam kết mang đến những giải pháp công nghệ tiên tiến, giúp doanh nghiệp tối ưu hóa hoạt động và phát triển bền vững trong kỷ nguyên số.
                            </p>
                        </div>
                        <div className="flex justify-center mt-6">
                            <Image
                                src="/images/mission-bottom.jpg"
                                alt="Sứ mệnh Anbi Technology"
                                width={700}
                                height={300}
                                className="rounded-2xl shadow-lg object-cover w-full max-w-2xl"
                            />
                        </div>
                    </section>

                </div>
            </main>
            <OurTeam />
            <FAQs />
            <Footer />
        </div>
    );
}

export default About;
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Sử dụng Link từ next/link để tối ưu hóa điều hướng

interface Blog {
    _id: string;
    title: string;
    thumbnail: string;
    description: string;
    slug: string;
    createdAt: string;
    isFeatured: boolean;
}

// Hàm định dạng ngày tháng
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const Blogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchFeaturedBlogs = async () => {
            setLoading(true);
            setError(false);
            try {
                // Giả định đường dẫn API là chính xác và trả về dữ liệu đúng định dạng
                const res = await fetch("/api/blogs?isPublished=true");

                if (!res.ok) {
                    throw new Error("Lỗi khi tải dữ liệu");
                }

                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    // Lọc các bài viết nổi bật và chỉ hiển thị tối đa 6 bài
                    const featuredBlogs = (data.data as Blog[])
                        .filter((b) => b.isFeatured)
                        .slice(0, 6); // Giới hạn số lượng để bố cục đẹp hơn
                    setBlogs(featuredBlogs);
                } else {
                    setBlogs([]);
                }
            } catch (e) {
                console.error("Lỗi khi tải bài viết nổi bật:", e);
                setError(true);
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedBlogs();
    }, []);

    return (
        // Thêm màu nền nhạt (bg-gray-50) để làm nổi bật nội dung hơn, thêm lớp max-w-7xl để container rộng hơn
        <div className="w-full flex justify-center">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="py-10 md:py-16 lg:py-20 bg-gray-50 rounded-2xl shadow-sm w-full">

                    {/* Phần Tiêu đề */}
                    <div className="text-center mb-10 md:mb-16">
                        {/* Sử dụng màu xanh sâu (blue-800) và font nặng hơn (extrabold) */}
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                            BÀI VIẾT NỔI BẬT
                        </h3>
                        {/* Màu xám tối hơn để dễ đọc, max-w-2xl để căn giữa đoạn mô tả */}
                        <p className="mt-2 text-base text-gray-600 max-w-2xl mx-auto">
                            Cập nhật liên tục các thông tin, kiến thức và xu hướng mới nhất về Phát triển Phần Mềm và Công nghệ.
                        </p>
                    </div>

                    {/* Hiển thị Trạng thái */}
                    {loading ? (
                        <div className="text-center py-20 text-xl font-medium text-blue-600">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tải bài viết...
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-xl text-red-500 bg-red-50 border border-red-200 rounded-lg p-6">
                            ❌ Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20 text-xl text-gray-500 bg-white border border-gray-200 rounded-lg p-6">
                            📝 Chưa có bài viết nổi bật nào được đăng.
                        </div>
                    ) : (
                        /* Lưới Bài viết */
                        // Thêm gap lớn hơn và tối ưu hiển thị trên các kích thước màn hình
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                            {blogs.map((blog) => (
                                // Sử dụng Link từ next/link để cải thiện hiệu suất
                                <Link
                                    key={blog._id}
                                    href={`/news/${blog.slug}`}
                                    // Thẻ bài viết: nền trắng, bo tròn lớn hơn (rounded-2xl), đổ bóng nhẹ (shadow-lg), hiệu ứng hover tinh tế
                                    className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 transform hover:-translate-y-1"
                                >
                                    {/* Hình ảnh */}
                                    <div className="relative w-full h-40 md:h-48">
                                        <Image
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            // Hiệu ứng zoom nhẹ khi hover
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            priority={blog === blogs[0]} // Ưu tiên tải hình ảnh đầu tiên
                                        />
                                        {/* Tag 'Nổi bật' ở góc trên */}
                                        <span className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                            Nổi bật
                                        </span>
                                    </div>

                                    {/* Nội dung bài viết */}
                                    <div className="p-3 md:p-4">
                                        {/* Tiêu đề: font đậm, cỡ chữ lớn hơn, màu xám tối (gray-900), hiệu ứng đổi màu khi hover */}
                                        <h3 className="font-bold text-base md:text-lg text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors duration-300">
                                            {blog.title}
                                        </h3>
                                        {/* Mô tả: màu xám nhạt hơn (gray-500) */}
                                        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                                            {blog.description}
                                        </p>

                                        {/* Ngày tạo */}
                                        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                                            <span className="text-xs text-gray-400 font-medium flex items-center">
                                                <svg className="w-3.5 h-3.5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                {formatDate(blog.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Thêm nút CTA (nếu cần) */}
                    {blogs.length > 0 && (
                        <div className="text-center mt-8 md:mt-10">
                            <Link
                                href="/news"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                            >
                                Xem Tất Cả Bài Viết
                                <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>
                    )}

                </section>
            </div>
        </div>
    );
};

export default Blogs;
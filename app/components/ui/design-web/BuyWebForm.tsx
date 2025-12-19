import React, { useState } from "react";

// Định nghĩa props cho component
interface BuyWebFormProps {
    productName?: string;
    productPrice?: number;
    productOriginalPrice?: number;
}

// Hàm tiện ích để định dạng giá tiền (ví dụ: 1000000₫)
const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '';
    return price.toLocaleString('vi-VN') + '₫'; // Dùng 'vi-VN' để đảm bảo dấu phân cách đúng chuẩn Việt Nam
};

export default function BuyWebForm({ productName, productPrice, productOriginalPrice }: BuyWebFormProps) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
    });
    const [submitted, setSubmitted] = useState(false);
    // State để kiểm soát thông báo lỗi (ví dụ: nếu gửi thất bại)
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null); // Xóa lỗi khi người dùng bắt đầu nhập lại
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setError(null);
    };

    return (
        // 🎨 Thiết kế form: Bo góc lớn hơn, đổ bóng sâu (shadow-2xl), border nhẹ
        <form
            onSubmit={handleSubmit}
            className="max-w-sm w-full mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-100"
            style={{ minWidth: 0 }}
        >
            {/* 🎯 Tiêu đề & Thông tin sản phẩm (Đã cải tiến) */}
            <div className="text-center pb-2 border-b border-gray-100">
                <h2 className="text-3xl font-extrabold text-blue-700 mb-1">
                    Đăng ký tư vấn
                </h2>
                <p className="text-gray-500 mb-4">
                    Để nhận báo giá và tư vấn miễn phí, vui lòng điền thông tin chi tiết.
                </p>

                {/* 🏷️ Box thông tin sản phẩm */}
                {(productName || typeof productPrice === 'number') && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        {productName && (
                            <p className="text-base font-semibold text-gray-800">
                                Gói website: <span className="text-blue-600 font-bold">{productName}</span>
                            </p>
                        )}
                        {(typeof productOriginalPrice === 'number' || typeof productPrice === 'number') && (
                            <p className="mt-1 text-sm">
                                {typeof productOriginalPrice === 'number' && (
                                    <span className="text-gray-500 line-through mr-3">{formatPrice(productOriginalPrice)}</span>
                                )}
                                {typeof productPrice === 'number' && (
                                    <span className="text-red-600 text-xl font-extrabold">
                                        Giá ưu đãi: {formatPrice(productPrice)}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 📁 Nhóm trường nhập liệu */}

            {/* Trường Họ tên */}
            <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Họ tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 transition duration-300 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 placeholder-gray-400"
                        placeholder="Nhập họ và tên của bạn"
                    />
                </div>
            </div>

            {/* Trường Số điện thoại */}
            <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                    Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <i className="fas fa-phone-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 transition duration-300 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 placeholder-gray-400"
                        placeholder="Ví dụ: 090xxxxxxx"
                    />
                </div>
            </div>

            {/* Trường Email */}
            <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email
                </label>
                <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 transition duration-300 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 placeholder-gray-400"
                        placeholder="abc@example.com"
                    />
                </div>
            </div>

            {/* 🚀 Nút Submit */}
            <button
                type="submit"
                // Màu xanh dương chủ đạo, hiệu ứng hover/shadow rõ ràng
                className="w-full bg-blue-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:shadow-none"
                disabled={submitted} // Vô hiệu hóa nút sau khi gửi
            >
                {submitted ? (
                    <>
                        <i className="fas fa-check-circle mr-2"></i> Đã gửi thành công!
                    </>
                ) : (
                    "Gửi đăng ký tư vấn ngay"
                )}
            </button>

            {/* ✅ Thông báo thành công */}
            {submitted && (
                <div className="flex items-center p-3 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200" role="alert">
                    <i className="fas fa-thumbs-up w-5 h-5 mr-3"></i>
                    <span className="font-medium">Tuyệt vời!</span> Chúng tôi đã nhận được thông tin và sẽ liên hệ với bạn trong thời gian sớm nhất.
                </div>
            )}

            {/* ❌ Thông báo lỗi (nếu có) */}
            {error && (
                <div className="flex items-center p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200" role="alert">
                    <i className="fas fa-exclamation-circle w-5 h-5 mr-3"></i>
                    <span className="font-medium">Lỗi:</span> {error}
                </div>
            )}

        </form>
    );
}
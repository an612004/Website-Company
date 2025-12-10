"use client";
import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Phone, Mail, MapPin, Globe, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function ContactPage() {
    // State cho form
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [submitMessage, setSubmitMessage] = useState("");

    // Chuẩn hóa số điện thoại Việt Nam
    const normalizePhoneNumber = (phone: string): string => {
        // Loại bỏ tất cả ký tự không phải số và dấu +
        let cleaned = phone.replace(/[^\d+]/g, "");

        // Nếu bắt đầu bằng +84, chuyển thành 0
        if (cleaned.startsWith("+84")) {
            cleaned = "0" + cleaned.slice(3);
        }
        // Nếu bắt đầu bằng 84 (không có +), chuyển thành 0
        else if (cleaned.startsWith("84") && cleaned.length > 10) {
            cleaned = "0" + cleaned.slice(2);
        }

        return cleaned;
    };

    // Validate số điện thoại Việt Nam
    const isValidVietnamesePhone = (phone: string): boolean => {
        const normalized = normalizePhoneNumber(phone);
        // Số điện thoại VN: 10 số, bắt đầu bằng 0, số thứ 2 là 3,5,7,8,9
        const vnPhoneRegex = /^0(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
        return vnPhoneRegex.test(normalized);
    };

    // Xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Xử lý đặc biệt cho số điện thoại
        if (name === "phone") {
            // Chỉ cho phép nhập số, dấu + và khoảng trắng
            const phoneValue = value.replace(/[^\d+\s-]/g, "");
            setFormData((prev) => ({ ...prev, [name]: phoneValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Xóa lỗi khi user bắt đầu nhập
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên của bạn";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Tên phải có ít nhất 2 ký tự";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập địa chỉ email";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Địa chỉ email không hợp lệ";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!isValidVietnamesePhone(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)";
        }

        if (!formData.service.trim()) {
            newErrors.service = "Vui lòng cho biết dịch vụ bạn cần";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Vui lòng nhập nội dung lời nhắn";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Nội dung phải có ít nhất 10 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const response = await fetch("/api/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: normalizePhoneNumber(formData.phone),
                    service: formData.service.trim(),
                    message: formData.message.trim(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus("success");
                setSubmitMessage(data.message || "Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    service: "",
                    message: "",
                });
            } else {
                setSubmitStatus("error");
                setSubmitMessage(data.error || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Submit error:", error);
            setSubmitStatus("error");
            setSubmitMessage("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section - Banner liên hệ (Sử dụng ảnh nền) */}
            <div className="relative w-full h-[220px] md:h-[280px] flex flex-col items-center justify-center overflow-hidden">

                {/* 🖼️ Ảnh nền và Lớp phủ (Background Image & Overlay) */}
                <div className="absolute inset-0">
                    {/* Thay 'duong_dan_den_anh_cua_ban.jpg' bằng URL hoặc đường dẫn import của ảnh bạn muốn */}
                    <img
                        src="https://i.pinimg.com/736x/a2/4b/f3/a24bf346b214d06cbd3ab4f84f9c2447.jpg" // ⬅️ THAY ĐỔI ĐƯỜNG DẪN NÀY
                        alt="Background Banner"
                        className="w-full h-full object-cover"
                    />
                    {/* Lớp phủ tối mờ để chữ trắng dễ đọc hơn */}
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <p className="text-white/80 text-sm md:text-base font-medium tracking-widest mb-3 uppercase animate-fade-in">
                        ✨ Anbi Company
                    </p>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-white/90 text-sm md:text-base mt-3 max-w-md mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Form liên hệ */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Gửi tin nhắn</h2>
                            <p className="text-gray-500 mb-6">Điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất!</p>

                            {/* Thông báo trạng thái */}
                            {submitStatus === "success" && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <p className="text-green-700">{submitMessage}</p>
                                </div>
                            )}

                            {submitStatus === "error" && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
                                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700">{submitMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Tên của bạn"
                                            className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 bg-gray-50 hover:bg-white transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Địa chỉ email"
                                            className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 bg-gray-50 hover:bg-white transition-colors ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Số điện thoại"
                                            className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 bg-gray-50 hover:bg-white transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"
                                                }`}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            placeholder="Bạn cần dịch vụ gì?"
                                            className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 bg-gray-50 hover:bg-white transition-colors ${errors.service ? "border-red-400 bg-red-50" : "border-gray-200"
                                                }`}
                                        />
                                        {errors.service && (
                                            <p className="mt-1 text-sm text-red-500">{errors.service}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Nội dung lời nhắn..."
                                        rows={5}
                                        className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 bg-gray-50 hover:bg-white transition-colors resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-gray-200"
                                            }`}
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group w-full md:w-auto md:self-start bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] disabled:hover:scale-100 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            ĐANG GỬI...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            GỬI TIN NHẮN
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 h-full">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Thông tin liên hệ</h2>
                            <p className="text-gray-500 mb-6">Công ty TNHH Truyền thông và Dịch Vụ Anbi</p>

                            <div className="space-y-5">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Văn phòng TPHCM</p>
                                        <p className="text-gray-600 text-sm mt-1">Toà nhà Thanh Niên Holdings, Số 633 Trần Xuân Soạn, P. Tân Hưng, Quận 7 (Tầng 3)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Điện thoại</p>
                                        <a href="tel:0847755599" className="text-blue-600 hover:text-blue-700 font-semibold text-lg mt-1 block">084.77555.99</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Email</p>
                                        <a href="mailto:cskh@websiteviet.vn" className="text-green-600 hover:text-green-700 font-semibold mt-1 block">cskh@websiteviet.vn</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Website</p>
                                        <a href="https://websiteviet.vn" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-semibold mt-1 block">websiteviet.vn</a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Icons */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-gray-600 font-medium mb-4">Theo dõi chúng tôi</p>
                                <div className="flex gap-3">
                                    <a href="#" className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300" title="Facebook">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" /></svg>
                                    </a>
                                    <a href="#" className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300" title="Instagram">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </a>
                                    <a href="#" className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300" title="Youtube">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                    </a>
                                    <a href="#" className="w-11 h-11 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300" title="LinkedIn">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </a>
                                    <a href="#" className="w-11 h-11 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300" title="Zalo">
                                        <span className="font-bold text-sm">Zalo</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bản đồ công ty */}
                <div className="mt-12 md:mt-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Vị trí của chúng tôi</h2>
                        <p className="text-gray-500">Ghé thăm văn phòng Anbi Company</p>
                    </div>
                    <div className="w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.726964963812!2d106.6878720758697!3d10.75534125961459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1e7e7e7e7e%3A0x123456789abcdef!2zQ8O0bmcgdHkgV2Vic2l0ZSBWaWV0!5e0!3m2!1svi!2s!4v1701360000000!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Bản đồ công ty Anbi"
                        ></iframe>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ContactPage;
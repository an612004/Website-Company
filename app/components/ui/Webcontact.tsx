'use client'
import React, { useState } from 'react';
import { FaPaperPlane, FaUser, FaPhone, FaEnvelope, FaCommentAlt, FaCheckCircle, FaSpinner, FaBox, FaIndustry } from 'react-icons/fa';

function Webcontact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        servicePackage: '',
        industry: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Validate phone number: must start with 0 or +84, and have correct length
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    // Validate email format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate all required fields
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ và tên';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email không đúng định dạng';
        }

        // Subject validation
        if (!formData.subject) {
            newErrors.subject = 'Vui lòng chọn nội dung quan tâm';
        }

        // Service package validation
        if (!formData.servicePackage) {
            newErrors.servicePackage = 'Vui lòng chọn gói dịch vụ';
        }

        // Industry validation
        if (!formData.industry) {
            newErrors.industry = 'Vui lòng chọn lĩnh vực';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const subjectOptions = [
        { value: '', label: 'Chọn nội dung quan tâm' },
        { value: 'thiet-ke-website', label: 'Thiết kế Website' },
        { value: 'thiet-ke-crm-erp', label: 'Thiết kế CRM - ERP' },
        // { value: 'san-pham-so', label: 'Sản Phẩm Số' },
        // { value: 'phan-cung-thiet-bi', label: 'Phần cứng Thiết Bị' },
    ];

    const servicePackageOptions = [
        { value: '', label: 'Chọn gói dịch vụ' },
        { value: 'goi-co-ban', label: 'Gói Cơ Bản - 3 Triệu' },
        { value: 'goi-nang-cao', label: 'Gói Nâng Cao - 7-10 Triệu' },
        { value: 'goi-cao-cap', label: 'Gói Cao Cấp - 15-20 Triệu' },
        { value: 'goi-tuy-chinh', label: 'Gói Tùy Chỉnh - Liên hệ báo giá' },
    ];

    const industryOptions = [
        { value: '', label: 'Chọn lĩnh vực' },
        { value: 'thuong-mai-dien-tu', label: 'Thương mại điện tử' },
        { value: 'bat-dong-san', label: 'Bất động sản' },
        { value: 'giao-duc', label: 'Giáo dục / Đào tạo' },
        { value: 'y-te', label: 'Y tế / Sức khỏe' },
        { value: 'nha-hang-khach-san', label: 'Nhà hàng / Khách sạn' },
        { value: 'cong-nghe', label: 'Công nghệ / Phần mềm' },
        { value: 'thoi-trang', label: 'Thời trang / Làm đẹp' },
        { value: 'san-xuat', label: 'Sản xuất / Công nghiệp' },
        { value: 'khac', label: 'Lĩnh vực khác' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submitting
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('📤 [Webcontact] Đang gửi form liên hệ...', {
                name: formData.name.trim(),
                phone: formData.phone.replace(/\s/g, ''),
                email: formData.email.toLowerCase().trim(),
                subject: formData.subject,
                servicePackage: formData.servicePackage,
                industry: formData.industry,
            });

            // Gọi API để lưu thông tin liên hệ
            const response = await fetch('/api/contact-web', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    phone: formData.phone.replace(/\s/g, ''),
                    email: formData.email.toLowerCase().trim(),
                    subject: formData.subject,
                    servicePackage: formData.servicePackage,
                    industry: formData.industry,
                    message: formData.message?.trim() || '',
                }),
            });

            const data = await response.json();
            console.log('📥 [Webcontact] Response từ API contact-web:', data);

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Có lỗi xảy ra');
            }

            console.log('✅ [Webcontact] Lưu liên hệ thành công, đang gửi email xác nhận...');

            // Gửi email xác nhận (không block flow nếu thất bại)
            try {
                const emailResponse = await fetch('/api/send-contact-confirmation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        phone: formData.phone.replace(/\s/g, ''),
                        email: formData.email.toLowerCase().trim(),
                        subject: formData.subject,
                        servicePackage: formData.servicePackage,
                        industry: formData.industry,
                        message: formData.message?.trim() || '',
                    }),
                });
                const emailData = await emailResponse.json();
                console.log('📧 [Webcontact] Response gửi email:', emailData);
            } catch (emailError) {
                console.error('❌ [Webcontact] Lỗi gửi email xác nhận:', emailError);
                // Không throw error vì form đã submit thành công
            }

            setIsSubmitted(true);
            console.log('🎉 [Webcontact] Form submit hoàn tất!');

            // Reset after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: '', phone: '', email: '', subject: '', servicePackage: '', industry: '', message: '' });
                setErrors({});
            }, 3000);
        } catch (error) {
            console.error('❌ [Webcontact] Lỗi submit form:', error);
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reusable input style
    const inputBaseClass = "w-full pl-11 pr-4 py-3 bg-white border rounded-lg text-gray-700 text-sm placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300";
    const selectBaseClass = "w-full pl-11 pr-9 py-3 bg-white border rounded-lg text-gray-700 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer";
    const errorInputClass = "border-red-400 focus:border-red-500 focus:ring-red-500/20";

    return (
        <section id="contact-form" className="relative py-16 px-4 bg-gradient-to-b from-gray-50 to-white scroll-mt-20 overflow-hidden">
            {/* Decorative Background Elements */}

            {/* Abstract Shapes - Top Left */}
            <div className="absolute top-0 left-0 w-64 h-64 opacity-[0.07] animate-[spin_20s_linear_infinite]">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f97316" strokeWidth="2" />
                    <circle cx="80" cy="80" r="30" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                    <path d="M20 100 Q60 60 100 100 T180 100" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
                </svg>
            </div>

            {/* Abstract Lines - Top Right */}
            <div className="absolute top-10 right-0 w-72 h-72 opacity-[0.06] animate-[pulse_4s_ease-in-out_infinite]">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <line x1="0" y1="40" x2="200" y2="40" stroke="#f97316" strokeWidth="1" />
                    <line x1="0" y1="80" x2="150" y2="80" stroke="#3b82f6" strokeWidth="1" />
                    <line x1="50" y1="120" x2="200" y2="120" stroke="#8b5cf6" strokeWidth="1" />
                    <circle cx="180" cy="40" r="8" fill="#f97316" />
                    <circle cx="150" cy="80" r="6" fill="#3b82f6" />
                    <circle cx="50" cy="120" r="5" fill="#8b5cf6" />
                </svg>
            </div>

            {/* Dotted Pattern - Left Side */}
            <div className="absolute left-4 top-1/3 w-20 h-40 opacity-[0.08] animate-[bounce_3s_ease-in-out_infinite]">
                <svg viewBox="0 0 80 160" className="w-full h-full">
                    {[...Array(8)].map((_, i) => (
                        [...Array(4)].map((_, j) => (
                            <circle key={`${i}-${j}`} cx={10 + j * 20} cy={10 + i * 20} r="3" fill="#f97316" />
                        ))
                    ))}
                </svg>
            </div>

            {/* Curved Lines - Bottom Left */}
            <div className="absolute bottom-0 left-0 w-80 h-80 opacity-[0.05]">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                    <path d="M0 300 Q150 200 300 300" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <path d="M0 280 Q120 200 240 280" fill="none" stroke="#f97316" strokeWidth="1.5" />
                    <path d="M0 260 Q100 180 200 260" fill="none" stroke="#8b5cf6" strokeWidth="1" />
                </svg>
            </div>

            {/* Geometric Shapes - Right Side */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-48 opacity-[0.06] animate-[spin_25s_linear_infinite_reverse]">
                <svg viewBox="0 0 100 200" className="w-full h-full">
                    <rect x="10" y="10" width="40" height="40" fill="none" stroke="#f97316" strokeWidth="2" transform="rotate(15 30 30)" />
                    <polygon points="50,80 70,120 30,120" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x="20" y="140" width="60" height="30" rx="5" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
                </svg>
            </div>

            {/* Wave Pattern - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-[0.04]">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="#f97316" />
                    <path d="M0,80 C200,40 400,120 600,80 C800,40 1000,120 1200,80" fill="none" stroke="#3b82f6" strokeWidth="2" />
                </svg>
            </div>

            {/* Floating Decorative Elements with enhanced animations */}
            <div className="absolute top-20 left-1/4 w-3 h-3 bg-orange-400 rounded-full opacity-40 animate-[float_3s_ease-in-out_infinite]"></div>
            <div className="absolute top-40 right-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-[float_4s_ease-in-out_infinite_0.5s]"></div>
            <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-purple-400 rounded-full opacity-30 animate-[float_5s_ease-in-out_infinite_1s]"></div>
            <div className="absolute top-1/2 right-10 w-2 h-2 bg-orange-500 rounded-full opacity-40 animate-[float_3.5s_ease-in-out_infinite_1.5s]"></div>
            <div className="absolute top-1/3 left-10 w-3 h-3 bg-cyan-400 rounded-full opacity-35 animate-[float_4.5s_ease-in-out_infinite_2s]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-45 animate-[float_3s_ease-in-out_infinite_0.8s]"></div>

            {/* Cross/Plus Marks with rotation */}
            <div className="absolute top-32 right-1/3 opacity-[0.15] animate-[spin_8s_linear_infinite]">
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <line x1="10" y1="0" x2="10" y2="20" stroke="#f97316" strokeWidth="2" />
                    <line x1="0" y1="10" x2="20" y2="10" stroke="#f97316" strokeWidth="2" />
                </svg>
            </div>
            <div className="absolute bottom-40 left-1/4 opacity-[0.12] animate-[spin_10s_linear_infinite_reverse]">
                <svg width="16" height="16" viewBox="0 0 20 20">
                    <line x1="10" y1="0" x2="10" y2="20" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="0" y1="10" x2="20" y2="10" stroke="#3b82f6" strokeWidth="2" />
                </svg>
            </div>
            <div className="absolute top-1/2 left-20 opacity-[0.1] animate-[spin_12s_linear_infinite]">
                <svg width="14" height="14" viewBox="0 0 20 20">
                    <line x1="10" y1="0" x2="10" y2="20" stroke="#8b5cf6" strokeWidth="2" />
                    <line x1="0" y1="10" x2="20" y2="10" stroke="#8b5cf6" strokeWidth="2" />
                </svg>
            </div>

            {/* Sparkle effects */}
            <div className="absolute top-24 right-20 animate-[sparkle_2s_ease-in-out_infinite]">
                <svg width="12" height="12" viewBox="0 0 24 24" className="text-yellow-400 opacity-60">
                    <path fill="currentColor" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </div>
            <div className="absolute bottom-48 right-32 animate-[sparkle_2.5s_ease-in-out_infinite_0.5s]">
                <svg width="10" height="10" viewBox="0 0 24 24" className="text-orange-400 opacity-50">
                    <path fill="currentColor" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </div>
            <div className="absolute top-1/3 left-32 animate-[sparkle_3s_ease-in-out_infinite_1s]">
                <svg width="8" height="8" viewBox="0 0 24 24" className="text-blue-400 opacity-40">
                    <path fill="currentColor" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header with fade in animation */}
                <div className="text-center mb-10 animate-[fadeInDown_0.8s_ease-out]">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Gửi thông tin liên hệ
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn miễn phí cho bạn.
                    </p>
                </div>

                {/* Form Card with slide up animation */}
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 md:p-8 border border-gray-100 animate-[fadeInUp_0.8s_ease-out_0.2s_both] hover:shadow-xl hover:shadow-gray-300/50 transition-shadow duration-500">
                    {isSubmitted ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Gửi thành công!</h3>
                            <p className="text-gray-500 text-sm">Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Row 1: Name & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="relative">
                                        <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.name ? 'text-red-400' : focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Họ và tên *"
                                            className={`${inputBaseClass} ${errors.name ? errorInputClass : 'border-gray-200'}`}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <div className="relative">
                                        <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.phone ? 'text-red-400' : focusedField === 'phone' ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('phone')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Số điện thoại * (VD: 0912345678)"
                                            className={`${inputBaseClass} ${errors.phone ? errorInputClass : 'border-gray-200'}`}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Row 2: Email & Subject */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="relative">
                                        <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.email ? 'text-red-400' : focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Email *"
                                            className={`${inputBaseClass} ${errors.email ? errorInputClass : 'border-gray-200'}`}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <div className="relative">
                                        <FaCommentAlt className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${errors.subject ? 'text-red-400' : focusedField === 'subject' ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('subject')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`${selectBaseClass} ${errors.subject ? errorInputClass : 'border-gray-200'}`}
                                        >
                                            {subjectOptions.map(option => (
                                                <option key={option.value} value={option.value} disabled={option.value === ''}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {errors.subject && <p className="text-red-500 text-xs mt-1 ml-1">{errors.subject}</p>}
                                </div>
                            </div>

                            {/* Row 3: Service Package & Industry */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="relative">
                                        <FaBox className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${errors.servicePackage ? 'text-red-400' : focusedField === 'servicePackage' ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <select
                                            name="servicePackage"
                                            value={formData.servicePackage}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('servicePackage')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`${selectBaseClass} ${errors.servicePackage ? errorInputClass : 'border-gray-200'}`}
                                        >
                                            {servicePackageOptions.map(option => (
                                                <option key={option.value} value={option.value} disabled={option.value === ''}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {errors.servicePackage && <p className="text-red-500 text-xs mt-1 ml-1">{errors.servicePackage}</p>}
                                </div>
                                <div>
                                    <div className="relative">
                                        <FaIndustry className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${errors.industry ? 'text-red-400' : focusedField === 'industry' ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <select
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('industry')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`${selectBaseClass} ${errors.industry ? errorInputClass : 'border-gray-200'}`}
                                        >
                                            {industryOptions.map(option => (
                                                <option key={option.value} value={option.value} disabled={option.value === ''}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {errors.industry && <p className="text-red-500 text-xs mt-1 ml-1">{errors.industry}</p>}
                                </div>
                            </div>

                            {/* Row 4: Message */}
                            <div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Nội dung yêu cầu của bạn..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-md shadow-orange-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                                >
                                    {isSubmitting ? (
                                        <FaSpinner className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Gửi yêu cầu</span>
                                            <FaPaperPlane className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Custom Keyframes */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
                    50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </section>
    );
}

export default Webcontact;
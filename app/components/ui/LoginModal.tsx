"use client";
import React, { useEffect, useRef, useState } from 'react';
import EmailOtpModal from './EmailOtpModal';
// Import icons nếu bạn sử dụng thư viện như react-icons
import { FcGoogle } from 'react-icons/fc';
import { Mail, Loader2, X } from 'lucide-react'; // Sử dụng Lucide Icons cho giao diện tối giản

type Props = {
    open: boolean;
    onClose: () => void;
    onGoogleSignIn?: () => Promise<void> | void;
    onGoogleSignInRedirect?: () => Promise<void> | void;
};

export default function LoginModal({ open, onClose, onGoogleSignIn, onGoogleSignInRedirect }: Props) {
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otpOpen, setOtpOpen] = useState(false);

    // Xử lý Focus và phím Escape
    useEffect(() => {
        if (!open) return;
        const prev = document.activeElement as HTMLElement | null;
        const dialog = dialogRef.current;
        dialog?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('keydown', onKey);
            prev?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

    // Hàm xử lý đăng nhập Google
    const handleGoogleSignIn = async () => {
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            if (onGoogleSignIn) {
                await onGoogleSignIn();
            }
            // Logic thành công được xử lý bởi component cha
        } catch (err: unknown) {
            console.error(err);
            const code = (err as { code?: string } | undefined)?.code || '';
            const msg = err instanceof Error ? err.message : String(err);

            if (code.includes('popup')) {
                // Fallback to redirect
                if (onGoogleSignInRedirect) {
                    try {
                        await onGoogleSignInRedirect();
                        return; // redirect sẽ rời khỏi trang
                    } catch (e) {
                        console.error('Redirect fallback failed', e);
                    }
                }
                setError('Lỗi: Cửa sổ Pop-up bị chặn hoặc hủy. Vui lòng thử lại.');
            } else {
                setError(msg || 'Đăng nhập thất bại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} // Thay thế bg-black/50 bằng màu đen đậm hơn cho chế độ tối
        >
            {/* Vùng nền */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Container */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform scale-100 transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Đóng"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full p-2 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        {/* Biểu tượng hoặc Logo */}
                        <div className="mx-auto mb-3 w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Chào mừng trở lại!</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Đăng nhập để truy cập tài khoản của bạn.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Button Đăng nhập bằng Google */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 
                                ${loading ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'} 
                                border border-gray-200 dark:border-gray-600 rounded-xl font-semibold 
                                text-gray-800 dark:text-white transition duration-300 transform hover:scale-[1.01] 
                                shadow-md disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 mr-2 animate-spin text-gray-500" />
                            ) : (
                                <FcGoogle className="w-6 h-6" /> // Sử dụng icon Google hiện đại
                            )}
                            <span className="text-base">
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}
                            </span>
                        </button>

                        {/* Tùy chọn: Gửi OTP đến Gmail */}
                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
                            <span className="flex-shrink mx-4 text-sm text-gray-400 dark:text-gray-500">HOẶC</span>
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
                        </div>

                        <button
                            onClick={() => {
                                setOtpOpen(true);
                            }}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 
                                bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold 
                                transition duration-300 transform hover:scale-[1.01] shadow-lg shadow-orange-500/40"
                        >
                            <Mail className="w-5 h-5" />
                            <span className="text-base">Đăng nhập bằng Email & OTP</span>
                        </button>

                        {/* Hiển thị Lỗi */}
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Điều khoản và Chính sách */}
                        <p className="pt-4 text-xs text-center text-gray-400 dark:text-gray-500">
                            Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="underline hover:text-orange-600 dark:hover:text-orange-400">Điều khoản Dịch vụ</a> và <a href="#" className="underline hover:text-orange-600 dark:hover:text-orange-400">Chính sách Quyền riêng tư</a> của chúng tôi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Email OTP Modal: Hiển thị đè lên modal đăng nhập */}
            <EmailOtpModal open={otpOpen} onClose={() => setOtpOpen(false)} />
        </div>
    );
}
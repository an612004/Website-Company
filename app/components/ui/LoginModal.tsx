import React, { useEffect, useRef, useState } from 'react';
import EmailOtpModal from './EmailOtpModal';

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

    useEffect(() => {
        if (!open) return;
        const prev = document.activeElement as HTMLElement | null;
        const dialog = dialogRef.current;
        dialog?.focus();
        return () => {
            prev?.focus();
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div
                ref={dialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Đăng nhập</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tiếp tục với tài khoản Google của bạn</p>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={async () => {
                                if (loading) return;
                                setError(null);
                                setLoading(true);
                                try {
                                    if (onGoogleSignIn) {
                                        await onGoogleSignIn();
                                    }
                                    // popup path handled by parent; parent should close modal on success
                                } catch (err: unknown) {
                                    console.error(err);
                                    const code = (err as { code?: string } | undefined)?.code || '';
                                    const msg = err instanceof Error ? err.message : String(err);
                                    // common popup cancellation codes
                                    if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user') {
                                        // fallback to redirect if available
                                        if (onGoogleSignInRedirect) {
                                            try {
                                                await onGoogleSignInRedirect();
                                                return; // redirect will leave page
                                            } catch (e) {
                                                console.error('Redirect fallback failed', e);
                                            }
                                        }
                                        setError('Popup was cancelled or blocked. Try redirect sign-in.');
                                    } else {
                                        setError(msg || 'Login failed');
                                    }
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:shadow-md rounded-lg transition disabled:opacity-60"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" className="block" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#EA4335" d="M12 11.5v3.9h5.4c-.2 1.4-1.6 4.1-5.4 4.1-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8c1.9 0 3.2.8 3.9 1.5l2.6-2.5C17.4 4.3 14.9 3 12 3 7.6 3 4 6.6 4 11s3.6 8 8 8c4.6 0 7.6-3.2 7.6-7.7 0-.5 0-.8-.1-1.1H12z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                        </button>

                        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

                        {/* Open Email OTP modal */}
                        <div className="mt-3">
                            <button
                                onClick={() => setOtpOpen(true)}
                                className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 mt-2 bg-white border border-gray-200 hover:shadow-md rounded-lg transition"
                            >
                                <span className="text-sm font-medium text-gray-900">Gửi OTP đến Gmail</span>
                            </button>
                        </div>

                        <EmailOtpModal open={otpOpen} onClose={() => setOtpOpen(false)} />

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs text-gray-400">or</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={() => alert('Email/password login not yet implemented')}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                disabled={loading}
                            >
                                Sign in with email
                            </button>
                        </div>

                        <p className="mt-4 text-xs text-gray-500">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

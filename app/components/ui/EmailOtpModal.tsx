"use client";
import React, { useState } from 'react';
import axios from 'axios';

type Props = { open: boolean; onClose: () => void };

export default function EmailOtpModal({ open, onClose }: Props) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'enter' | 'verify'>('enter');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const emailInputRef = React.useRef<HTMLInputElement | null>(null);

    if (!open) return null;

    function getErrorMessage(err: unknown) {
        // try to extract SendGrid/axios style error messages safely
        if (typeof err === 'string') return err;
        if (err && typeof err === 'object') {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            return e.response?.data?.message || e.message || 'Error';
        }
        return 'Error';
    }

    const send = async () => {
        setError(null);
        setLoading(true);
        // basic validation: require gmail addresses
        if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
            setError('Vui lòng nhập địa chỉ Gmail (@gmail.com)');
            setLoading(false);
            return;
        }
        try {
            await axios.post('/api/send-otp', { email });
            setStep('verify');
            // focus code input after sending
            setTimeout(() => {
                const el = document.querySelector<HTMLInputElement>('#otp-code-input');
                el?.focus();
            }, 50);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const verify = async () => {
        setError(null);
        setLoading(true);
        if (!email || !code) {
            setError('Vui lòng nhập đầy đủ email và mã OTP');
            setLoading(false);
            return;
        }
        try {
            const resp = await axios.post<{ token?: string; message?: string }>('/api/verify-otp', { email, code });
            const token = resp.data?.token;
            if (token) {
                // sign in with token using firebase/auth
                const { getAuth, signInWithCustomToken } = await import('firebase/auth');
                const a = getAuth();
                await signInWithCustomToken(a, token);
                onClose();
            } else {
                // handle dev fallback where server verifies but cannot mint a custom token
                const msg = resp.data?.message;
                if (typeof msg === 'string' && msg.includes('Verified in dev fallback')) {
                    // sign in anonymously for local development convenience
                    const { getAuth, signInAnonymously } = await import('firebase/auth');
                    const a = getAuth();
                    await signInAnonymously(a);
                    onClose();
                    return;
                }
                setError('No token returned');
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
            <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 px-8 py-10 animate-in fade-in zoom-in-95">
                <button onClick={onClose} aria-label="Đóng" className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full p-2 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="text-center mb-8">
                    <div className="mx-auto mb-3 w-12 h-12 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M4 4l8 8 8-8" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Đăng nhập bằng Email & OTP</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bảo mật, nhanh chóng, tiện lợi.</p>
                </div>
                {step === 'enter' ? (
                    <>
                        <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400">Nhập địa chỉ Gmail để nhận mã OTP.</p>
                        <input ref={emailInputRef} autoFocus type="email" className="mt-3 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
                        {error && <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p></div>}
                        <div className="mt-6 flex justify-between gap-3">
                            <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={onClose} disabled={loading}>Hủy</button>
                            <button className={`w-full px-4 py-3 bg-orange-600 text-white rounded-xl font-semibold transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-700 shadow-lg shadow-orange-500/40 hover:scale-[1.01]'}`} onClick={send} disabled={loading}>{loading ? (<svg className="h-5 w-5 mx-auto animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>) : 'Gửi OTP'}</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400">Nhập mã OTP đã gửi tới <span className="font-semibold text-gray-900 dark:text-white block truncate">{email}</span>.</p>
                        <input id="otp-code-input" type="text" className="mt-3 w-full text-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-2xl font-bold tracking-widest text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition" value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="------" maxLength={6} autoFocus />
                        {error && <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p></div>}
                        <div className="mt-6 flex justify-between gap-3">
                            <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2" onClick={() => { setStep('enter'); setCode(''); setError(null); }} disabled={loading}>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12h22M12 1l-7 7m7-7l7 7" /></svg>Quay lại
                            </button>
                            <button className={`w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700 shadow-lg shadow-green-500/40 hover:scale-[1.01]'}`} onClick={verify} disabled={loading}>{loading ? (<svg className="h-5 w-5 mx-auto animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>) : 'Xác nhận'}</button>
                        </div>
                        <button className="mt-4 w-full text-center text-xs text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300 transition" onClick={send} disabled={loading || step !== 'verify'}>
                            Gửi lại mã OTP
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

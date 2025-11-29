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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
                <h3 className="text-lg font-semibold">Đăng nhập bằng mã OTP</h3>
                {step === 'enter' ? (
                    <>
                        <p className="mt-2 text-sm">Nhập địa chỉ Gmail để nhận mã 6 chữ số.</p>
                        <input ref={emailInputRef} autoFocus className="mt-4 w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
                        {error && <p className="text-red-600 mt-2">{error}</p>}
                        <div className="mt-4 flex justify-end">
                            <button className="px-4 py-2" onClick={onClose}>Hủy</button>
                            <button className="ml-2 px-4 py-2 bg-blue-600 text-white" onClick={send} disabled={loading}>{loading ? '...' : 'Gửi OTP'}</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mt-2 text-sm">Nhập mã 6 chữ số đã gửi tới {email}.</p>
                        <input id="otp-code-input" className="mt-4 w-full border p-2" value={code} onChange={(e) => setCode(e.target.value)} />
                        {error && <p className="text-red-600 mt-2">{error}</p>}
                        <div className="mt-4 flex justify-end">
                            <button className="px-4 py-2" onClick={() => setStep('enter')}>Quay lại</button>
                            <button className="ml-2 px-4 py-2 bg-green-600 text-white" onClick={verify} disabled={loading}>{loading ? '...' : 'Xác nhận'}</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

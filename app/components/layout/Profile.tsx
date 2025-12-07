"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User2, LogOut, ChevronDown } from 'lucide-react';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import LoginModal from '../ui/LoginModal';
import ConfirmLogoutModal from '../ui/ConfirmLogoutModal';

interface ProfileTexts {
    login: string;
    logout: string;
    confirmLogoutTitle: string;
    confirmLogoutMessage: string;
    confirmLogoutCancel: string;
    confirmLogoutConfirm: string;
}

interface ProfileProps {
    texts: ProfileTexts;
    variant?: 'desktop' | 'mobile';
    onMenuClose?: () => void; // Callback để đóng mobile menu sau khi click
}

function Profile({ texts, variant = 'desktop', onMenuClose }: ProfileProps) {
    const { user, loading, signInWithGoogle, signOut } = useFirebaseAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Đóng modal khi user đăng nhập thành công
    useEffect(() => {
        if (user) {
            setShowLoginModal(false);
        }
    }, [user]);

    // Đóng modal khi nhấn Escape
    useEffect(() => {
        if (!showLoginModal) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowLoginModal(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [showLoginModal]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        if (!showDropdown) return;
        const handleClickOutside = () => setShowDropdown(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showDropdown]);

    const handleGoogleSignIn = async () => {
        if (!signInWithGoogle) return;
        try {
            await signInWithGoogle();
            setShowLoginModal(false);
            onMenuClose?.();
        } catch (err) {
            console.error('Google sign-in failed', err);
            throw err;
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setShowLogoutConfirm(false);
        }
    };

    const openLoginModal = () => {
        setShowLoginModal(true);
        onMenuClose?.();
    };

    function getInitials(name?: string | null, email?: string | null) {
        const source = name || email || '';
        const parts = source.split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'U';
        if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
        return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase();
    }

    // ==================== DESKTOP VERSION ====================
    if (variant === 'desktop') {
        return (
            <>
                {loading ? (
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
                        <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                    </div>
                ) : user ? (
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown(!showDropdown);
                            }}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition"
                        >
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName || 'User'}
                                    width={36}
                                    height={36}
                                    className="rounded-full object-cover ring-2 ring-blue-100"
                                />
                            ) : (
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
                                    {getInitials(user.displayName, user.email)}
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden xl:block">
                                {user.displayName || user.email?.split('@')[0]}
                            </span>
                            <ChevronDown
                                size={16}
                                className={`text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div
                                className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-down"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* User Info */}
                                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {user.displayName || 'Người dùng'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>

                                {/* Actions */}
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            setShowLogoutConfirm(true);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                                    >
                                        <LogOut size={18} />
                                        <span>{texts.logout}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={openLoginModal}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 rounded-full hover:opacity-90 transition shadow-lg shadow-orange-500/30 active:scale-95"
                    >
                        <User2 size={18} />
                        <span>{texts.login}</span>
                    </button>
                )}

                {/* Modals */}
                <LoginModal
                    open={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onGoogleSignIn={handleGoogleSignIn}
                />
                <ConfirmLogoutModal
                    open={showLogoutConfirm}
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={handleLogout}
                    title={texts.confirmLogoutTitle}
                    message={texts.confirmLogoutMessage}
                    cancelLabel={texts.confirmLogoutCancel}
                    confirmLabel={texts.confirmLogoutConfirm}
                />
            </>
        );
    }

    // ==================== MOBILE VERSION ====================
    return (
        <>
            {loading ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            ) : user ? (
                <div className="flex flex-col gap-3">
                    {/* User Card */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                        {user.photoURL ? (
                            <Image
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                width={48}
                                height={48}
                                className="rounded-full object-cover ring-2 ring-white shadow"
                            />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow">
                                {getInitials(user.displayName, user.email)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {user.displayName || 'Người dùng'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition active:scale-[0.98]"
                    >
                        <LogOut size={18} />
                        <span>{texts.logout}</span>
                    </button>
                </div>
            ) : (
                <button
                    onClick={openLoginModal}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl hover:opacity-90 transition shadow-lg shadow-orange-500/30 active:scale-[0.98]"
                >
                    <User2 size={18} />
                    <span>{texts.login}</span>
                </button>
            )}

            {/* Modals */}
            <LoginModal
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onGoogleSignIn={handleGoogleSignIn}
            />
            <ConfirmLogoutModal
                open={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title={texts.confirmLogoutTitle}
                message={texts.confirmLogoutMessage}
                cancelLabel={texts.confirmLogoutCancel}
                confirmLabel={texts.confirmLogoutConfirm}
            />
        </>
    );
}

export default Profile;
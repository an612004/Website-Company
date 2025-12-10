"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
    FaUser,
    FaShoppingCart,
    FaCreditCard,
    FaUserFriends,
    FaComments,
    FaHeart,
    FaShareAlt
} from 'react-icons/fa';

interface MenuItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    href: string;
}

const menuItems: MenuItem[] = [
    {
        id: 'account',
        icon: <FaUser className="w-5 h-5" />,
        label: 'Tài khoản',
        href: '/user/account'
    },
    {
        id: 'orders',
        icon: <FaShoppingCart className="w-5 h-5" />,
        label: 'Lịch sử đơn hàng',
        href: '/user/orders'
    },
    {
        id: 'transactions',
        icon: <FaCreditCard className="w-5 h-5" />,
        label: 'Lịch sử giao dịch',
        href: '/user/transactions'
    },
    // {
    //     id: 'security',
    //     icon: <FaUserFriends className="w-5 h-5" />,
    //     label: 'Mật khẩu và bảo mật',
    //     href: '/user/security'
    // },
    {
        id: 'comments',
        icon: <FaComments className="w-5 h-5" />,
        label: 'Bình luận của tôi',
        href: '/user/comments'
    },
    {
        id: 'favorites',
        icon: <FaHeart className="w-5 h-5" />,
        label: 'Sản phẩm yêu thích',
        href: '/user/favorites'
    },
    {
        id: 'referral',
        icon: <FaShareAlt className="w-5 h-5" />,
        label: 'Giới thiệu bạn bè',
        href: '/user/referral'
    }
];

interface SidebarUserProps {
    activeItem?: string;
}

export default function SidebarUser({ activeItem = 'account' }: SidebarUserProps) {
    const [active, setActive] = useState(activeItem);

    return (
        <>
            {/* Mobile: Horizontal icon bar */}
            <div className="lg:hidden bg-white rounded-lg shadow-md overflow-hidden">
                <nav className="flex justify-around items-center py-3 border-b-2 border-gray-100">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setActive(item.id)}
                            className={`flex flex-col items-center p-2 transition-colors duration-200 relative ${active === item.id ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            title={item.label}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {active === item.id && (
                                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-blue-500"></span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Desktop: Vertical sidebar */}
            <div className="hidden lg:block w-64 bg-white rounded-lg shadow-md overflow-hidden">
                <nav className="py-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setActive(item.id)}
                            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${active === item.id
                                ? 'border-l-4 border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-l-4 border-transparent'
                                }`}
                        >
                            <span className={`mr-3 ${active === item.id ? 'text-blue-500' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}
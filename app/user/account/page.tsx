'use client';
import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { User } from 'lucide-react';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import SidebarUser from "../../components/ui/Slidebar user";
import Image from 'next/image';

function AccountPage() {
    const { user, loading } = useFirebaseAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto p-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-48 bg-gray-200 rounded"></div>
                        <div className="bg-white rounded-xl p-6 space-y-4">
                            <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Chưa đăng nhập</h2>
                        <p className="text-gray-500">Vui lòng đăng nhập để xem thông tin tài khoản</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <SidebarUser activeItem="account" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Tổng quan Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng quan</h2>

                            {/* User Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tên đăng nhập</p>
                                    <p className="font-medium text-gray-900">{user.displayName || user.email?.split('@')[0] || 'Chưa cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="font-medium text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                                    <p className="font-medium text-gray-900">{user.displayName || 'Chưa cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nhóm khách hàng</p>
                                    <p className="font-medium text-gray-900">Member</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Số dư</p>
                                    <p className="font-medium text-gray-900">0đ</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Đã tích lũy</p>
                                    <p className="font-medium text-gray-900">0đ</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Ngày tham gia</p>
                                    <p className="font-medium text-gray-900">
                                        {user.metadata?.creationTime
                                            ? new Date(user.metadata.creationTime).toLocaleString('vi-VN')
                                            : 'Không xác định'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Avatar Section */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 border-t border-gray-200">
                                <div className="relative">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            width={100}
                                            height={100}
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User size={40} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">
                                        Sửa ảnh đại diện
                                    </button>
                                    <p className="text-sm text-gray-500">Vui lòng chọn ảnh nhỏ hơn 5MB</p>
                                    <p className="text-sm text-gray-500">Chọn hình ảnh phù hợp, không phản cảm</p>
                                </div>
                            </div>
                        </div>

                        {/* Cá nhân Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Cá nhân</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Họ và tên</label>
                                    <input
                                        type="text"
                                        defaultValue={user.displayName || ''}
                                        placeholder="Nhập họ và tên"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        defaultValue={user.phoneNumber || ''}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Ngày sinh</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Giới tính</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-500 mb-2">Địa chỉ</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập địa chỉ"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default AccountPage;

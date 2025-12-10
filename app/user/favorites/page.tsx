"use client";
import React from 'react';
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SidebarUser from "../../components/ui/Slidebar user";

function FavoritesPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <SidebarUser activeItem="favorites" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sản phẩm yêu thích</h1>
                            <p className="text-gray-500 mb-6">Danh sách các sản phẩm bạn đã yêu thích</p>

                            <div className="text-center py-12 text-gray-500">
                                <p>Chưa có sản phẩm yêu thích nào</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FavoritesPage;
"use client";
import React, { useState } from 'react';
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SidebarUser from "../../components/ui/Slidebar user";
import { FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Mock data for orders
const mockOrders: { id: string; date: string; product: string; total: number; status: string }[] = [];

const statusConfig: { [key: string]: { label: string; color: string } } = {
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' },
    shipping: { label: 'Đang giao', color: 'bg-blue-100 text-blue-700' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
};

function OrdersPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        orderId: '',
        minPrice: '',
        maxPrice: '',
        fromDate: '',
        toDate: '',
    });

    const itemsPerPage = 10;

    // Filter orders
    const filteredOrders = mockOrders.filter(order => {
        if (filters.orderId && !order.id.toLowerCase().includes(filters.orderId.toLowerCase())) return false;
        if (filters.minPrice && order.total < Number(filters.minPrice)) return false;
        if (filters.maxPrice && order.total > Number(filters.maxPrice)) return false;
        if (filters.fromDate && new Date(order.date) < new Date(filters.fromDate)) return false;
        if (filters.toDate && new Date(order.date) > new Date(filters.toDate + ' 23:59:59')) return false;
        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    const handleFilter = () => {
        setCurrentPage(1);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <SidebarUser activeItem="orders" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
                            <p className="text-gray-500 mb-6">Hiển thị thông tin các sản phẩm bạn đã mua tại Divine Shop</p>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <input
                                    type="text"
                                    name="orderId"
                                    placeholder="Mã đơn hàng"
                                    value={filters.orderId}
                                    onChange={handleFilterChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                                />
                                <input
                                    type="number"
                                    name="minPrice"
                                    placeholder="Số tiền từ"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                                />
                                <input
                                    type="number"
                                    name="maxPrice"
                                    placeholder="Số tiền đến"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                                />
                                <div className="flex items-end gap-2">
                                    <div className="flex flex-col">
                                        <label className="text-xs text-gray-500 mb-1">Từ ngày</label>
                                        <input
                                            type="date"
                                            name="fromDate"
                                            value={filters.fromDate}
                                            onChange={handleFilterChange}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs text-gray-500 mb-1">Đến ngày</label>
                                        <input
                                            type="date"
                                            name="toDate"
                                            value={filters.toDate}
                                            onChange={handleFilterChange}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleFilter}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 self-end"
                                >
                                    <FaFilter />
                                    Lọc
                                </button>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Thời gian</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã đơn hàng</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Sản phẩm</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Tổng tiền</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedOrders.length > 0 ? (
                                            paginatedOrders.map((order) => (
                                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                    <td className="py-4 px-4 text-gray-600">{order.date}</td>
                                                    <td className="py-4 px-4 text-blue-600 font-medium">{order.id}</td>
                                                    <td className="py-4 px-4 text-gray-800">{order.product}</td>
                                                    <td className="py-4 px-4 text-right text-gray-800 font-medium">{formatCurrency(order.total)}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                                                            {statusConfig[order.status].label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                                    Không có đơn hàng nào
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredOrders.length)} trong tổng số {filteredOrders.length} đơn hàng
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <FaChevronLeft className="w-4 h-4" />
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === page
                                                    ? 'bg-blue-500 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <FaChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default OrdersPage;
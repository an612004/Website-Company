"use client";
import { useEffect, useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, User, Mail, Clock } from 'lucide-react';

// Định nghĩa kiểu dữ liệu User (giữ nguyên)
type User = {
    id: number;
    name: string;
    email: string;
    lastLogin: string; // Giả sử là chuỗi ngày/giờ
};

// Số lượng người dùng trên mỗi trang
const ITEMS_PER_PAGE = 10;

export default function UserPage() {
    // 1. STATE QUẢN LÝ DỮ LIỆU
    const [allUsers, setAllUsers] = useState<User[]>([]); // Toàn bộ dữ liệu user
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // State cho ô tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại

    // 2. FETCH DỮ LIỆU
    useEffect(() => {
        // Giả lập hàm fetch (bạn có thể thay bằng fetch thực tế từ '/api/users')
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users");
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setAllUsers(data.users || []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setAllUsers([]); // Đặt về mảng rỗng nếu có lỗi
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 3. LOGIC TÌM KIẾM & PHÂN TRANG (sử dụng useMemo để tối ưu hiệu suất)
    const filteredUsers = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();

        return allUsers.filter(user =>
            user.name.toLowerCase().includes(lowerCaseSearch) ||
            user.email.toLowerCase().includes(lowerCaseSearch)
        );
    }, [allUsers, searchTerm]);

    // Tính toán tổng số trang
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    // Dữ liệu người dùng cho trang hiện tại
    const currentUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage]);

    // Đặt lại về trang 1 khi thay đổi tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // 4. HÀM XỬ LÝ PHÂN TRANG
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const Pagination = () => {
        const renderPageNumbers = () => {
            const pages = [];
            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => goToPage(i)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                            ${i === currentPage
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }
                        `}
                    >
                        {i}
                    </button>
                );
            }
            return pages;
        };

        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between mt-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                <p className="text-sm text-gray-600">
                    Hiển thị <span className="font-semibold">{currentUsers.length}</span> trên <span className="font-semibold">{filteredUsers.length}</span> người dùng
                </p>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        aria-label="Trang trước"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex space-x-1">
                        {renderPageNumbers()}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        aria-label="Trang sau"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };


    // 5. RENDERING
    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* TIÊU ĐỀ & TÌM KIẾM */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-6 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0 flex items-center gap-3">
                        <User size={30} className="text-blue-600" />
                        Quản lý Người dùng ({allUsers.length})
                    </h2>

                    {/* Ô TÌM KIẾM */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Tên hoặc Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                        />
                    </div>
                </div>

                {/* HIỂN THỊ KHI ĐANG TẢI */}
                {loading && (
                    <div className="text-center py-20 text-lg text-gray-500">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                        Đang tải dữ liệu người dùng...
                    </div>
                )}

                {/* HIỂN THỊ KHI KHÔNG CÓ DỮ LIỆU */}
                {!loading && allUsers.length === 0 && (
                    <div className="text-center py-20 text-lg text-gray-500 border border-gray-200 bg-white rounded-xl shadow-lg">
                        Không có người dùng nào được tìm thấy.
                    </div>
                )}

                {/* HIỂN THỊ KHI KHÔNG TÌM THẤY KẾT QUẢ */}
                {!loading && allUsers.length > 0 && filteredUsers.length === 0 && (
                    <div className="text-center py-20 text-lg text-gray-500 border border-gray-200 bg-white rounded-xl shadow-lg">
                        Không tìm thấy người dùng khớp với từ khóa <b>&quot;{searchTerm}&quot;</b>.
                    </div>
                )}

                {/* BẢNG DỮ LIỆU */}
                {!loading && currentUsers.length > 0 && (
                    <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            {/* HEADER BẢNG */}
                            <thead className="bg-blue-50/70">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16 rounded-tl-2xl">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-1"><User size={14} /> Tên</div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-1"><Mail size={14} /> Email</div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider rounded-tr-2xl">
                                        <div className="flex items-center gap-1"><Clock size={14} /> Lần đăng nhập cuối</div>
                                    </th>
                                </tr>
                            </thead>

                            {/* BODY BẢNG */}
                            <tbody className="bg-white divide-y divide-gray-100">
                                {currentUsers.map((user, idx) => (
                                    <tr key={user.id} className="hover:bg-blue-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.lastLogin}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* PHÂN TRANG */}
                {!loading && filteredUsers.length > ITEMS_PER_PAGE && <Pagination />}

            </div>
        </div>
    );
}
"use client";
import React, { useState, useEffect } from "react";
import { Phone, Mail, MessageSquare, Search, Trash2, Eye, Filter, RefreshCw, CheckCircle, Clock, XCircle, Loader2, Archive, ChevronLeft, ChevronRight } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho liên hệ
type ContactMessage = {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    status: "new" | "read" | "replied" | "archived";
    createdAt: string;
};

type StatusCounts = {
    all: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
};

function AdminContactPage() {
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [statusCounts, setStatusCounts] = useState<StatusCounts>({
        all: 0,
        new: 0,
        read: 0,
        replied: 0,
        archived: 0,
    });

    // Fetch danh sách liên hệ từ API
    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/contacts?status=${filterStatus}`);
            const data = await response.json();

            if (data.success) {
                setContacts(data.data.contacts);
                setStatusCounts(data.data.counts);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Gọi API khi component mount hoặc filterStatus thay đổi
    useEffect(() => {
        fetchContacts();
    }, [filterStatus]);

    // Lọc danh sách theo tìm kiếm (client-side)
    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone.includes(searchTerm) ||
            contact.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    // Reset về trang 1 khi tìm kiếm hoặc lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    // Xem chi tiết liên hệ
    const handleViewContact = async (contact: ContactMessage) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
        // Đánh dấu đã đọc nếu là tin mới
        if (contact.status === "new") {
            await handleUpdateStatus(contact.id, "read");
        }
    };

    // Xóa liên hệ
    const handleDeleteContact = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa liên hệ này?")) {
            try {
                const response = await fetch(`/api/contacts/${id}`, {
                    method: "DELETE",
                });
                const data = await response.json();

                if (data.success) {
                    setContacts((prev) => prev.filter((c) => c.id !== id));
                    // Cập nhật counts
                    fetchContacts();
                } else {
                    alert(data.error || "Có lỗi xảy ra");
                }
            } catch (error) {
                console.error("Error deleting contact:", error);
                alert("Lỗi kết nối");
            }
        }
    };

    // Cập nhật trạng thái
    const handleUpdateStatus = async (id: string, status: ContactMessage["status"]) => {
        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });
            const data = await response.json();

            if (data.success) {
                setContacts((prev) =>
                    prev.map((c) => (c.id === id ? { ...c, status } : c))
                );
                // Cập nhật selectedContact nếu đang mở modal
                if (selectedContact && selectedContact.id === id) {
                    setSelectedContact({ ...selectedContact, status });
                }
                // Refresh để cập nhật counts
                fetchContacts();
            }
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    };

    // Format ngày giờ
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Lấy màu trạng thái
    const getStatusColor = (status: ContactMessage["status"]) => {
        switch (status) {
            case "new":
                return "bg-green-100 text-green-700 border-green-200";
            case "read":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "replied":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "archived":
                return "bg-gray-100 text-gray-600 border-gray-200";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // Lấy tên trạng thái
    const getStatusLabel = (status: ContactMessage["status"]) => {
        switch (status) {
            case "new":
                return "Mới";
            case "read":
                return "Đã đọc";
            case "replied":
                return "Đã trả lời";
            case "archived":
                return "Lưu trữ";
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    📬 Quản lý liên hệ
                </h1>
                <p className="text-gray-500">Xem và quản lý các tin nhắn từ khách hàng</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div
                    onClick={() => setFilterStatus("all")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${filterStatus === "all"
                        ? "bg-orange-50 border-orange-400 shadow-lg"
                        : "bg-white border-gray-100 hover:border-orange-200"
                        }`}
                >
                    <p className="text-2xl font-bold text-gray-800">{statusCounts.all}</p>
                    <p className="text-sm text-gray-500">Tất cả</p>
                </div>
                <div
                    onClick={() => setFilterStatus("new")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${filterStatus === "new"
                        ? "bg-green-50 border-green-400 shadow-lg"
                        : "bg-white border-gray-100 hover:border-green-200"
                        }`}
                >
                    <p className="text-2xl font-bold text-green-600">{statusCounts.new}</p>
                    <p className="text-sm text-gray-500">Mới</p>
                </div>
                <div
                    onClick={() => setFilterStatus("read")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${filterStatus === "read"
                        ? "bg-blue-50 border-blue-400 shadow-lg"
                        : "bg-white border-gray-100 hover:border-blue-200"
                        }`}
                >
                    <p className="text-2xl font-bold text-blue-600">{statusCounts.read}</p>
                    <p className="text-sm text-gray-500">Đã đọc</p>
                </div>
                <div
                    onClick={() => setFilterStatus("replied")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${filterStatus === "replied"
                        ? "bg-purple-50 border-purple-400 shadow-lg"
                        : "bg-white border-gray-100 hover:border-purple-200"
                        }`}
                >
                    <p className="text-2xl font-bold text-purple-600">{statusCounts.replied}</p>
                    <p className="text-sm text-gray-500">Đã trả lời</p>
                </div>
                <div
                    onClick={() => setFilterStatus("archived")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${filterStatus === "archived"
                        ? "bg-gray-200 border-gray-400 shadow-lg"
                        : "bg-white border-gray-100 hover:border-gray-300"
                        }`}
                >
                    <p className="text-2xl font-bold text-gray-600">{statusCounts.archived}</p>
                    <p className="text-sm text-gray-500">Lưu trữ</p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, địa chỉ email, số điện thoại, dịch vụ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("all");
                        fetchContacts();
                    }}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Làm mới
                </button>
            </div>

            {/* Contact List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden overflow-x-auto">
                {/* Table Header - Hidden on mobile */}
                <div className="hidden md:grid md:grid-cols-16 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-600 text-sm min-w-[1000px]">
                    <div className="col-span-2">Tên khách hàng</div>
                    <div className="col-span-3">Địa chỉ Gmail</div>
                    <div className="col-span-2">Số điện thoại</div>
                    <div className="col-span-2">Dịch vụ</div>
                    <div className="col-span-3">Nội dung</div>
                    <div className="col-span-2">Trạng thái</div>
                    <div className="col-span-2 text-center">Thao tác</div>
                </div>

                {/* Contact Items */}
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500">
                        <Loader2 className="w-12 h-12 mx-auto mb-4 text-orange-400 animate-spin" />
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Không có liên hệ nào</p>
                    </div>
                ) : (
                    paginatedContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`grid grid-cols-1 md:grid-cols-16 gap-2 md:gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors min-w-[1000px] ${contact.status === "new" ? "bg-green-50/50" : ""
                                }`}
                        >
                            {/* Tên khách hàng */}
                            <div className="col-span-1 md:col-span-2 flex items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <p className="font-semibold text-gray-800">{contact.name}</p>
                                </div>
                            </div>

                            {/* Địa chỉ Gmail */}
                            <div className="col-span-1 md:col-span-3 flex items-center">
                                <span className="md:hidden text-gray-500 mr-2">📧</span>
                                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline text-sm truncate">
                                    {contact.email}
                                </a>
                            </div>

                            {/* Số điện thoại */}
                            <div className="col-span-1 md:col-span-2 flex items-center">
                                <span className="md:hidden text-gray-500 mr-2">📞</span>
                                <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                                    {contact.phone}
                                </a>
                            </div>

                            {/* Dịch vụ */}
                            <div className="col-span-1 md:col-span-2 flex items-center">
                                <span className="md:hidden text-gray-500 mr-2">🏷️</span>
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium truncate">
                                    {contact.service}
                                </span>
                            </div>

                            {/* Nội dung */}
                            <div className="col-span-1 md:col-span-3 flex items-center">
                                <span className="md:hidden text-gray-500 mr-2">💬</span>
                                <p className="text-gray-600 text-sm line-clamp-2">{contact.message}</p>
                            </div>

                            {/* Trạng thái */}
                            <div className="col-span-1 md:col-span-2 flex items-center">
                                <span className="md:hidden text-gray-500 mr-2">📋</span>
                                {contact.status === "replied" ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        <CheckCircle className="w-4 h-4" />
                                        Đã trả lời
                                    </span>
                                ) : contact.status === "read" ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                        <Eye className="w-4 h-4" />
                                        Đã đọc
                                    </span>
                                ) : contact.status === "archived" ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                        Lưu trữ
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold animate-pulse">
                                        🆕 Mới
                                    </span>
                                )}
                            </div>

                            {/* Thao tác */}
                            <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center gap-1 mt-2 md:mt-0 flex-wrap">
                                <button
                                    onClick={() => handleViewContact(contact)}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                    title="Xem chi tiết"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                {contact.status !== "replied" && (
                                    <button
                                        onClick={() => handleUpdateStatus(contact.id, "replied")}
                                        className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                                        title="Đánh dấu đã trả lời"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                )}
                                {contact.status !== "archived" && (
                                    <button
                                        onClick={() => handleUpdateStatus(contact.id, "archived")}
                                        className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-colors"
                                        title="Lưu trữ"
                                    >
                                        <Archive className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteContact(contact.id)}
                                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Phân trang */}
            {filteredContacts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white rounded-xl shadow-md p-4">
                    <div className="text-sm text-gray-500">
                        Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredContacts.length)} trong tổng số {filteredContacts.length} liên hệ
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Các nút số trang */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${currentPage === page
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết liên hệ */}
            {isModalOpen && selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">Chi tiết liên hệ</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <XCircle className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white text-xl font-bold">
                                    {selectedContact.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-800">{selectedContact.name}</p>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                            selectedContact.status
                                        )}`}
                                    >
                                        {getStatusLabel(selectedContact.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Mail className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Địa chỉ email</p>
                                        <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                                            {selectedContact.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Số điện thoại</p>
                                        <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline font-semibold">
                                            {selectedContact.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Filter className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Bạn cần dịch vụ gì?</p>
                                        <p className="font-semibold text-orange-600">{selectedContact.service}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Thời gian gửi</p>
                                        <p className="font-medium">{formatDate(selectedContact.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4" /> Nội dung lời nhắn
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">{selectedContact.message}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex flex-wrap gap-3">
                            <button
                                onClick={() => {
                                    handleUpdateStatus(selectedContact.id, "replied");
                                    setIsModalOpen(false);
                                }}
                                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Đã trả lời
                            </button>
                            <button
                                onClick={() => {
                                    handleUpdateStatus(selectedContact.id, "archived");
                                    setIsModalOpen(false);
                                }}
                                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                            >
                                Lưu trữ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminContactPage;
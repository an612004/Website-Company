"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    Phone,
    Mail,
    Search,
    Trash2,
    Eye,
    RefreshCw,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    Package,
    Building2,
    MessageSquare,
    X,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Users,
    FileText,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu cho liên hệ
type ContactWeb = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    servicePackage: string;
    industry: string;
    message: string;
    status: "new" | "processing" | "completed" | "cancelled";
    createdAt: string;
    updatedAt?: string;
};

// Map trạng thái
const statusMap = {
    new: { label: "Mới", color: "bg-blue-100 text-blue-700", icon: Clock },
    processing: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-700", icon: Loader2 },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: XCircle },
};

// Map gói dịch vụ
const servicePackageMap: { [key: string]: string } = {
    "goi-co-ban": "Gói Cơ Bản - 3 Triệu",
    "goi-nang-cao": "Gói Nâng Cao - 7-10 Triệu",
    "goi-cao-cap": "Gói Cao Cấp - 15-20 Triệu",
    "goi-tuy-chinh": "Gói Tùy Chỉnh",
};

// Map lĩnh vực
const industryMap: { [key: string]: string } = {
    "thuong-mai-dien-tu": "Thương mại điện tử",
    "bat-dong-san": "Bất động sản",
    "giao-duc": "Giáo dục / Đào tạo",
    "y-te": "Y tế / Sức khỏe",
    "nha-hang-khach-san": "Nhà hàng / Khách sạn",
    "cong-nghe": "Công nghệ / Phần mềm",
    "thoi-trang": "Thời trang / Làm đẹp",
    "san-xuat": "Sản xuất / Công nghiệp",
    "khac": "Lĩnh vực khác",
};

// Map nội dung quan tâm
const subjectMap: { [key: string]: string } = {
    "thiet-ke-website": "Thiết kế Website",
    "thiet-ke-crm-erp": "Thiết kế CRM - ERP",
    "san-pham-so": "Sản Phẩm Số",
    "phan-cung-thiet-bi": "Phần cứng Thiết Bị",
};

function ContactWebPage() {
    const [contacts, setContacts] = useState<ContactWeb[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedContact, setSelectedContact] = useState<ContactWeb | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [statusCounts, setStatusCounts] = useState({
        all: 0,
        new: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
    });
    const itemsPerPage = 10;

    // Fetch contacts từ API
    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/contact-web');
            const data = await response.json();

            if (data.success) {
                setContacts(data.data);
                if (data.counts) {
                    setStatusCounts(data.counts);
                }
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    // Auto refresh mỗi 30 giây
    useEffect(() => {
        const interval = setInterval(() => {
            fetchContacts();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchContacts]);

    // Lọc và tìm kiếm
    const filteredContacts = contacts.filter(contact => {
        const matchSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone.includes(searchTerm);
        const matchStatus = filterStatus === "all" || contact.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const paginatedContacts = filteredContacts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Cập nhật trạng thái
    const updateStatus = async (id: string, newStatus: ContactWeb["status"]) => {
        setActionLoading(id);
        try {
            const response = await fetch(`/api/contact-web/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();

            if (data.success) {
                setContacts(prev =>
                    prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
                );
                if (selectedContact?._id === id) {
                    setSelectedContact(prev => prev ? { ...prev, status: newStatus } : null);
                }
                // Cập nhật lại counts
                fetchContacts();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
            setActionLoading(null);
        }
    };

    // Xóa liên hệ
    const deleteContact = async (id: string) => {
        setActionLoading(id);
        try {
            const response = await fetch(`/api/contact-web/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                setContacts(prev => prev.filter(c => c._id !== id));
                setShowDeleteConfirm(false);
                setContactToDelete(null);
                if (selectedContact?._id === id) {
                    setShowModal(false);
                    setSelectedContact(null);
                }
                // Cập nhật lại counts
                fetchContacts();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            alert('Có lỗi xảy ra khi xóa liên hệ');
        } finally {
            setActionLoading(null);
        }
    };

    // Format date
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

    // Đếm theo trạng thái (sử dụng từ API)
    const countByStatus = (status: string) => {
        return statusCounts[status as keyof typeof statusCounts] || 0;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Quản lý liên hệ thiết kế Web
                        </h1>
                        <p className="text-gray-500">Xem và quản lý các yêu cầu từ khách hàng</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div
                    onClick={() => setFilterStatus("all")}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 ${filterStatus === "all"
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/30 scale-[1.02]"
                        : "bg-white hover:shadow-lg hover:scale-[1.01] border border-gray-100"
                        }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${filterStatus === "all" ? "bg-white/20" : "bg-purple-50"}`}>
                            <Users className={`w-5 h-5 ${filterStatus === "all" ? "text-white" : "text-purple-500"}`} />
                        </div>
                        {filterStatus === "all" && (
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                    </div>
                    <p className={`text-sm font-medium ${filterStatus === "all" ? "text-purple-100" : "text-gray-500"}`}>Tất cả</p>
                    <p className="text-3xl font-bold mt-1">{countByStatus("all")}</p>
                </div>
                {Object.entries(statusMap).map(([key, value]) => {
                    const Icon = value.icon;
                    const bgColors = {
                        new: "from-blue-500 to-cyan-500",
                        processing: "from-yellow-500 to-orange-500",
                        completed: "from-green-500 to-emerald-500",
                        cancelled: "from-red-500 to-rose-500"
                    };
                    const iconBg = {
                        new: "bg-blue-50 text-blue-500",
                        processing: "bg-yellow-50 text-yellow-500",
                        completed: "bg-green-50 text-green-500",
                        cancelled: "bg-red-50 text-red-500"
                    };
                    return (
                        <div
                            key={key}
                            onClick={() => setFilterStatus(key)}
                            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 ${filterStatus === key
                                ? `bg-gradient-to-br ${bgColors[key as keyof typeof bgColors]} text-white shadow-xl scale-[1.02]`
                                : "bg-white hover:shadow-lg hover:scale-[1.01] border border-gray-100"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${filterStatus === key ? "bg-white/20" : iconBg[key as keyof typeof iconBg]}`}>
                                    <Icon className={`w-5 h-5 ${filterStatus === key ? "text-white" : ""}`} />
                                </div>
                                {filterStatus === key && (
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                )}
                                {key === "new" && countByStatus("new") > 0 && filterStatus !== key && (
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm font-medium ${filterStatus === key ? "text-white/80" : "text-gray-500"}`}>
                                {value.label}
                            </p>
                            <p className="text-3xl font-bold mt-1">{countByStatus(key)}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-5 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email, số điện thoại..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                        />
                    </div>
                    {/* Refresh */}
                    <button
                        onClick={fetchContacts}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                        <span className="font-medium">Làm mới</span>
                    </button>
                </div>
            </div>

            {/* Contact List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm text-center py-20">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Không có liên hệ nào</p>
                        <p className="text-gray-400 text-sm mt-1">Các yêu cầu liên hệ mới sẽ hiển thị ở đây</p>
                    </div>
                ) : (
                    <>
                        {/* Card Layout */}
                        <div className="grid gap-4">
                            {paginatedContacts.map((contact) => {
                                const StatusIcon = statusMap[contact.status].icon;
                                return (
                                    <div
                                        key={contact._id}
                                        className={`bg-white rounded-2xl shadow-sm border-l-4 overflow-hidden transition-all hover:shadow-md ${contact.status === "new"
                                                ? "border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-white"
                                                : contact.status === "processing"
                                                    ? "border-l-yellow-500"
                                                    : contact.status === "completed"
                                                        ? "border-l-green-500"
                                                        : "border-l-red-500"
                                            }`}
                                    >
                                        <div className="p-5">
                                            {/* Header Row */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-500/30">
                                                        {contact.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-lg">{contact.name}</h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusMap[contact.status].color}`}>
                                                                <StatusIcon className="w-3.5 h-3.5" />
                                                                {statusMap[contact.status].label}
                                                            </span>
                                                            {contact.status === "new" && (
                                                                <span className="relative flex h-2.5 w-2.5">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400">Ngày gửi</p>
                                                    <p className="text-sm font-medium text-gray-600">{formatDate(contact.createdAt)}</p>
                                                </div>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        Điện thoại
                                                    </div>
                                                    <p className="font-semibold text-gray-700">{contact.phone}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        Email
                                                    </div>
                                                    <p className="font-semibold text-gray-700 truncate" title={contact.email}>{contact.email}</p>
                                                </div>
                                                <div className="bg-blue-50 rounded-xl p-3">
                                                    <div className="flex items-center gap-2 text-blue-400 text-xs mb-1">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        Quan tâm
                                                    </div>
                                                    <p className="font-semibold text-blue-700">{subjectMap[contact.subject] || contact.subject}</p>
                                                </div>
                                                <div className="bg-purple-50 rounded-xl p-3">
                                                    <div className="flex items-center gap-2 text-purple-400 text-xs mb-1">
                                                        <Package className="w-3.5 h-3.5" />
                                                        Gói dịch vụ
                                                    </div>
                                                    <p className="font-semibold text-purple-700 text-sm">{servicePackageMap[contact.servicePackage] || contact.servicePackage}</p>
                                                </div>
                                            </div>

                                            {/* Industry & Message Preview */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                                                    <Building2 className="w-3.5 h-3.5" />
                                                    {industryMap[contact.industry] || contact.industry}
                                                </span>
                                                {contact.message && (
                                                    <p className="text-gray-500 text-sm truncate flex-1" title={contact.message}>
                                                        💬 {contact.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                                <button
                                                    onClick={() => {
                                                        setSelectedContact(contact);
                                                        setShowModal(true);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors text-sm font-medium"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Xem chi tiết
                                                </button>
                                                {contact.status === "new" && (
                                                    <button
                                                        onClick={() => updateStatus(contact._id, "processing")}
                                                        disabled={actionLoading === contact._id}
                                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {actionLoading === contact._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Clock className="w-4 h-4" />
                                                        )}
                                                        Đang xử lý
                                                    </button>
                                                )}
                                                {(contact.status === "new" || contact.status === "processing") && (
                                                    <button
                                                        onClick={() => updateStatus(contact._id, "completed")}
                                                        disabled={actionLoading === contact._id}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {actionLoading === contact._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}
                                                        Hoàn thành
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setContactToDelete(contact._id);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors text-sm font-medium ml-auto"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                                    {Math.min(currentPage * itemsPerPage, filteredContacts.length)} / {filteredContacts.length} liên hệ
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                ? "bg-purple-500 text-white"
                                                : "hover:bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {showModal && selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <div>
                                <h2 className="text-xl font-bold">Chi tiết liên hệ</h2>
                                <p className="text-purple-100 text-sm">ID: {selectedContact._id}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {/* Customer Info */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedContact.name}</h3>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${statusMap[selectedContact.status].color}`}
                                    >
                                        {statusMap[selectedContact.status].label}
                                    </span>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Số điện thoại</p>
                                        <p className="font-medium text-gray-800">{selectedContact.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium text-gray-800">{selectedContact.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Gói dịch vụ</p>
                                        <p className="font-medium text-gray-800">
                                            {servicePackageMap[selectedContact.servicePackage] || selectedContact.servicePackage}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Lĩnh vực</p>
                                        <p className="font-medium text-gray-800">
                                            {industryMap[selectedContact.industry] || selectedContact.industry}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Nội dung quan tâm</p>
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <p className="font-medium text-purple-700">
                                        {subjectMap[selectedContact.subject] || selectedContact.subject}
                                    </p>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Nội dung tin nhắn</p>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message || "Không có nội dung"}</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="text-sm text-gray-500">
                                <p>Ngày gửi: {formatDate(selectedContact.createdAt)}</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex gap-2">
                                {selectedContact.status !== "completed" && (
                                    <button
                                        onClick={() => updateStatus(selectedContact._id, "completed")}
                                        disabled={actionLoading === selectedContact._id}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {actionLoading === selectedContact._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4" />
                                        )}
                                        Hoàn thành
                                    </button>
                                )}
                                {selectedContact.status === "new" && (
                                    <button
                                        onClick={() => updateStatus(selectedContact._id, "processing")}
                                        disabled={actionLoading === selectedContact._id}
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Clock className="w-4 h-4" />
                                        Đang xử lý
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[fadeIn_0.2s_ease-out]">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa</h3>
                            <p className="text-gray-500 mb-6">
                                Bạn có chắc chắn muốn xóa liên hệ này? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setContactToDelete(null);
                                    }}
                                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => contactToDelete && deleteContact(contactToDelete)}
                                    disabled={actionLoading === contactToDelete}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {actionLoading === contactToDelete ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

export default ContactWebPage;
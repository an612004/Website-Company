"use client";

// --- IMPORTS VÀ TYPES ---
import React, { useState, useEffect, useRef } from "react";
// Import icons cho các thao tác (Thêm, Sửa, Xóa)
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

// Định nghĩa Interface cho dữ liệu Nhân viên (Staff)
interface Staff {
    id: number; // ID là bắt buộc và duy nhất
    name: string;
    image: string;
    position: string;
    description: string;
}
type FormStaff = Omit<Staff, 'id'> & { id?: number };

// Dữ liệu mẫu ban đầu (đã giữ trống như yêu cầu gốc)
const initialStaff: Staff[] = [
];
const StaffModal: React.FC<{
    staff: FormStaff | null;
    onSave: (s: FormStaff) => void;
    onClose: () => void;
}> = ({ staff, onSave, onClose }) => {
    // Khởi tạo state cho Form với dữ liệu đang sửa hoặc dữ liệu mặc định trống
    const [formData, setFormData] = useState<FormStaff>(staff || {
        name: "",
        image: "https://via.placeholder.com/50x50?text=Avatar",
        position: "",
        description: "",
    });

    // Cập nhật state khi input thay đổi
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý khi chọn file ảnh từ thiết bị
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, image: url }));
    };

    // Giữ và giải phóng object URL khi cần để tránh rò rỉ bộ nhớ
    const prevBlobRef = useRef<string | null>(null);
    useEffect(() => {
        const current = formData.image;
        // Nếu previous là blob và khác current thì revoke
        if (prevBlobRef.current && prevBlobRef.current !== current) {
            try {
                if (prevBlobRef.current.startsWith("blob:")) URL.revokeObjectURL(prevBlobRef.current);
            } catch (err) {
                // ignore
            }
        }
        prevBlobRef.current = current && current.startsWith("blob:") ? current : null;

        return () => {
            if (prevBlobRef.current) {
                try {
                    URL.revokeObjectURL(prevBlobRef.current);
                } catch (err) {
                    // ignore
                }
            }
        };
    }, [formData.image]);

    // Xử lý khi Submit Form
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Kiểm tra tối thiểu tên và chức vụ
        if (!formData.name || !formData.position) {
            alert("Vui lòng điền Tên và Chức vụ.");
            return;
        }
        onSave(formData);
    };

    const title = staff && staff.id ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới";

    return (
        // Overlay và Modal container
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg animate-fade-in">
                <h3 className="text-xl font-bold mb-4 text-indigo-700 border-b pb-2">{title}</h3>
                <form onSubmit={handleSubmit}>
                    {/* Input Tên */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    {/* Input URL Ảnh */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh hoặc Chọn từ thiết bị:</label>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={formData.image}
                                    alt={formData.name || 'preview'}
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-200"
                                    onError={(e) => {
                                        const img = e.currentTarget as HTMLImageElement;
                                        img.onerror = null;
                                        img.src = "https://via.placeholder.com/50x50?text=No+Img";
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 mb-2"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block text-sm text-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Input Chức vụ */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ:</label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    {/* Textarea Mô tả */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    {/* Nút thao tác */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition duration-150"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
                        >
                            {staff && staff.id ? "Lưu thay đổi" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


/**
 * @component Us
 * @description Component quản lý danh sách nhân viên với chức năng CRUD cơ bản (Thêm, Sửa, Xóa)
 */
const Us = () => {
    // State chứa danh sách nhân viên
    const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
    // State quản lý việc hiển thị Modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // State chứa dữ liệu nhân viên đang được chỉnh sửa (hoặc null nếu Thêm mới)
    const [currentStaff, setCurrentStaff] = useState<FormStaff | null>(null);

    // --- Hàm xử lý Thao tác (CRUD) ---

    // Mở modal Thêm mới
    const handleAdd = () => {
        setCurrentStaff(null); // Đặt null để Modal biết là đang Thêm
        setIsModalOpen(true);
    };

    // Mở modal Sửa
    const handleEdit = (staff: Staff) => {
        setCurrentStaff(staff);
        setIsModalOpen(true);
    };

    // Xử lý nút "Xóa"
    const handleDelete = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không? Thao tác này không thể hoàn tác.")) {
            // Lọc danh sách, giữ lại nhân viên có ID khác với ID cần xóa
            setStaffList(staffList.filter(staff => staff.id !== id));
        }
    };

    // Xử lý Thêm/Sửa (Lưu)
    const handleSave = (newStaff: FormStaff) => {
        if (newStaff.id) {
            // 1. Sửa (Update)
            setStaffList(
                staffList.map(staff => staff.id === newStaff.id ? (newStaff as Staff) : staff)
            );
        } else {
            // 2. Thêm mới (Create)
            // Tính toán ID mới (ID lớn nhất hiện tại + 1)
            const maxId = staffList.length > 0 ? Math.max(...staffList.map(s => s.id), 0) : 0;
            const newId = maxId + 1;

            // Thêm nhân viên mới vào danh sách
            setStaffList([...staffList, { ...newStaff, id: newId } as Staff]);
        }
        // Đóng modal và reset trạng thái
        setIsModalOpen(false);
        setCurrentStaff(null);
    };

    // ----------------------------------------------------------------------------------
    // --- RENDER GIAO DIỆN CHÍNH ---
    // ----------------------------------------------------------------------------------
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
            {/* Thanh tiêu đề và nút Thêm */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Danh sách Nhân viên</h2>

                {/* Nút Thêm Nhân viên */}
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200 transform hover:scale-105"
                    title="Thêm nhân viên mới"
                >
                    <FaPlus className="text-lg" />
                    <span className="hidden sm:inline">Thêm Nhân viên</span>
                </button>
            </div>

            {/* Danh sách Nhân viên (Dùng Table) */}
            <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Tiêu đề bảng */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Ảnh</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức vụ</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Mô tả</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Thao tác</th>
                        </tr>
                    </thead>
                    {/* Nội dung bảng */}
                    <tbody className="bg-white divide-y divide-gray-100">
                        {staffList.length > 0 ? (
                            staffList.map((staff) => (
                                <tr key={staff.id} className="hover:bg-indigo-50/50 transition duration-150">
                                    {/* Cột Ảnh */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <img
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-300"
                                            src={staff.image}
                                            alt={staff.name}
                                            // Xử lý khi ảnh lỗi: Hiển thị placeholder
                                            onError={(e) => {
                                                const img = e.currentTarget as HTMLImageElement;
                                                img.onerror = null;
                                                img.src = "https://via.placeholder.com/40x40?text=👤";
                                            }}
                                        />
                                    </td>
                                    {/* Cột Tên */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {staff.name}
                                    </td>
                                    {/* Cột Chức vụ */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 font-medium">
                                        {staff.position}
                                    </td>
                                    {/* Cột Mô tả (Ẩn trên mobile) */}
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate hidden md:table-cell" title={staff.description}>
                                        {staff.description}
                                    </td>
                                    {/* Cột Thao tác */}
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-1">
                                            {/* Nút Sửa */}
                                            <button
                                                onClick={() => handleEdit(staff)}
                                                className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                                                title="Sửa"
                                            >
                                                <FaEdit className="text-base" />
                                            </button>
                                            {/* Nút Xóa */}
                                            <button
                                                onClick={() => handleDelete(staff.id)}
                                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                                                title="Xóa"
                                            >
                                                <FaTrashAlt className="text-base" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Thông báo khi danh sách trống
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-gray-500 italic">
                                    <FaPlus className="inline mr-2 text-xl" />
                                    Chưa có nhân viên nào trong danh sách. Hãy nhấn nút Thêm Nhân viên để bắt đầu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Hiển thị Modal */}
            {isModalOpen && (
                <StaffModal
                    staff={currentStaff}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

export default Us;
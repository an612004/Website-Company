"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import {
    Plus,
    Tag,
    Factory,
    Search,
    Edit,
    Trash2,
    Star,
    Image as ImageIcon,
    X,
    UploadCloud,
    Check,
    Minimize2,
    Maximize2
} from 'lucide-react';

// --- Khai báo kiểu dữ liệu giả lập ---
type Product = {
    id: number;
    image: string;
    name: string;
    originalPrice: number;
    sellingPrice: number;
    isDiscount: boolean;
    stock: number;
    category: string;
    sold: number;
    rating: number;
};

type Manufacturer = {
    _id: string;
    name: string;
    country: string;
};

type Category = {
    _id: string;
    name: string;
    // productCount?: number;
};

// Dữ liệu giả lập
const mockProducts: Product[] = [
    {
        id: 1,
        image: '/placeholder-laptop.jpg',
        name: 'Laptop Gaming XYZ 2024',
        originalPrice: 30000000,
        sellingPrice: 28990000,
        isDiscount: true,
        stock: 50,
        category: 'Laptop',
        sold: 25,
        rating: 4.8
    },
    {
        id: 2,
        image: '/placeholder-phone.jpg',
        name: 'Điện thoại Smart M1 Pro',
        originalPrice: 15000000,
        sellingPrice: 15000000,
        isDiscount: false,
        stock: 120,
        category: 'Điện thoại',
        sold: 80,
        rating: 4.5
    },
];

// Xóa mockManufacturers, mockCategories vì đã dùng API

// --- Component Định dạng Tiền Tệ ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// ===================================
// 1. MODAL QUẢN LÝ HÃNG SẢN XUẤT
// ===================================
interface ManufacturerModalProps {
    open: boolean;
    onClose: () => void;
}

const ManufacturerModal: React.FC<ManufacturerModalProps> = ({ open, onClose }) => {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editCountry, setEditCountry] = useState("");

    // Lấy danh sách hãng từ API khi mở modal
    React.useEffect(() => {
        if (open) {
            fetch("/api/admin/manufacturer")
                .then(res => res.json())
                .then(data => setManufacturers(data.manufacturers || []));
        }
    }, [open]);

    if (!open) return null;

    const handleAdd = async () => {
        if (!name || !country) return alert("Nhập đầy đủ tên và quốc gia!");
        setLoading(true);
        const res = await fetch("/api/admin/manufacturer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, country })
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
            setManufacturers(prev => [...prev, data.manufacturer]);
            setName("");
            setCountry("");
        } else {
            alert(data.error || "Lỗi thêm hãng sản xuất!");
        }
    };

    const handleEdit = (man: Manufacturer) => {
        setEditId(man._id);
        setEditName(man.name);
        setEditCountry(man.country);
    };

    const handleEditSave = async () => {
        if (!editId || !editName || !editCountry) return;
        setLoading(true);
        const res = await fetch("/api/admin/manufacturer", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editId, name: editName, country: editCountry })
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
            setManufacturers(prev => prev.map(m => m._id === editId ? data.manufacturer : m));
            setEditId(null);
            setEditName("");
            setEditCountry("");
        } else {
            alert(data.error || "Lỗi cập nhật hãng!");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc muốn xóa hãng này?")) return;
        setLoading(true);
        const res = await fetch("/api/admin/manufacturer", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
            setManufacturers(prev => prev.filter(m => m._id !== id));
        } else {
            alert(data.error || "Lỗi xóa hãng!");
        }
    };

    // ...existing code for edit/delete (chưa làm API xoá/sửa)

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative animate-scale-in">

                {/* Header Modal */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Factory size={24} className="text-blue-600" /> Quản Lý Hãng Sản Xuất
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Body Modal (Bảng Hãng SX) */}
                <div className="space-y-4">
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Tên hãng sản xuất"
                            className="border p-2 rounded-lg w-1/2"
                        />
                        <input
                            type="text"
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            placeholder="Quốc gia"
                            className="border p-2 rounded-lg w-1/2"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
                        >
                            <Plus size={18} /> {loading ? "Đang lưu..." : "Thêm Hãng Mới"}
                        </button>
                    </div>

                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase w-16">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tên Hãng</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Quốc Gia</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase w-24">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {manufacturers.map((man) => (
                                    <tr key={man._id}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{man._id}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            {editId === man._id ? (
                                                <input value={editName} onChange={e => setEditName(e.target.value)} className="border p-1 rounded" />
                                            ) : man.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {editId === man._id ? (
                                                <input value={editCountry} onChange={e => setEditCountry(e.target.value)} className="border p-1 rounded" />
                                            ) : man.country}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium flex gap-2">
                                            {editId === man._id ? (
                                                <>
                                                    <button onClick={handleEditSave} disabled={loading} className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition"><Check size={16} /></button>
                                                    <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"><X size={16} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEdit(man)} className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition"><Edit size={16} /></button>
                                                    <button onClick={() => handleDelete(man._id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"><Trash2 size={16} /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end pt-4 border-t mt-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===================================
// 2. MODAL QUẢN LÝ LOẠI SẢN PHẨM
// ===================================
interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ open, onClose }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    React.useEffect(() => {
        if (open) {
            fetch("/api/admin/category")
                .then(res => res.json())
                .then(data => setCategories(data.categories || []));
        }
    }, [open]);

    if (!open) return null;

    const handleAdd = async () => {
        if (!name) return alert("Nhập tên loại sản phẩm!");
        setLoading(true);
        const res = await fetch("/api/admin/category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
            setCategories(prev => [...prev, data.category]);
            setName("");
        } else {
            alert(data.error || "Lỗi thêm loại sản phẩm!");
        }
    };

    const handleEdit = (cat: Category) => {
        setEditId(cat._id);
        setEditName(cat.name);
    };

    const handleEditSave = async () => {
        if (!editId || !editName) return;
        setLoading(true);
        const res = await fetch("/api/admin/category", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editId, name: editName })
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
            setCategories(prev => prev.map(c => c._id === editId ? data.category : c));
            setEditId(null);
            setEditName("");
        } else {
            alert(data.error || "Lỗi cập nhật loại!");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc muốn xóa loại này?")) return;
        setLoading(true);
        const res = await fetch("/api/admin/category", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
            setCategories(prev => prev.filter(c => c._id !== id));
        } else {
            alert(data.error || "Lỗi xóa loại!");
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative animate-scale-in">

                {/* Header Modal */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Tag size={24} className="text-purple-600" /> Quản Lý Loại Sản Phẩm
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Body Modal (Bảng Loại SP) */}
                <div className="space-y-4">
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Tên loại sản phẩm"
                            className="border p-2 rounded-lg w-2/3"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
                        >
                            <Plus size={18} /> {loading ? "Đang lưu..." : "Thêm Loại Mới"}
                        </button>
                    </div>

                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase w-16">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tên Loại Sản Phẩm</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Số SP</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase w-24">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {categories.map((cat) => (
                                    <tr key={cat._id}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{cat._id}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            {editId === cat._id ? (
                                                <input value={editName} onChange={e => setEditName(e.target.value)} className="border p-1 rounded" />
                                            ) : cat.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-600">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500`}>
                                                {/* productCount không còn, chỉ hiển thị nếu có */}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium flex gap-2">
                                            {editId === cat._id ? (
                                                <>
                                                    <button onClick={handleEditSave} disabled={loading} className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition"><Check size={16} /></button>
                                                    <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"><X size={16} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition"><Edit size={16} /></button>
                                                    <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"><Trash2 size={16} /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500">Lưu ý: Chỉ có thể xóa Loại Sản Phẩm khi số lượng sản phẩm liên quan là 0.</p>
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end pt-4 border-t mt-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};


// ===================================
// 3. MODAL CHI TIẾT SẢN PHẨM (Không đổi)
// ===================================

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    product?: Product | null; // Null khi thêm mới
}

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, product }) => {
    // Hooks phải luôn gọi đầu component
    const isEditing = !!product;
    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState('Mô tả chi tiết sản phẩm này...');
    const [images] = useState(Array(5).fill(null).map((_, i) => product && i === 0 ? product.image : null));
    const [isDiscount, setIsDiscount] = useState(product?.isDiscount || false);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative animate-scale-in">

                {/* Header Modal */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                        {isEditing ? `Chỉnh sửa: ${product!.name}` : 'Thêm Sản phẩm Mới'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Nội dung Modal (Form) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cột 1: Hình ảnh & Mô tả */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-lg font-semibold text-blue-600 border-b pb-2">Hình ảnh & Mô tả</h4>

                        {/* Khu vực Hình ảnh */}
                        <div className="grid grid-cols-5 gap-3">
                            {images.map((imgUrl, index) => (
                                <div key={index} className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative group overflow-hidden">
                                    {imgUrl ? (
                                        <>
                                            <Image src={imgUrl} alt={`Image ${index + 1}`} width={200} height={200} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button className="text-white bg-red-600 p-1.5 rounded-full hover:bg-red-700">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-400 p-2 cursor-pointer hover:text-blue-500 transition">
                                            <UploadCloud size={24} />
                                            <span className="text-xs mt-1">Ảnh {index + 1}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">Tối đa 5 hình ảnh. Hình 1 là ảnh hiển thị chính.</p>

                        {/* Tên & Mô tả */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tên sản phẩm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập mô tả chi tiết về sản phẩm"
                            />
                        </div>
                    </div>

                    {/* Cột 2: Giá, Loại, Số lượng & Review */}
                    <div className="lg:col-span-1 space-y-4">
                        <h4 className="text-lg font-semibold text-blue-600 border-b pb-2">Thông tin bán hàng</h4>

                        {/* Giá Gốc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá Gốc (VND)</label>
                            <input type="number" defaultValue={product?.originalPrice} className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>

                        {/* Giá Bán */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá Bán (VND)</label>
                            <input type="number" defaultValue={product?.sellingPrice} className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>

                        {/* Giảm giá */}
                        <div className="flex items-center space-x-2">
                            <input
                                id="is-discount"
                                type="checkbox"
                                checked={isDiscount}
                                onChange={(e) => setIsDiscount(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="is-discount" className="text-sm font-medium text-gray-700">Áp dụng giảm giá</label>
                        </div>

                        {/* Số lượng tồn kho */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                            <input type="number" defaultValue={product?.stock} className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>

                        {/* Loại sản phẩm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm</label>
                            <select defaultValue={product?.category} className="w-full p-2 border border-gray-300 rounded-lg">
                                <option value="Laptop">Laptop</option>
                                <option value="Điện thoại">Điện thoại</option>
                                <option value="Phụ kiện">Phụ kiện</option>
                            </select>
                        </div>

                        {/* Rating & Review */}
                        <div className="pt-2 border-t mt-4">
                            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                Rating: <span className="font-bold">{product?.rating || 0}/5</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Xem 120 Reviews chi tiết...
                            </p>
                        </div>

                    </div>
                </div>

                {/* Footer Modal (Nút lưu) */}
                <div className="flex justify-end pt-4 border-t mt-6">
                    <button
                        onClick={() => { alert(`Đã lưu ${isEditing ? 'chỉnh sửa' : 'sản phẩm mới'}`); onClose(); }}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-500/50"
                    >
                        <Check size={18} /> Lưu {isEditing ? 'Thay Đổi' : 'Sản Phẩm'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// ===================================
// 4. COMPONENT CHÍNH: PRODUCT PAGE
// ===================================
export default function ProductPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // Trạng thái cho 3 modal
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isManufacturerModalOpen, setIsManufacturerModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleAddProduct = () => {
        setSelectedProduct(null); // Đặt về null để mở modal thêm mới
        setIsProductModalOpen(true);
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* 1. HEADER & ACTION BUTTONS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 md:mb-0 flex items-center gap-3">
                        <ImageIcon size={32} className="text-red-500" />
                        Quản Lý Sản Phẩm
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        {/* Nút mở Manufacturer Modal */}
                        <button
                            onClick={() => setIsManufacturerModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                            <Factory size={18} /> Hãng SX
                        </button>

                        {/* Nút mở Category Modal */}
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                            <Tag size={18} /> Loại SP
                        </button>

                        {/* Nút mở Product Modal */}
                        <button
                            onClick={handleAddProduct}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition shadow-lg shadow-red-500/50"
                        >
                            <Plus size={18} /> Thêm Sản Phẩm Mới
                        </button>
                    </div>
                </div>

                {/* 2. THANH TÌM KIẾM & THỐNG KÊ */}
                <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100 flex justify-between items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Tên sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                        Tổng cộng: <span className="font-bold text-red-500">{mockProducts.length}</span> sản phẩm
                    </div>
                </div>

                {/* 3. BẢNG SẢN PHẨM */}
                <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* HEADER BẢNG */}
                        <thead className="bg-blue-50/70">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">STT</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">Ảnh</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên Sản Phẩm</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giá Gốc</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giá Bán</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">Giảm Giá</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">SL Tồn</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">Đã Bán</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Hành Động</th>
                            </tr>
                        </thead>

                        {/* BODY BẢNG */}
                        <tbody className="bg-white divide-y divide-gray-100">
                            {mockProducts.map((product, idx) => (
                                <tr key={product.id} className="hover:bg-blue-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                        {idx + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 relative">
                                            <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                                        {product.name}
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Star size={12} className="text-yellow-400 fill-yellow-400" /> {product.rating}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 line-through">
                                        {formatCurrency(product.originalPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                                        {formatCurrency(product.sellingPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {product.isDiscount ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <Minimize2 size={12} className="mr-1" /> Giảm
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <Maximize2 size={12} className="mr-1" /> Không
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.sold}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-100 transition"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => alert(`Xóa sản phẩm: ${product.name}`)}
                                                className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-100 transition"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. CÁC MODAL HIỂN THỊ */}
            <ProductModal
                open={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                product={selectedProduct}
            />

            <ManufacturerModal
                open={isManufacturerModalOpen}
                onClose={() => setIsManufacturerModalOpen(false)}
            />

            <CategoryModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </div>
    );
}
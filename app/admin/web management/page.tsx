"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
    PanelsTopLeft,
    Plus,
    Pencil,
    Trash2,
    FolderPlus,
    Tag,
    X,
    Check,
    Link as LinkIcon,
    ImageIcon,
    Search,
    Loader2,
    ExternalLink,
    Upload
} from 'lucide-react';

// Interfaces riêng cho quản lý website
interface WebCategory {
    _id: string;
    name: string;
}

interface WebType {
    _id: string;
    name: string;
    description: string;
    category: WebCategory;
}

interface WebProduct {
    _id: string;
    name: string;
    description: string;
    image: string;
    originalPrice: number;
    sellingPrice: number;
    isDiscount: boolean;
    category: WebCategory;
    type: WebType;
    link: string;
}

function WebManagementPage() {
    // States cho danh mục và loại riêng cho web
    const [categories, setCategories] = useState<WebCategory[]>([]);
    const [types, setTypes] = useState<WebType[]>([]);
    const [products, setProducts] = useState<WebProduct[]>([]);

    // States cho loading
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // States cho form tạo danh mục
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<WebCategory | null>(null);

    // States cho form tạo loại
    const [newTypeName, setNewTypeName] = useState('');
    const [newTypeDescription, setNewTypeDescription] = useState('');
    const [newTypeCategory, setNewTypeCategory] = useState('');
    const [editingType, setEditingType] = useState<WebType | null>(null);
    const [editingTypeCategory, setEditingTypeCategory] = useState('');

    // States cho form tạo sản phẩm
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<WebProduct | null>(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        image: '',
        originalPrice: 0,
        sellingPrice: 0,
        isDiscount: false,
        category: '',
        type: '',
        link: ''
    });

    // States cho tìm kiếm và lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');

    // State cho upload ảnh
    const [uploadingImage, setUploadingImage] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Ref cho textarea để paste ảnh
    const descriptionRef = useRef<HTMLDivElement>(null);

    // Fetch dữ liệu ban đầu
    useEffect(() => {
        fetchCategories();
        fetchTypes();
        fetchProducts();
    }, []);

    // Fetch categories riêng cho web
    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/web-category');
            const data = await res.json();
            if (data.categories) setCategories(data.categories);
        } catch (err) {
            console.error('Lỗi lấy danh mục web:', err);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch types riêng cho web
    const fetchTypes = async () => {
        try {
            const res = await fetch('/api/admin/web-type');
            const data = await res.json();
            if (data.types) setTypes(data.types);
        } catch (err) {
            console.error('Lỗi lấy loại web:', err);
        } finally {
            setLoadingTypes(false);
        }
    };

    // Fetch products riêng cho web
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/web-product');
            const data = await res.json();
            if (data.products) setProducts(data.products);
        } catch (err) {
            console.error('Lỗi lấy sản phẩm web:', err);
        } finally {
            setLoadingProducts(false);
        }
    };

    // CRUD Danh mục Web
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await fetch('/api/admin/web-category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });
            const data = await res.json();
            if (data.success) {
                setCategories([data.category, ...categories]);
                setNewCategoryName('');
            }
        } catch (err) {
            console.error('Lỗi thêm danh mục:', err);
        }
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory || !editingCategory.name.trim()) return;
        try {
            const res = await fetch('/api/admin/web-category', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingCategory._id, name: editingCategory.name })
            });
            const data = await res.json();
            if (data.success) {
                setCategories(categories.map(c => c._id === editingCategory._id ? data.category : c));
                setEditingCategory(null);
            }
        } catch (err) {
            console.error('Lỗi cập nhật danh mục:', err);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
        try {
            const res = await fetch('/api/admin/web-category', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setCategories(categories.filter(c => c._id !== id));
            }
        } catch (err) {
            console.error('Lỗi xóa danh mục:', err);
        }
    };

    // CRUD Loại Web
    const handleAddType = async () => {
        if (!newTypeName.trim() || !newTypeCategory) {
            alert('Vui lòng nhập tên loại và chọn danh mục!');
            return;
        }
        try {
            const res = await fetch('/api/admin/web-type', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTypeName, description: newTypeDescription, category: newTypeCategory })
            });
            const data = await res.json();
            if (data.success) {
                setTypes([data.type, ...types]);
                setNewTypeName('');
                setNewTypeDescription('');
                setNewTypeCategory('');
            }
        } catch (err) {
            console.error('Lỗi thêm loại:', err);
        }
    };

    const handleUpdateType = async () => {
        if (!editingType || !editingType.name.trim() || !editingTypeCategory) return;
        try {
            const res = await fetch('/api/admin/web-type', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingType._id,
                    name: editingType.name,
                    description: editingType.description,
                    category: editingTypeCategory
                })
            });
            const data = await res.json();
            if (data.success) {
                setTypes(types.map(t => t._id === editingType._id ? data.type : t));
                setEditingType(null);
                setEditingTypeCategory('');
            }
        } catch (err) {
            console.error('Lỗi cập nhật loại:', err);
        }
    };

    const handleDeleteType = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa loại này?')) return;
        try {
            const res = await fetch('/api/admin/web-type', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setTypes(types.filter(t => t._id !== id));
            }
        } catch (err) {
            console.error('Lỗi xóa loại:', err);
        }
    };

    // CRUD Sản phẩm Web
    const handleOpenProductModal = (product?: WebProduct) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                name: product.name,
                description: product.description || '',
                image: product.image || '',
                originalPrice: product.originalPrice,
                sellingPrice: product.sellingPrice,
                isDiscount: product.isDiscount,
                category: product.category?._id || '',
                type: product.type?._id || '',
                link: product.link || ''
            });
        } else {
            setEditingProduct(null);
            setProductForm({
                name: '',
                description: '',
                image: '',
                originalPrice: 0,
                sellingPrice: 0,
                isDiscount: false,
                category: categories[0]?._id || '',
                type: types[0]?._id || '',
                link: ''
            });
        }
        setShowProductModal(true);
    };

    const handleSaveProduct = async () => {
        if (!productForm.name.trim() || !productForm.category || !productForm.type) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const body = editingProduct
                ? { id: editingProduct._id, ...productForm }
                : productForm;

            const res = await fetch('/api/admin/web-product', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                fetchProducts();
                setShowProductModal(false);
            }
        } catch (err) {
            console.error('Lỗi lưu sản phẩm:', err);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            const res = await fetch('/api/admin/web-product', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setProducts(products.filter(p => p._id !== id));
            }
        } catch (err) {
            console.error('Lỗi xóa sản phẩm:', err);
        }
    };

    // Xử lý paste ảnh vào mô tả
    const handleDescriptionPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        setProductForm(prev => ({
                            ...prev,
                            description: prev.description + `<img src="${base64}" alt="image" style="max-width:100%;margin:10px 0;" />`
                        }));
                    };
                    reader.readAsDataURL(file);
                }
                return;
            }
        }
    };

    // Xử lý upload ảnh từ máy tính
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload-banner', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.url) {
                setProductForm(prev => ({ ...prev, image: data.url }));
            } else {
                alert('Upload thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            console.error('Lỗi upload ảnh:', err);
            alert('Lỗi upload ảnh');
        } finally {
            setUploadingImage(false);
            // Reset input để có thể chọn lại cùng file
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        }
    };

    // Lọc loại theo danh mục đã chọn trong form
    const filteredTypesForForm = productForm.category
        ? types.filter(t => t.category?._id === productForm.category)
        : types;

    // Lọc sản phẩm
    const filteredProducts = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = !filterCategory || p.category?._id === filterCategory;
        const matchType = !filterType || p.type?._id === filterType;
        return matchSearch && matchCategory && matchType;
    });

    // Format giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                <PanelsTopLeft size={32} className="text-red-500" />
                Quản Lý Giao Diện Website
            </h2>

            {/* Grid 2 cột: Danh mục và Loại */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Quản lý Danh mục */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FolderPlus className="text-blue-500" size={24} />
                        <h3 className="text-xl font-bold text-gray-800">Quản lý Danh mục Web</h3>
                    </div>

                    {/* Form thêm danh mục */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Tên danh mục mới..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button
                            onClick={handleAddCategory}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
                        >
                            <Plus size={18} /> Thêm
                        </button>
                    </div>

                    {/* Danh sách danh mục */}
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {loadingCategories ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="animate-spin text-blue-500" size={24} />
                            </div>
                        ) : categories.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Chưa có danh mục nào</p>
                        ) : (
                            categories.map((cat) => (
                                <div key={cat._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    {editingCategory?._id === cat._id ? (
                                        <input
                                            type="text"
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                            className="flex-1 px-3 py-1 border rounded mr-2"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="font-medium text-gray-700">{cat.name}</span>
                                    )}
                                    <div className="flex gap-2">
                                        {editingCategory?._id === cat._id ? (
                                            <>
                                                <button onClick={handleUpdateCategory} className="p-1 text-green-600 hover:bg-green-100 rounded">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => setEditingCategory(null)} className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => setEditingCategory(cat)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteCategory(cat._id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quản lý Loại */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Tag className="text-green-500" size={24} />
                        <h3 className="text-xl font-bold text-gray-800">Quản lý Loại Web</h3>
                    </div>

                    {/* Form thêm loại */}
                    <div className="space-y-3 mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Tên loại..."
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Mô tả..."
                                value={newTypeDescription}
                                onChange={(e) => setNewTypeDescription(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={newTypeCategory}
                                onChange={(e) => setNewTypeCategory(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddType}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-1"
                            >
                                <Plus size={18} /> Thêm loại
                            </button>
                        </div>
                    </div>

                    {/* Danh sách loại */}
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {loadingTypes ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="animate-spin text-green-500" size={24} />
                            </div>
                        ) : types.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Chưa có loại nào</p>
                        ) : (
                            types.map((t) => (
                                <div key={t._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    {editingType?._id === t._id ? (
                                        <div className="flex gap-2 flex-1 mr-2 flex-wrap">
                                            <input
                                                type="text"
                                                value={editingType.name}
                                                onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                                                className="flex-1 min-w-[120px] px-3 py-1 border rounded"
                                                autoFocus
                                            />
                                            <input
                                                type="text"
                                                value={editingType.description}
                                                onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                                                className="flex-1 min-w-[120px] px-3 py-1 border rounded"
                                                placeholder="Mô tả"
                                            />
                                            <select
                                                value={editingTypeCategory}
                                                onChange={(e) => setEditingTypeCategory(e.target.value)}
                                                className="flex-1 min-w-[120px] px-3 py-1 border rounded"
                                            >
                                                <option value="">-- Chọn danh mục --</option>
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-700">{t.name}</span>
                                                {t.description && <span className="text-sm text-gray-500">- {t.description}</span>}
                                            </div>
                                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded w-fit mt-1">
                                                {t.category?.name || 'Chưa có danh mục'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        {editingType?._id === t._id ? (
                                            <>
                                                <button onClick={handleUpdateType} className="p-1 text-green-600 hover:bg-green-100 rounded">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => { setEditingType(null); setEditingTypeCategory(''); }} className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => { setEditingType(t); setEditingTypeCategory(t.category?._id || ''); }} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteType(t._id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Thanh công cụ sản phẩm */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Tìm kiếm */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm giao diện..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>

                    {/* Bộ lọc */}
                    <div className="flex gap-3">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">Tất cả loại</option>
                            {types.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => handleOpenProductModal()}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 font-medium"
                        >
                            <Plus size={20} /> Thêm giao diện
                        </button>
                    </div>
                </div>
            </div>

            {/* Bảng sản phẩm */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                            <tr>
                                <th className="px-4 py-4 text-left font-semibold">STT</th>
                                <th className="px-4 py-4 text-left font-semibold">Ảnh</th>
                                <th className="px-4 py-4 text-left font-semibold">Tên giao diện</th>
                                <th className="px-4 py-4 text-left font-semibold">Mô tả</th>
                                <th className="px-4 py-4 text-left font-semibold">Giá gốc</th>
                                <th className="px-4 py-4 text-left font-semibold">Giá bán</th>
                                <th className="px-4 py-4 text-center font-semibold">Giảm giá</th>
                                <th className="px-4 py-4 text-left font-semibold">Loại</th>
                                <th className="px-4 py-4 text-left font-semibold">Danh mục</th>
                                <th className="px-4 py-4 text-left font-semibold">Link</th>
                                <th className="px-4 py-4 text-center font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingProducts ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-8">
                                        <Loader2 className="animate-spin text-red-500 mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-8 text-gray-500">
                                        Không có giao diện nào
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-gray-600 font-medium">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-lg border"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <ImageIcon className="text-gray-400" size={24} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-800 line-clamp-2">{product.name}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div
                                                className="text-sm text-gray-600 line-clamp-2 max-w-xs"
                                                dangerouslySetInnerHTML={{ __html: product.description || '-' }}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </td>
                                        <td className="px-4 py-3 text-red-600 font-bold">
                                            {formatPrice(product.sellingPrice)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {product.isDiscount ? (
                                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <Check size={14} className="mr-1" /> Có
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    <X size={14} className="mr-1" /> Không
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                                {product.type?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                                {product.category?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {product.link ? (
                                                <a
                                                    href={product.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenProductModal(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                    title="Sửa"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal thêm/sửa sản phẩm */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingProduct ? 'Chỉnh sửa giao diện' : 'Thêm giao diện mới'}
                            </h3>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            {/* Tên giao diện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên giao diện <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Nhập tên giao diện..."
                                />
                            </div>

                            {/* URL ảnh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ảnh hiển thị
                                </label>
                                <div className="space-y-3">
                                    {/* Nút chọn ảnh từ máy */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploadingImage ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin text-red-500" />
                                                    <span className="text-sm text-gray-600">Đang upload...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={20} className="text-gray-500" />
                                                    <span className="text-sm text-gray-600">Chọn ảnh từ máy</span>
                                                </>
                                            )}
                                        </label>
                                        <span className="text-gray-400 text-sm">hoặc</span>
                                    </div>

                                    {/* Input URL ảnh */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={productForm.image}
                                            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Nhập URL ảnh trực tiếp..."
                                        />
                                        {productForm.image && (
                                            <div className="relative">
                                                <img src={productForm.image} alt="Preview" className="w-14 h-14 object-cover rounded-lg border" />
                                                <button
                                                    onClick={() => setProductForm({ ...productForm, image: '' })}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả <span className="text-gray-400 text-xs">(Có thể paste ảnh vào đây)</span>
                                </label>
                                <div
                                    ref={descriptionRef}
                                    contentEditable
                                    onPaste={handleDescriptionPaste}
                                    onInput={(e) => setProductForm({ ...productForm, description: e.currentTarget.innerHTML })}
                                    dangerouslySetInnerHTML={{ __html: productForm.description }}
                                    className="w-full min-h-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent overflow-y-auto"
                                    style={{ maxHeight: '300px' }}
                                />
                            </div>

                            {/* Giá */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giá gốc
                                    </label>
                                    <input
                                        type="number"
                                        value={productForm.originalPrice}
                                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="0"
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giá bán
                                    </label>
                                    <input
                                        type="number"
                                        value={productForm.sellingPrice}
                                        onChange={(e) => setProductForm({ ...productForm, sellingPrice: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="0"
                                        min={0}
                                    />
                                </div>
                            </div>

                            {/* Checkbox giảm giá */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isDiscount"
                                    checked={productForm.isDiscount}
                                    onChange={(e) => setProductForm({ ...productForm, isDiscount: e.target.checked })}
                                    className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="isDiscount" className="text-sm font-medium text-gray-700">
                                    Đánh dấu giảm giá
                                </label>
                            </div>

                            {/* Danh mục và Loại */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => {
                                            const newCategory = e.target.value;
                                            // Khi đổi danh mục, reset loại về rỗng
                                            setProductForm({
                                                ...productForm,
                                                category: newCategory,
                                                type: '' // Reset loại khi đổi danh mục
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Loại <span className="text-red-500">*</span>
                                        {productForm.category && filteredTypesForForm.length === 0 && (
                                            <span className="text-orange-500 text-xs ml-2">(Chưa có loại cho danh mục này)</span>
                                        )}
                                    </label>
                                    <select
                                        value={productForm.type}
                                        onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        disabled={!productForm.category}
                                    >
                                        <option value="">
                                            {!productForm.category
                                                ? '-- Chọn danh mục trước --'
                                                : filteredTypesForForm.length === 0
                                                    ? '-- Không có loại nào --'
                                                    : 'Chọn loại'
                                            }
                                        </option>
                                        {filteredTypesForForm.map(t => (
                                            <option key={t._id} value={t._id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link giao diện
                                </label>
                                <div className="flex items-center gap-2">
                                    <LinkIcon size={20} className="text-gray-400" />
                                    <input
                                        type="url"
                                        value={productForm.link}
                                        onChange={(e) => setProductForm({ ...productForm, link: e.target.value })}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="https://example.com/demo"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium flex items-center gap-2"
                            >
                                <Check size={18} />
                                {editingProduct ? 'Cập nhật' : 'Thêm giao diện'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WebManagementPage;

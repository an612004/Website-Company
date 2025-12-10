"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Folder,
    FileText,
    Image as ImageIcon,
    X,
    Save,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link,
    Type,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Code,
    Upload,
} from "lucide-react";

// Types
interface BlogCategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
}

interface Blog {
    _id: string;
    title: string;
    slug: string;
    thumbnail: string;
    description: string;
    content: string;
    category: BlogCategory | string;
    author: string;
    tags: string[];
    views: number;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt?: string;
    createdAt: string;
}

export default function BlogsPage() {
    // Tab state
    const [activeTab, setActiveTab] = useState<"blogs" | "categories">("blogs");

    // Categories state
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
    const [categoryForm, setCategoryForm] = useState({ name: "", description: "", order: 0, isActive: true });

    // Blogs state
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [blogForm, setBlogForm] = useState({
        title: "",
        thumbnail: "",
        description: "",
        content: "",
        category: "",
        author: "Admin",
        tags: "",
        isPublished: false,
        isFeatured: false,
    });

    // Search & filter
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterPublished, setFilterPublished] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Loading states
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Editor ref
    const editorRef = useRef<HTMLDivElement>(null);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const response = await fetch("/api/blog-categories");
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    // Fetch blogs
    const fetchBlogs = useCallback(async () => {
        setLoadingBlogs(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
            });
            if (filterCategory) params.append("category", filterCategory);
            if (filterPublished) params.append("isPublished", filterPublished);
            if (searchTerm) params.append("search", searchTerm);

            const response = await fetch(`/api/blogs?${params}`);
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoadingBlogs(false);
        }
    }, [currentPage, filterCategory, filterPublished, searchTerm]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Category CRUD
    const handleSaveCategory = async () => {
        if (!categoryForm.name.trim()) {
            alert("Vui lòng nhập tên danh mục");
            return;
        }

        setActionLoading("save-category");
        try {
            const url = editingCategory
                ? `/api/blog-categories/${editingCategory._id}`
                : "/api/blog-categories";
            const method = editingCategory ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoryForm),
            });

            const data = await response.json();
            if (data.success) {
                fetchCategories();
                setShowCategoryModal(false);
                resetCategoryForm();
            } else {
                alert(data.error || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Có lỗi xảy ra");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        setActionLoading(id);
        try {
            const response = await fetch(`/api/blog-categories/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
                fetchCategories();
            } else {
                alert(data.error || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Có lỗi xảy ra");
        } finally {
            setActionLoading(null);
        }
    };

    const resetCategoryForm = () => {
        setCategoryForm({ name: "", description: "", order: 0, isActive: true });
        setEditingCategory(null);
    };

    // Blog CRUD
    const handleSaveBlog = async () => {
        if (!blogForm.title.trim() || !blogForm.thumbnail || !blogForm.description.trim() || !blogForm.category) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        // Get content from editor
        const content = editorRef.current?.innerHTML || "";
        if (!content.trim() || content === "<br>") {
            alert("Vui lòng nhập nội dung bài viết");
            return;
        }

        setActionLoading("save-blog");
        try {
            const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
            const method = editingBlog ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...blogForm,
                    content,
                    tags: blogForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
                    isFeatured: blogForm.isFeatured,
                }),
            });

            const data = await response.json();
            if (data.success) {
                fetchBlogs();
                setShowBlogModal(false);
                resetBlogForm();
            } else {
                alert(data.error || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Có lỗi xảy ra");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

        setActionLoading(id);
        try {
            const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
                fetchBlogs();
            } else {
                alert(data.error || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Có lỗi xảy ra");
        } finally {
            setActionLoading(null);
        }
    };

    const handleTogglePublish = async (blog: Blog) => {
        setActionLoading(blog._id);
        try {
            const response = await fetch(`/api/blogs/${blog._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !blog.isPublished }),
            });
            const data = await response.json();
            if (data.success) {
                fetchBlogs();
            }
        } catch (error) {
            console.error("Error toggling publish:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const resetBlogForm = () => {
        setBlogForm({
            title: "",
            thumbnail: "",
            description: "",
            content: "",
            category: "",
            author: "Admin",
            tags: "",
            isPublished: false,
            isFeatured: false,
        });
        setEditingBlog(null);
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
        }
    };

    const openEditBlog = (blog: Blog) => {
        setEditingBlog(blog);
        setBlogForm({
            title: blog.title,
            thumbnail: blog.thumbnail,
            description: blog.description,
            content: blog.content,
            category: typeof blog.category === "object" ? blog.category._id : blog.category,
            author: blog.author,
            tags: blog.tags.join(", "),
            isPublished: blog.isPublished,
            isFeatured: blog.isFeatured ?? false,
        });
        setShowBlogModal(true);
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.innerHTML = blog.content;
            }
        }, 100);
    };

    // Editor commands
    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const insertImage = () => {
        const url = prompt("Nhập URL hình ảnh:");
        if (url) {
            execCommand("insertImage", url);
        }
    };

    const insertLink = () => {
        const url = prompt("Nhập URL liên kết:");
        if (url) {
            execCommand("createLink", url);
        }
    };

    // Handle paste with images
    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith("image/")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    // Upload to Cloudinary or convert to base64
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        execCommand("insertImage", base64);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    // Handle thumbnail upload
    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setBlogForm({ ...blogForm, thumbnail: event.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Quản lý Tin tức & Blog
                        </h1>
                        <p className="text-gray-500">Quản lý bài viết và danh mục tin tức</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("blogs")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${activeTab === "blogs"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    Bài viết
                </button>
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${activeTab === "categories"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <Folder className="w-5 h-5" />
                    Danh mục
                </button>
            </div>

            {/* Categories Tab */}
            {activeTab === "categories" && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Danh mục bài viết</h2>
                        <button
                            onClick={() => {
                                resetCategoryForm();
                                setShowCategoryModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm danh mục
                        </button>
                    </div>

                    {loadingCategories ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>Chưa có danh mục nào</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">STT</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Tên danh mục</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Mô tả</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Thứ tự</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Trạng thái</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-600">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, index) => (
                                        <tr key={cat._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                                            <td className="py-3 px-4 font-medium text-gray-800">{cat.name}</td>
                                            <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{cat.description || "-"}</td>
                                            <td className="py-3 px-4 text-gray-600">{cat.order}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${cat.isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {cat.isActive ? "Hoạt động" : "Ẩn"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingCategory(cat);
                                                            setCategoryForm({
                                                                name: cat.name,
                                                                description: cat.description || "",
                                                                order: cat.order,
                                                                isActive: cat.isActive,
                                                            });
                                                            setShowCategoryModal(true);
                                                        }}
                                                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat._id)}
                                                        disabled={actionLoading === cat._id}
                                                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                                                    >
                                                        {actionLoading === cat._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Blogs Tab */}
            {activeTab === "blogs" && (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="bg-white rounded-2xl shadow-sm p-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all"
                                />
                            </div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500"
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            <select
                                value={filterPublished}
                                onChange={(e) => setFilterPublished(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="true">Đã xuất bản</option>
                                <option value="false">Bản nháp</option>
                            </select>
                            <button
                                onClick={() => {
                                    resetBlogForm();
                                    setShowBlogModal(true);
                                }}
                                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" />
                                Thêm bài viết
                            </button>
                        </div>
                    </div>

                    {/* Blog list */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {loadingBlogs ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p>Chưa có bài viết nào</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-600">STT</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Ảnh</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Tiêu đề</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Danh mục</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Trạng thái</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Nổi bật</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Ngày tạo</th>
                                                <th className="text-center py-3 px-4 font-semibold text-gray-600">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {blogs.map((blog, index) => (
                                                <tr key={blog._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-600">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <img
                                                            src={blog.thumbnail}
                                                            alt={blog.title}
                                                            className="w-16 h-12 object-cover rounded-lg"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p className="font-medium text-gray-800 line-clamp-1">{blog.title}</p>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{blog.description}</p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                            {typeof blog.category === "object" ? blog.category.name : "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${blog.isPublished
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                            {blog.isPublished ? "Đã xuất bản" : "Bản nháp"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={blog.isFeatured}
                                                                onChange={async (e) => {
                                                                    setActionLoading(blog._id);
                                                                    try {
                                                                        const response = await fetch(`/api/blogs/${blog._id}`, {
                                                                            method: "PUT",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({ isFeatured: e.target.checked }),
                                                                        });
                                                                        const data = await response.json();
                                                                        if (data.success) {
                                                                            fetchBlogs();
                                                                            console.log(`Cập nhật nổi bật cho bài viết ${blog.title} thành công:`, e.target.checked);
                                                                        } else {
                                                                            console.error("Lỗi cập nhật nổi bật:", data.error);
                                                                        }
                                                                    } catch (error) {
                                                                        console.error("Lỗi cập nhật nổi bật:", error);
                                                                    } finally {
                                                                        setActionLoading(null);
                                                                    }
                                                                }}
                                                                className="w-5 h-5 accent-blue-500 cursor-pointer"
                                                                title="Đánh dấu nổi bật"
                                                            />
                                                            {blog.isFeatured && !blog.isPublished && (
                                                                <span className="text-xs text-red-500 mt-1">* Chưa xuất bản</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-500">
                                                        {formatDate(blog.createdAt)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => handleTogglePublish(blog)}
                                                                disabled={actionLoading === blog._id}
                                                                className={`p-2 rounded-lg transition-colors ${blog.isPublished
                                                                        ? "hover:bg-yellow-100 text-yellow-600"
                                                                        : "hover:bg-green-100 text-green-600"
                                                                    }`}
                                                                title={blog.isPublished ? "Ẩn bài" : "Xuất bản"}
                                                            >
                                                                {blog.isPublished ? (
                                                                    <EyeOff className="w-4 h-4" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => openEditBlog(blog)}
                                                                className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBlog(blog._id)}
                                                                disabled={actionLoading === blog._id}
                                                                className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                                                            >
                                                                {actionLoading === blog._id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-500">
                                            Trang {currentPage} / {totalPages}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
                            </h2>
                            <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên danh mục <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tên danh mục"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    placeholder="Nhập mô tả"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                                    <input
                                        type="number"
                                        value={categoryForm.order}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                    <select
                                        value={categoryForm.isActive ? "true" : "false"}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.value === "true" })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="true">Hoạt động</option>
                                        <option value="false">Ẩn</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t">
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveCategory}
                                disabled={actionLoading === "save-category"}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
                            >
                                {actionLoading === "save-category" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Modal */}
            {showBlogModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingBlog ? "Sửa bài viết" : "Thêm bài viết mới"}
                            </h2>
                            <button onClick={() => setShowBlogModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Basic info */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tiêu đề <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={blogForm.title}
                                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập tiêu đề bài viết"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mô tả ngắn <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={blogForm.description}
                                            onChange={(e) => setBlogForm({ ...blogForm, description: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            placeholder="Nhập mô tả ngắn cho bài viết"
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">{blogForm.description.length}/500</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ảnh đại diện <span className="text-red-500">*</span>
                                        </label>
                                        <div className="border-2 border-dashed rounded-xl p-4 text-center">
                                            {blogForm.thumbnail ? (
                                                <div className="relative">
                                                    <img
                                                        src={blogForm.thumbnail}
                                                        alt="Thumbnail"
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        onClick={() => setBlogForm({ ...blogForm, thumbnail: "" })}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer">
                                                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500">Click để tải ảnh</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleThumbnailUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Danh mục <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={blogForm.category}
                                            onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                        <input
                                            type="text"
                                            value={blogForm.tags}
                                            onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="tag1, tag2, tag3"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="isPublished"
                                            checked={blogForm.isPublished}
                                            onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                                            className="w-5 h-5 rounded text-blue-500"
                                        />
                                        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                                            Xuất bản ngay
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Rich Text Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung bài viết <span className="text-red-500">*</span>
                                </label>
                                {/* Toolbar */}
                                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-b-0 rounded-t-xl">
                                    <button
                                        type="button"
                                        onClick={() => execCommand("bold")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="In đậm"
                                    >
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("italic")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="In nghiêng"
                                    >
                                        <Italic className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("underline")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Gạch chân"
                                    >
                                        <Underline className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                                    <button
                                        type="button"
                                        onClick={() => execCommand("formatBlock", "<h1>")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Heading 1"
                                    >
                                        <Heading1 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("formatBlock", "<h2>")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Heading 2"
                                    >
                                        <Heading2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("formatBlock", "<h3>")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Heading 3"
                                    >
                                        <Heading3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("formatBlock", "<p>")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Paragraph"
                                    >
                                        <Type className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                                    <button
                                        type="button"
                                        onClick={() => execCommand("insertUnorderedList")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Danh sách"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("insertOrderedList")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Danh sách số"
                                    >
                                        <ListOrdered className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("formatBlock", "<blockquote>")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Trích dẫn"
                                    >
                                        <Quote className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("formatBlock", "<pre>")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Code"
                                    >
                                        <Code className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                                    <button
                                        type="button"
                                        onClick={() => execCommand("justifyLeft")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Căn trái"
                                    >
                                        <AlignLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("justifyCenter")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Căn giữa"
                                    >
                                        <AlignCenter className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand("justifyRight")}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Căn phải"
                                    >
                                        <AlignRight className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                                    <button
                                        type="button"
                                        onClick={insertLink}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Chèn liên kết"
                                    >
                                        <Link className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={insertImage}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Chèn ảnh từ URL"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                {/* Editor */}
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    onPaste={handlePaste}
                                    className="min-h-[300px] p-4 border rounded-b-xl focus:outline-none focus:ring-2 focus:ring-blue-500 prose max-w-none"
                                    style={{ whiteSpace: "pre-wrap" }}
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    💡 Bạn có thể copy và paste hình ảnh trực tiếp vào editor
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 p-6 border-t sticky bottom-0 bg-white rounded-b-2xl">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={blogForm.isFeatured}
                                    onChange={(e) => setBlogForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                                />
                                <span className="text-gray-700">Nổi bật trang chủ</span>
                            </label>
                            <button
                                onClick={() => setShowBlogModal(false)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveBlog}
                                disabled={actionLoading === "save-blog"}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50"
                            >
                                {actionLoading === "save-blog" ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {editingBlog ? "Cập nhật" : "Tạo bài viết"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
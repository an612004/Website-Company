'use client';
import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Link from "next/link";
import { Loader2, Calendar, Eye, ChevronRight, Tag, Folder, ArrowRight } from "lucide-react";

interface BlogCategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

interface Blog {
    _id: string;
    title: string;
    slug: string;
    thumbnail: string;
    description: string;
    category: BlogCategory;
    views: number;
    createdAt: string;
    tags: string[];
}

function NewPage() {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [blogsByCategory, setBlogsByCategory] = useState<{ [key: string]: Blog[] }>({});
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch("/api/blog-categories");
            const data = await response.json();
            if (data.success) {
                setCategories(data.data.filter((cat: BlogCategory) => cat));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    // Fetch blogs
    const fetchBlogs = useCallback(async () => {
        try {
            const response = await fetch("/api/blogs?isPublished=true&limit=100");
            const data = await response.json();
            if (data.success) {
                // Group blogs by category
                const grouped: { [key: string]: Blog[] } = {};
                data.data.forEach((blog: Blog) => {
                    const catId = typeof blog.category === 'object' ? blog.category._id : blog.category;
                    if (!grouped[catId]) {
                        grouped[catId] = [];
                    }
                    grouped[catId].push(blog);
                });
                setBlogsByCategory(grouped);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchCategories(), fetchBlogs()]);
            setLoading(false);
        };
        loadData();
    }, [fetchCategories, fetchBlogs]);

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Get all blogs
    const getAllBlogs = () => {
        return Object.values(blogsByCategory).flat().sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    };

    // Get displayed blogs
    const getDisplayedBlogs = () => {
        if (selectedCategory === "all") {
            return getAllBlogs();
        }
        return blogsByCategory[selectedCategory] || [];
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            {/* Hero Section */}
            <div className="relative w-full h-[260px] md:h-[350px] flex items-center justify-center 
                bg-[url('https://i.pinimg.com/736x/de/0e/7a/de0e7a76d4269610800ba098ed1ccfa7.jpg')] bg-cover bg-center bg-fixed">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0e7490]/40 to-[#0f172a]/80"></div>
                <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 px-8 py-6 rounded-2xl shadow-2xl text-center">
                    <p className="text-white/80 text-xs md:text-sm font-semibold tracking-[4px] uppercase animate-fade-in">
                        ✨ Anbi Company
                    </p>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.5)]">
                        Tin Tức
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                    </div>
                ) : (
                    <>
                        {/* Category Filter Tabs */}
                        <div className="mb-10">
                            <div className="flex flex-wrap gap-3 justify-center">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === "all"
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                        }`}
                                >
                                    <Folder className="w-4 h-4" />
                                    Tất cả ({getAllBlogs().length})
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category._id}
                                        onClick={() => setSelectedCategory(category._id)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === category._id
                                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                            }`}
                                    >
                                        <Tag className="w-4 h-4" />
                                        {category.name} ({blogsByCategory[category._id]?.length || 0})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Display Mode: Show by category or filtered */}
                        {selectedCategory === "all" ? (
                            // Show blogs grouped by category
                            <div className="space-y-16">
                                {categories.map((category) => {
                                    const categoryBlogs = blogsByCategory[category._id] || [];
                                    if (categoryBlogs.length === 0) return null;

                                    return (
                                        <section key={category._id} className="animate-fade-in">
                                            {/* Category Header */}
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-10 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                                                    <div>
                                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                                            {category.name}
                                                        </h2>
                                                        {category.description && (
                                                            <p className="text-gray-500 text-sm mt-1">{category.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedCategory(category._id)}
                                                    className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium text-sm transition-colors"
                                                >
                                                    Xem tất cả
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Blog Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                                {categoryBlogs.slice(0, 4).map((blog) => (
                                                    <Link
                                                        key={blog._id}
                                                        href={`/news/${blog.slug}`}
                                                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100"
                                                    >
                                                        <div className="relative overflow-hidden h-36">
                                                            <img
                                                                src={blog.thumbnail}
                                                                alt={blog.title}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                            <div className="absolute top-2 left-2">
                                                                <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-cyan-600 rounded-full text-[10px] font-semibold">
                                                                    {category.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="font-bold text-gray-800 group-hover:text-cyan-600 transition-colors line-clamp-2 mb-2 text-base">
                                                                {blog.title}
                                                            </h3>
                                                            <p className="text-gray-500 line-clamp-2 mb-3 text-sm">
                                                                {blog.description}
                                                            </p>
                                                            <div className="flex items-center justify-between text-[10px] text-gray-400">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {formatDate(blog.createdAt)}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Eye className="w-3 h-3" />
                                                                        {blog.views}
                                                                    </span>
                                                                </div>
                                                                <span className="flex items-center gap-1 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}

                                {/* Empty state */}
                                {categories.every(cat => !blogsByCategory[cat._id]?.length) && (
                                    <div className="text-center py-20">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Folder className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có bài viết nào</h3>
                                        <p className="text-gray-500">Các bài viết sẽ được cập nhật sớm</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Show filtered blogs
                            <div>
                                {/* Selected Category Header */}
                                {categories.find(c => c._id === selectedCategory) && (
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-1.5 h-10 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                                {categories.find(c => c._id === selectedCategory)?.name}
                                            </h2>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {getDisplayedBlogs().length} bài viết
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Blog Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {getDisplayedBlogs().map((blog) => (
                                        <Link
                                            key={blog._id}
                                            href={`/news/${blog.slug}`}
                                            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100"
                                        >
                                            <div className="relative h-36 overflow-hidden">
                                                <img
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                {blog.category && typeof blog.category === 'object' && (
                                                    <div className="absolute top-2 left-2">
                                                        <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-cyan-600 rounded-full text-[10px] font-semibold">
                                                            {blog.category.name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-800 group-hover:text-cyan-600 transition-colors line-clamp-2 mb-2 text-base">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                                    {blog.description}
                                                </p>
                                                <div className="flex items-center justify-between text-[10px] text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(blog.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {blog.views}
                                                        </span>
                                                    </div>
                                                    <span className="flex items-center gap-1 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Đọc tiếp <ArrowRight className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Empty state */}
                                {getDisplayedBlogs().length === 0 && (
                                    <div className="text-center py-20">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Folder className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có bài viết nào</h3>
                                        <p className="text-gray-500">Danh mục này chưa có bài viết</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
export default NewPage;
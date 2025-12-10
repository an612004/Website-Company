'use client';
import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Calendar, Eye, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Check } from "lucide-react";

interface BlogCategory {
    _id: string;
    name: string;
    slug: string;
}

interface Blog {
    _id: string;
    title: string;
    slug: string;
    thumbnail: string;
    description: string;
    content: string;
    category: BlogCategory;
    author: string;
    views: number;
    createdAt: string;
    tags: string[];
}

function BlogDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Fetch blog detail
    const fetchBlog = useCallback(async () => {
        if (!slug) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/blogs/${slug}`);
            const data = await response.json();
            if (data.success) {
                setBlog(data.data);

                // Fetch related blogs
                if (data.data.category) {
                    const catId = typeof data.data.category === 'object' ? data.data.category._id : data.data.category;
                    const relatedRes = await fetch(`/api/blogs?category=${catId}&isPublished=true&limit=4`);
                    const relatedData = await relatedRes.json();
                    if (relatedData.success) {
                        setRelatedBlogs(relatedData.data.filter((b: Blog) => b._id !== data.data._id).slice(0, 3));
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // Copy link
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Share functions
    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog?.title || '')}`, '_blank');
    };

    const shareOnLinkedin = () => {
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog?.title || '')}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <Header />
                <div className="flex items-center justify-center py-40">
                    <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
                    <p className="text-gray-500 mb-8">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại trang tin tức
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            {/* Hero Banner */}
            <div className="relative w-full h-[300px] md:h-[450px]">
                <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Category badge */}
                        {blog.category && typeof blog.category === 'object' && (
                            <Link
                                href={`/news?category=${blog.category._id}`}
                                className="inline-block px-4 py-1.5 bg-cyan-500 text-white rounded-full text-sm font-semibold mb-4 hover:bg-cyan-600 transition-colors"
                            >
                                {blog.category.name}
                            </Link>
                        )}
                        
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                            {blog.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(blog.createdAt)}
                            </span>
                            <span className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {blog.views} lượt xem
                            </span>
                            <span>Tác giả: {blog.author}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Back button */}
                <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại trang tin tức
                </Link>

                {/* Description */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-r-xl mb-8">
                    <p className="text-gray-700 text-lg leading-relaxed italic">
                        {blog.description}
                    </p>
                </div>

                {/* Main content */}
                <article 
                    className="prose prose-lg max-w-none
                        prose-headings:text-gray-800 prose-headings:font-bold
                        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                        prose-p:text-gray-600 prose-p:leading-relaxed
                        prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-blockquote:border-l-cyan-500 prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-gray-900 prose-pre:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-2 text-gray-500 font-medium">
                                <Tag className="w-4 h-4" />
                                Tags:
                            </span>
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-cyan-100 hover:text-cyan-700 transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Share */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <span className="flex items-center gap-2 text-gray-500 font-medium">
                            <Share2 className="w-4 h-4" />
                            Chia sẻ bài viết:
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={shareOnFacebook}
                                className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </button>
                            <button
                                onClick={shareOnTwitter}
                                className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </button>
                            <button
                                onClick={shareOnLinkedin}
                                className="w-10 h-10 flex items-center justify-center bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                                    copied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Đã copy" : "Copy link"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related posts */}
            {relatedBlogs.length > 0 && (
                <div className="bg-gray-50 py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                            Bài viết liên quan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((relatedBlog) => (
                                <Link
                                    key={relatedBlog._id}
                                    href={`/news/${relatedBlog.slug}`}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={relatedBlog.thumbnail}
                                            alt={relatedBlog.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 group-hover:text-cyan-600 line-clamp-2 transition-colors">
                                            {relatedBlog.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{relatedBlog.description}</p>
                                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(relatedBlog.createdAt)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default BlogDetailPage;

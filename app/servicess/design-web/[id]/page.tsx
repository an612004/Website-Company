import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import WebProduct from "@/lib/models/webProduct";
import { Types } from "mongoose";
import Header from "@/app/components/layout/Header";
import Link from "next/link";
import BuyNow from "@/app/components/ui/design-web/BuyNow";
import WebCategory from "@/lib/models/webCategory";
import RelatedGrid from "@/app/components/ui/design-web/RelatedGrid";

interface ProductDetailProps {
    params: Promise<{ id: string }>;
}

interface ProductDTO {
    _id: string;
    name: string;
    image?: string;
    description?: string;
    originalPrice?: number;
    originalPriceFormatted?: string;
    sellingPrice?: number;
    sellingPriceFormatted?: string;
    isDiscount?: boolean;
    category?: { _id?: string; name?: string } | string;
    type?: { _id?: string; name?: string } | string;
    link?: string;
    createdAt?: string;
}

async function getProductById(id: string): Promise<ProductDTO | null> {
    await connectDB();
    console.log("params.id:", id, "isValid:", Types.ObjectId.isValid(id));
    if (!Types.ObjectId.isValid(id)) return null;
    console.log("Tìm sản phẩm với id:", id);
    const product = (await WebProduct.findById(id).lean()) as ProductDTO | null;
    console.log("Kết quả truy vấn:", product);
    if (!product) return null;
    // Normalize nested refs (category/type) and convert _id/createdAt to plain strings
    type RefInput = unknown;
    const normalizeRef = (ref: RefInput) => {
        if (!ref) return undefined;
        if (typeof ref === 'string') return ref;
        if (typeof ref === 'object' && ref !== null) {
            const r = ref as { _id?: unknown; name?: unknown };
            if (r._id !== undefined && r._id !== null) {
                const maybeId = r._id as unknown;
                let idStr: string;
                if (typeof maybeId === 'string') idStr = maybeId;
                else if (maybeId && typeof (maybeId as { toString?: unknown }).toString === 'function') idStr = (maybeId as { toString: () => string }).toString();
                else idStr = String(maybeId);
                return { _id: idStr, name: typeof r.name === 'string' ? r.name : '' };
            }
            if (ref && typeof (ref as { toString?: unknown }).toString === 'function') return (ref as { toString: () => string }).toString();
        }
        return undefined;
    };

    return {
        ...product,
        _id: product._id.toString(),
        category: normalizeRef(product.category),
        type: normalizeRef(product.type),
        createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : "",
        sellingPriceFormatted: product.sellingPrice ? new Intl.NumberFormat('vi-VN').format(product.sellingPrice) + '₫' : undefined,
        originalPriceFormatted: product.originalPrice ? new Intl.NumberFormat('vi-VN').format(product.originalPrice) + '₫' : undefined,
    };
}

async function getRelatedProducts(currentId: string, categoryId?: string, typeId?: string, limit = 8): Promise<ProductDTO[]> {
    await connectDB();
    const query: Record<string, unknown> = { _id: { $ne: Types.ObjectId.isValid(currentId) ? new Types.ObjectId(currentId) : currentId } };
    const orConditions: Record<string, unknown>[] = [];
    if (categoryId) {
        orConditions.push({ category: Types.ObjectId.isValid(categoryId) ? new Types.ObjectId(categoryId) : categoryId });
    }
    if (typeId) {
        orConditions.push({ type: Types.ObjectId.isValid(typeId) ? new Types.ObjectId(typeId) : typeId });
    }
    if (orConditions.length > 0) (query as Record<string, unknown>)['$or'] = orConditions;

    const products = (await WebProduct.find(query as Record<string, unknown>).sort({ createdAt: -1 }).limit(limit).lean()) as ProductDTO[];
    type RefInput = unknown;
    const normalizeRef = (ref: RefInput) => {
        if (!ref) return undefined;
        if (typeof ref === 'string') return ref;
        if (typeof ref === 'object' && ref !== null) {
            const r = ref as { _id?: unknown; name?: unknown; toString?: () => string };
            if (r._id !== undefined && r._id !== null) {
                let id: string;
                if (typeof r._id === 'string') {
                    id = r._id;
                } else if (r._id && typeof (r._id as { toString?: unknown }).toString === 'function') {
                    id = (r._id as { toString: () => string }).toString();
                } else {
                    id = String(r._id);
                }
                return { _id: id, name: typeof r.name === 'string' ? r.name : '' };
            }
            if (typeof r.toString === 'function') return r.toString();
        }
        return undefined;
    };

    return products.map((p) => ({
        ...p,
        _id: p._id.toString(),
        category: normalizeRef(p.category),
        type: normalizeRef(p.type),
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : "",
        sellingPriceFormatted: p.sellingPrice ? new Intl.NumberFormat('vi-VN').format(p.sellingPrice) + '₫' : undefined,
        originalPriceFormatted: p.originalPrice ? new Intl.NumberFormat('vi-VN').format(p.originalPrice) + '₫' : undefined,
    }));
}

// ... (Các phần import và logic giữ nguyên đến phần return)

export default async function Page({ params }: ProductDetailProps) {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return notFound();

    // Logic lấy category/related... (giữ nguyên của bạn)
    const categoryId = typeof product.category === 'object' && product.category ? product.category._id : product.category;
    const typeId = typeof product.type === 'object' && product.type ? product.type._id : product.type;
    const related = await getRelatedProducts(id, categoryId as string, typeId as string, 8);
    const rawCategories = (await WebCategory.find().sort({ createdAt: -1 }).lean()) as { _id: unknown; name?: string }[];
    const categories = rawCategories.map((c) => ({
        _id: c._id && typeof (c._id as { toString?: unknown }).toString === 'function' ? (c._id as { toString: () => string }).toString() : String(c._id),
        name: c.name || ''
    }));

    const discountPercentage = product.originalPrice && product.sellingPrice
        ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
        : null;

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20">
            <Header />

            {/* Breadcrumbs & Title Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <nav className="flex mb-4 text-sm text-gray-500 gap-2 items-center">
                        <Link href="/" className="hover:text-orange-600 transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <span className="text-orange-500 font-medium">Chi tiết mẫu website</span>
                    </nav>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <h1 className="text-3xl md:text-4xl font-black text-orange-500 tracking-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                {typeof product.category === 'object' ? product.category.name : 'Mẫu Web'}
                            </span>
                            {product.type && (
                                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {typeof product.type === 'object' ? product.type.name : 'Premium'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Cột Trái: Ảnh và Mô tả */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Browser Mockup Frame */}
                        <div className="group relative bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
                            {/* Browser Header Decor */}
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                            </div>
                            <div className="relative aspect-[16/10] w-full overflow-hidden">
                                <Image
                                    src={product.image || '/placeholder-templates.png'}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {product.isDiscount && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1 rounded-full font-bold shadow-lg text-sm">
                                        Tiết kiệm {discountPercentage}%
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-orange-500 rounded-full" />
                                Chi tiết về giao diện
                            </h2>
                            <article className="prose prose-slate max-w-none 
                                prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed
                                prose-li:text-gray-600 prose-img:rounded-xl"
                                dangerouslySetInnerHTML={{ __html: product.description || '' }}
                            />
                        </div>
                    </div>

                    {/* Cột Phải: Giá và Mua hàng (Sticky) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
                                <div className="space-y-1 mb-6">
                                    <span className="text-sm text-orange-400 font-medium">Giá trọn gói:</span>
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl font-black text-orange-600 tracking-tight">
                                            {product.sellingPriceFormatted || 'Liên hệ'}
                                        </div>
                                        {product.originalPriceFormatted && (
                                            <div className="text-lg text-gray-300 line-through decoration-red-400/30">
                                                {product.originalPriceFormatted}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <BuyNow
                                        productName={product.name}
                                        productPrice={product.sellingPrice}
                                        productOriginalPrice={product.originalPrice}
                                    />

                                    {product.link && (
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            className="block w-full text-center py-4 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all"
                                        >
                                            Xem bản Demo thực tế
                                        </a>
                                    )}
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <span>Giao diện chuẩn SEO & Mobile Ready</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                        </div>
                                        <span>Tốc độ tải trang siêu nhanh</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <span>Nhận ngay website chỉ sau 5 ngày bắt đầu dự án</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Section */}
                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Mẫu website liên quan khác
                        </h2>
                        <div className="h-1 w-20 bg-orange-500 mx-auto mt-4 rounded-full" /> {/* Thanh nhấn màu cam nhỏ bên dưới */}
                    </div>

                    <RelatedGrid initialProducts={related} categories={categories} />
                </div>
            </main>
        </div>
    );
}
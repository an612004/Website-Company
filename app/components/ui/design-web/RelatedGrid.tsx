"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Eye, ExternalLink, LayoutGrid } from "lucide-react";

interface ProductDTO {
    _id: string;
    name: string;
    image?: string;
    sellingPrice?: number;
    sellingPriceFormatted?: string;
    category?: { _id?: string; name?: string } | string;
    link?: string;
}

interface Category {
    _id: string;
    name: string;
}

interface Props {
    initialProducts: ProductDTO[];
    categories: Category[];
}

export default function RelatedGrid({ initialProducts, categories }: Props) {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("");

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return initialProducts.filter((p) => {
            if (cat) {
                let pid: string | undefined;
                if (typeof p.category === "object" && p.category !== null) {
                    pid = (p.category as { _id?: string })._id;
                } else {
                    pid = p.category as string | undefined;
                }
                if (pid !== cat) return false;
            }
            if (!term) return true;
            return p.name.toLowerCase().includes(term);
        });
    }, [initialProducts, search, cat]);

    return (
        <div className="space-y-10">
            {/* --- PHẦN THANH SEARCH HỢP NHẤT (THEO ẢNH MẪU) --- */}
            <div className="max-w-4xl mx-auto">
                <div className="relative flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-2xl md:rounded-full p-1.5 shadow-xl shadow-gray-100 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/5 transition-all">

                    {/* Ô nhập liệu */}
                    <div className="flex-1 flex items-center px-4 w-full gap-3">
                        <Search size={20} className="text-orange-500 shrink-0" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full py-3 text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
                            placeholder="Tìm mẫu website theo từ khoá..."
                        />
                    </div>

                    {/* Đường kẻ dọc phân cách (Ẩn trên mobile) */}
                    <div className="hidden md:block w-[1px] h-8 bg-gray-200"></div>

                    {/* Bộ lọc Ngành hàng */}
                    <div className="relative flex items-center px-4 w-full md:w-auto min-w-[180px]">
                        <select
                            value={cat}
                            onChange={(e) => setCat(e.target.value)}
                            className="w-full py-3 bg-transparent text-sm font-semibold text-gray-600 outline-none cursor-pointer appearance-none"
                        >
                            <option value="">Tất cả ngành</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="text-gray-400 absolute right-4 pointer-events-none" />
                    </div>

                    {/* Nút Tìm kiếm */}
                    <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 transition-all">
                        <Search size={18} />
                        <span>Tìm kiếm mẫu</span>
                    </button>
                </div>
            </div>

            {/* --- PHẦN GRID SẢN PHẨM --- */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100"
                        >
                            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4 text-gray-300">
                                <Search size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">Không tìm thấy mẫu website nào phù hợp.</p>
                            <button
                                onClick={() => { setSearch(""); setCat("") }}
                                className="mt-2 text-orange-500 font-bold hover:underline"
                            >
                                Xóa tất cả bộ lọc
                            </button>
                        </motion.div>
                    ) : (
                        filtered.map((rp) => (
                            <motion.div
                                key={rp._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden"
                            >
                                {/* Image Wrap */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                    <Image
                                        src={rp.image || "/placeholder-templates.png"}
                                        alt={rp.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay khi hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                        <Link
                                            href={`/servicess/design-web/${rp._id}`}
                                            className="p-3 bg-white rounded-full text-gray-900 hover:bg-orange-500 hover:text-white transition-colors"
                                        >
                                            <Eye size={20} />
                                        </Link>
                                        {rp.link && (
                                            <a
                                                href={rp.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-3 bg-white rounded-full text-gray-900 hover:bg-blue-500 hover:text-white transition-colors"
                                            >
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                            {typeof rp.category === "object" ? rp.category.name : "Website"}
                                        </span>
                                        <h3 className="mt-2 text-gray-900 font-bold text-lg leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
                                            {rp.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-orange-400 font-medium uppercase">Giá trọn gói</span>
                                            <span className="text-orange-500 font-black text-lg">
                                                {rp.sellingPriceFormatted || (rp.sellingPrice ? rp.sellingPrice.toLocaleString() + "₫" : "Liên hệ")}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/servicess/design-web/${rp._id}`}
                                            className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-gray-200"
                                        >
                                            CHI TIẾT
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
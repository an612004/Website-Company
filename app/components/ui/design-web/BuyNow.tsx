"use client";
import React, { useState, useEffect } from "react";
import BuyWebForm from "@/app/components/ui/design-web/BuyWebForm";
import { motion, AnimatePresence } from "framer-motion"; // Cài đặt: npm install framer-motion
import { X, ShoppingCart } from "lucide-react"; // Cài đặt: npm install lucide-react

interface Props {
    productName: string;
    productPrice?: number;
    productOriginalPrice?: number;
}

export default function BuyNow({ productName, productPrice, productOriginalPrice }: Props) {
    const [open, setOpen] = useState(false);

    // Chống cuộn trang khi mở modal
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [open]);

    return (
        <>
            {/* Nút Mua Ngay với hiệu ứng Pulse nhẹ */}
            <div className="flex flex-wrap items-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(true)}
                    className="relative group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold shadow-[0_10px_20px_-10px_rgba(234,88,12,0.5)] hover:shadow-[0_20px_30px_-10px_rgba(234,88,12,0.5)] transition-all duration-300"
                >
                    <ShoppingCart size={20} />
                    <span>MUA NGAY</span>
                    <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
            </div>

            {/* Modal sử dụng AnimatePresence để có hiệu ứng Fade Out */}
            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Overlay background mờ */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Nội dung Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-white/20"
                        >
                            {/* Header của Modal */}
                            <div className="relative h-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-800 px-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                                        Xác nhận đơn hàng
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[250px]">
                                        {productName}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 bg-white dark:bg-slate-700 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Body */}
                            <div className="p-6 max-h-[80vh] overflow-y-auto">
                                <BuyWebForm
                                    productName={productName}
                                    productPrice={productPrice}
                                    productOriginalPrice={productOriginalPrice}
                                />
                            </div>

                            {/* Footer trang trí (Tùy chọn) */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                                    Thanh toán an toàn & bảo mật
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
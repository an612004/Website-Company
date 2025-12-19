"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
    _id: string;
    question: string;
    answer: string;
}

export default function FAQs() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [openId, setOpenId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFaqs = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/admin/faq");
                const data = await res.json();
                setFaqs(data.faqs || []);
            } catch (error) {
                console.error("Lỗi khi tải FAQ:", error);
            }
            setLoading(false);
        };
        fetchFaqs();
    }, []);

    const toggle = (id: string) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-16">
                    <h2 className="mt-3 text-4xl font-extrabold text-gray-900 sm:text-5xl drop-shadow-md">Câu hỏi thường gặp</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Giải đáp những câu hỏi phổ biến nhất của bạn một cách nhanh chóng.</p>
                </header>

                {loading ? (
                    <div className="text-center text-gray-500 py-12">
                        <div className="w-10 h-10 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-3"></div>
                        Đang tải dữ liệu...
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-2xl shadow-xl">Không tìm thấy câu hỏi nào.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {faqs.map((faq) => (
                            <div
                                key={faq._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
                            >
                                <button
                                    className={`w-full flex items-center justify-between p-6 text-left transition duration-300 rounded-2xl ${openId === faq._id
                                        ? "bg-green-50 text-green-800 shadow-inner"
                                        : "text-gray-900 hover:bg-gray-50"
                                        }`}
                                    onClick={() => toggle(faq._id)}
                                >
                                    <span className="text-lg font-semibold pr-4 leading-relaxed">{faq.question}</span>
                                    {openId === faq._id ? (
                                        <ChevronUp className="w-6 h-6 text-green-600" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-400" />
                                    )}
                                </button>

                                <AnimatePresence initial={false}>
                                    {openId === faq._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.35 }}
                                            className="px-6 pb-6 border-t border-green-100"
                                        >
                                            <p className="text-gray-700 mt-4 leading-relaxed text-[15px]">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

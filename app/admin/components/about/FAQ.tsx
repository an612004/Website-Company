"use client";
import React, { useState } from "react";

type FAQItem = {
    id: number;
    question: string;
    answer: string;
};

const FAQ = () => {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [openId, setOpenId] = useState<number | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Mỗi trang 5 item

    const totalPages = Math.ceil(faqs.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentFaqs = faqs.slice(startIndex, startIndex + pageSize);

    const handleAdd = () => {
        if (!question.trim() || !answer.trim()) return;

        const newItem: FAQItem = {
            id: Date.now(),
            question,
            answer,
        };

        setFaqs([...faqs, newItem]);
        setQuestion("");
        setAnswer("");

        // Nếu thêm vào trang mới thì cập nhật trang
        if (faqs.length % pageSize === 0) {
            setCurrentPage(totalPages + 1);
        }
    };

    const toggleOpen = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-green-700">
                Quản lý FAQ (Câu hỏi & Trả lời)
            </h2>

            {/* FORM THÊM */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block font-medium mb-1">Câu hỏi</label>
                    <input
                        className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Nhập câu hỏi..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Câu trả lời</label>
                    <textarea
                        className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none h-28"
                        placeholder="Nhập câu trả lời..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleAdd}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    Thêm FAQ
                </button>
            </div>

            <hr className="my-6" />

            {/* DANH SÁCH FAQ */}
            <div className="space-y-4 min-h-[300px]">
                {currentFaqs.length === 0 && (
                    <p className="text-gray-500">Chưa có câu hỏi nào!</p>
                )}

                {currentFaqs.map((item) => (
                    <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl p-4"
                    >
                        <button
                            className="flex justify-between items-center w-full text-left text-lg font-semibold"
                            onClick={() => toggleOpen(item.id)}
                        >
                            {item.question}
                            <span className="text-green-600 font-bold">
                                {openId === item.id ? "-" : "+"}
                            </span>
                        </button>

                        {openId === item.id && (
                            <p className="mt-2 text-gray-600">{item.answer}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* PHÂN TRANG */}
            {faqs.length > pageSize && (
                <div className="mt-6 flex items-center justify-between">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className={`px-4 py-2 rounded-lg border ${currentPage === 1
                            ? "text-gray-400 border-gray-200"
                            : "text-green-700 border-green-500 hover:bg-green-50"
                            }`}
                    >
                        ← Trang trước
                    </button>

                    <p className="text-gray-600 font-medium">
                        Trang {currentPage}/{totalPages}
                    </p>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className={`px-4 py-2 rounded-lg border ${currentPage === totalPages
                            ? "text-gray-400 border-gray-200"
                            : "text-green-700 border-green-500 hover:bg-green-50"
                            }`}
                    >
                        Trang sau →
                    </button>
                </div>
            )}
        </section>
    );
};

export default FAQ;

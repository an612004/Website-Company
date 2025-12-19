import { useState, useEffect } from 'react';

interface FAQ {
    _id?: string;
    question: string;
    answer: string;
    createdAt?: string;
}

export default function FAQComponent() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editQuestion, setEditQuestion] = useState('');
    const [editAnswer, setEditAnswer] = useState('');
    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.error) setError(data.error);
            else fetchFaqs();
        } catch {
            setError('Lỗi khi xóa FAQ');
        }
        setLoading(false);
    };

    const startEdit = (faq: FAQ) => {
        setEditId(faq._id || null);
        setEditQuestion(faq.question);
        setEditAnswer(faq.answer);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditQuestion('');
        setEditAnswer('');
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/faq/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: editQuestion, answer: editAnswer })
            });
            const data = await res.json();
            if (data.error) setError(data.error);
            else {
                cancelEdit();
                fetchFaqs();
            }
        } catch {
            setError('Lỗi khi sửa FAQ');
        }
        setLoading(false);
    };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/faq');
            const data = await res.json();
            setFaqs(data.faqs || []);
        } catch {
            setError('Không thể tải danh sách FAQ');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!question.trim() || !answer.trim()) {
            setError('Vui lòng nhập đầy đủ câu hỏi và câu trả lời');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/admin/faq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, answer })
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setQuestion('');
                setAnswer('');
                fetchFaqs();
            }
        } catch {
            setError('Lỗi khi gửi dữ liệu');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Quản lý FAQ</h2>
            <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
                <div className="mb-3">
                    <label className="block font-semibold mb-1">Câu hỏi</label>
                    <input
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Nhập câu hỏi..."
                    />
                </div>
                <div className="mb-3">
                    <label className="block font-semibold mb-1">Câu trả lời</label>
                    <textarea
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Nhập câu trả lời..."
                        rows={3}
                    />
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-semibold" disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Thêm FAQ'}
                </button>
            </form>
            <h3 className="text-lg font-bold mb-2">Danh sách câu hỏi thường gặp</h3>
            {loading && faqs.length === 0 ? (
                <div>Đang tải...</div>
            ) : faqs.length === 0 ? (
                <div>Chưa có câu hỏi nào.</div>
            ) : (
                <ul className="space-y-4">
                    {faqs.map(faq => (
                        <li key={faq._id} className="bg-gray-50 p-3 rounded shadow">
                            {editId === faq._id ? (
                                <form onSubmit={handleEdit} className="mb-2">
                                    <input
                                        type="text"
                                        value={editQuestion}
                                        onChange={e => setEditQuestion(e.target.value)}
                                        className="w-full border rounded px-2 py-1 mb-2"
                                    />
                                    <textarea
                                        value={editAnswer}
                                        onChange={e => setEditAnswer(e.target.value)}
                                        className="w-full border rounded px-2 py-1 mb-2"
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Lưu</button>
                                        <button type="button" onClick={cancelEdit} className="px-3 py-1 bg-gray-300 rounded">Hủy</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="font-semibold text-gray-800">Q: {faq.question}</div>
                                    <div className="text-gray-700 mt-1">A: {faq.answer}</div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => startEdit(faq)} className="px-3 py-1 bg-yellow-400 text-white rounded">Sửa</button>
                                        <button onClick={() => handleDelete(faq._id!)} className="px-3 py-1 bg-red-500 text-white rounded">Xóa</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

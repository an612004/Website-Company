import Link from "next/link";
import { Settings } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-sky-200 shadow-md p-4 flex flex-col gap-2">
            <nav className="flex flex-col gap-2">
                <Link href="/admin/giao-dien" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium">
                    <span className="inline-block w-5 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    </span>
                    Quản lý giao diện
                </Link>
                <Link href="/admin/nguoi-dung" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium">
                    <span className="inline-block w-5 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A4 4 0 017 16h10a4 4 0 011.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    Người dùng
                </Link>
                <Link href="/admin/tin-tuc" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium">
                    <span className="inline-block w-5 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 3v4M7 3v4" /></svg>
                    </span>
                    Tin tức
                </Link>
                <Link href="/admin/lien-he" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium">
                    <span className="inline-block w-5 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10h.01M15 10h.01" /></svg>
                    </span>
                    Liên hệ
                </Link>
                <Link href="/admin/cai-dat" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Cài đặt
                </Link>
            </nav>
        </aside>
    );
}



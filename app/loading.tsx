"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 5000); // 5 seconds
        return () => clearTimeout(timer);
    }, []);

    if (showLoader) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                    <span className="text-xl font-semibold text-gray-700">Đang tải trang...</span>
                </div>
            </div>
        );
    }
    // After loading, render nothing (or you can redirect, or show main content)
    return null;
}

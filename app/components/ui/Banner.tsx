"use client";
import { useEffect, useState } from "react";

const images = [
    "/banner.png",
    "/banner.png",
    "/banner3.jpg"
];

export default function Banner() {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(i => (i + 1) % images.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);
    // Animated orange text
    const orangeWords = ["Công Việc", "Học Tập", "Hệ Thống", "Mở Rộng", "Phát Triển"]; // you can change these
    const [orangeIndex, setOrangeIndex] = useState(0);
    const [typed, setTyped] = useState("");
    useEffect(() => {
        const word = orangeWords[orangeIndex];
        let charIndex = 0;
        setTyped("");
        const typeInterval = setInterval(() => {
            setTyped((prev) => word.slice(0, charIndex));
            charIndex++;
            if (charIndex > word.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    setOrangeIndex(i => (i + 1) % orangeWords.length);
                }, 800);
            }
        }, 80);
        return () => clearInterval(typeInterval);
    }, [orangeIndex]);

    return (
        <div className="relative w-full h-80 md:h-[530px] overflow-hidden flex items-center justify-center">
            {images.map((src, i) => (
                <img
                    key={src + i}
                    src={src}
                    alt={`Banner ${i + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                />
            ))}
            {/* Headline and buttons */}
            <div className="relative z-20 w-full flex flex-col items-center justify-center">
                <div className="mt-8 mb-6 flex flex-col items-center">
                    <div className="bg-white/80 rounded-full px-6 py-2 mb-4 shadow text-base font-medium flex items-center gap-2">
                        <span role="img" aria-label="rocket">🚀</span>
                        Xem Thử Các Sản Phẩm.
                        <a href="#" className="text-blue-600 font-semibold underline ml-2">Tại Đây!</a>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-purple-800 text-center mb-2 drop-shadow-lg">
                        Sản Phẩm Hiện Đại<br />
                        <span className="text-orange-500 transition-all duration-500 animate-fadeIn" style={{ minHeight: 56 }}>
                            Ứng Dụng Trong {typed}
                            <span className="animate-blink">|</span>
                        </span>
                    </h1>
                    <div className="flex gap-4 mt-4">
                        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-all duration-300">Gọi Ngay !</button>
                        <button className="px-6 py-3 rounded-full bg-white border border-purple-300 text-purple-700 font-bold shadow hover:bg-purple-50 transition-all duration-300">Book Cloud Demo</button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, i) => (
                    <span key={i} className={`w-3 h-3 rounded-full ${i === index ? 'bg-yellow-500' : 'bg-white'} border border-yellow-500 transition-all`}></span>
                ))}
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.7s;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 1s step-end infinite;
                }
            `}</style>
        </div>
    );
}



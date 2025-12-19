// components/StatsCounter.tsx

"use client";
import React from 'react';
// import Image from 'next/image'; // Không cần thiết vì không dùng Image
import { useCountUp } from './hooks/useCountUp'; // Giữ nguyên hook đếm
import { CheckCircle, Users, Zap, Briefcase } from 'lucide-react'; // Sử dụng icon mới, hiện đại hơn
// Có thể đổi tên icon để dễ hình dung hơn, ví dụ: Check -> CheckCircle, ArrowUpRight -> Zap, GitMerge -> Briefcase

// Định nghĩa dữ liệu
interface StatItem {
    id: number;
    value: string; // Chuỗi giá trị cuối cùng (ví dụ: "13.1K+", "983K+")
    label: string;
    icon: React.ReactNode;
    colorClass: string;
    bgColorClass: string; // Thêm màu nền cho icon
}

const statsData: StatItem[] = [
    {
        id: 1,
        value: "4000 +",
        label: "Dự án Đã Hoàn Thành",
        icon: <CheckCircle className="w-6 h-6" />,
        colorClass: "text-blue-600",
        bgColorClass: "bg-blue-100",
    },
    {
        id: 2,
        value: "3,800 +",
        label: "Khách Hàng Hài Lòng",
        icon: <Users className="w-6 h-6" />,
        colorClass: "text-indigo-600",
        bgColorClass: "bg-indigo-100",
    },
    {
        id: 3,
        value: "8 +",
        label: "Năm Kinh Nghiệm",
        icon: <Zap className="w-6 h-6" />,
        colorClass: "text-green-600",
        bgColorClass: "bg-green-100",
    },
    {
        id: 4,
        value: "1000+",
        label: "Sản Phẩm Được Bán",
        icon: <Briefcase className="w-6 h-6" />,
        colorClass: "text-pink-600",
        bgColorClass: "bg-pink-100",
    },
];

// Component hiển thị từng mục thống kê
const StatItemDisplay = ({ stat }: { stat: StatItem }) => {
    const { count, containerRef } = useCountUp(stat.value, 2500); // Tốc độ đếm 2.5 giây

    return (
        // *** THAY ĐỔI LỚN Ở ĐÂY: Mỗi mục là một card độc lập, có hiệu ứng hover ***
        <div
            ref={containerRef}
            className="
                bg-white p-6 md:p-8 rounded-xl border border-gray-200 
                shadow-md hover:shadow-xl transition duration-300 ease-in-out 
                transform hover:-translate-y-1 group
            "
        >
            {/* Vòng tròn Icon */}
            <div
                className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-4 
                    ${stat.bgColorClass} ${stat.colorClass} 
                    transition duration-300 group-hover:scale-105
                `}
            >
                {stat.icon}
            </div>

            {/* Hiển thị số đang đếm (làm cho số nổi bật hơn) */}
            <p className={`
                text-3xl md:text-4xl font-bold mb-2 
                text-gray-900 ${stat.colorClass}
            `}>
                {count}
            </p>

            {/* Label (phụ đề) */}
            <p className="text-base text-gray-500 font-medium">
                {stat.label}
            </p>
        </div>
    );
};

export default function StatsCounter() {
    return (
        <section className="bg-gray-50 py-16 md:py-24"> {/* Đổi màu nền nhẹ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 💡 Tiêu đề lớn, hiện đại và thu hút */}
                <h2 className="text-center text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
                    Thành Tựu <span className="text-orange-400">Nổi Bật</span>
                </h2>
                <p className="text-center text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-16">
                    Hơn 8 năm hoạt động, chúng tôi đã xây dựng lòng tin và đạt được những cột mốc ấn tượng
                </p>

                {/* Container Chính (Không cần border và shadow quá mạnh nếu các card con đã có) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {statsData.map((stat) => (
                        <StatItemDisplay key={stat.id} stat={stat} />
                    ))}
                </div>
            </div>
        </section>
    );
}
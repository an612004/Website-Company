// components/useCountUp.ts (Tùy chọn)

import { useEffect, useState, useRef } from 'react';

// Chuyển đổi chuỗi (ví dụ: "13.1K+") thành số (13100)
const parseValue = (value: string): number => {
    if (value.endsWith('K+')) {
        return parseFloat(value.replace('K+', '')) * 1000;
    }
    return parseFloat(value.replace('+', '')) || 0;
};

// Hook tùy chỉnh để đếm số
export const useCountUp = (endValue: string, duration = 2000, triggerOnce = true) => {
    const [count, setCount] = useState(0);
    const startValue = parseValue(endValue); // Số cuối cùng cần đạt
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const hasCountedRef = useRef(false);

    useEffect(() => {
        // Thiết lập Intersection Observer để phát hiện khi component xuất hiện
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.1 } // Kích hoạt khi 10% component hiển thị
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [triggerOnce]);

    useEffect(() => {
        if (!isVisible || hasCountedRef.current) return;

        let startTime: number | null = null;
        const startCount = 0;
        const endCount = startValue;

        // Hàm animation frame
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Tính toán giá trị hiện tại (sử dụng ease-out để trông mượt hơn)
            const easedPercentage = 1 - Math.pow(1 - percentage, 3); // Cubic ease out
            const currentValue = startCount + easedPercentage * (endCount - startCount);
            
            setCount(currentValue);

            if (percentage < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Đảm bảo số cuối cùng chính xác là startValue
                setCount(startCount + (endCount - startCount)); 
                hasCountedRef.current = true;
            }
        };

        window.requestAnimationFrame(step);
    }, [isVisible, startValue, duration]);

    // Format lại số để hiển thị (ví dụ: 13.1K+)
    const formatCount = () => {
        if (!hasCountedRef.current) {
            return "0"; // Trả về 0 trước khi đếm
        }
        
        // Trả về chuỗi gốc khi đã đếm xong
        return endValue;
    };

    return { count: hasCountedRef.current ? formatCount() : Math.floor(count).toLocaleString(), containerRef };
};
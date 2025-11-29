"use client";
import { useEffect, useRef, useState } from "react";

type UseCountUpReturn = {
    count: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * useCountUp
 * - valueStr: string like "13.1K+", "983K+", "400+", "1200"
 * - duration: animation duration in ms
 * Returns the formatted display string and a ref to attach to the element observed for entering viewport.
 */
export function useCountUp(valueStr: string, duration = 2000): UseCountUpReturn {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [count, setCount] = useState<string>("0");
    const startedRef = useRef(false);

    useEffect(() => {
        // parse the incoming value string
        const m = valueStr.trim().match(/^([\d.,]+)\s*([KMkm]?)(.*)$/);
        if (!m) {
            setCount(valueStr);
            return;
        }

        const rawNum = m[1].replace(/,/g, "");
        const suffixChar = (m[2] || "").toUpperCase();
        const rest = (m[3] || "").trim(); // e.g. '+' or other text

        const decimals = rawNum.includes('.') ? rawNum.split('.')[1].length : 0;
        const baseNum = parseFloat(rawNum) || 0;
        const multiplier = suffixChar === 'K' ? 1000 : suffixChar === 'M' ? 1_000_000 : 1;
        const targetNumber = Math.round(baseNum * multiplier);

        function formatNumber(n: number) {
            if (multiplier > 1) {
                const value = n / multiplier;
                // Keep original decimal places if small, otherwise no decimals
                const fixed = value < 100 ? value.toFixed(decimals || (value % 1 ? 1 : 0)) : Math.round(value).toString();
                return `${fixed}${suffixChar}${rest}`;
            }
            // plain integer formatting with separators
            return `${n.toLocaleString()}${rest}`;
        }

        let raf = 0;
        let startTime = 0;

        function startCount() {
            if (startedRef.current) return;
            startedRef.current = true;
            startTime = performance.now();

            function step(now: number) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress; // ease in-out-ish
                const current = Math.round(eased * targetNumber);
                setCount(formatNumber(current));

                if (progress < 1) {
                    raf = requestAnimationFrame(step);
                } else {
                    // final set to exact target
                    setCount(formatNumber(targetNumber));
                }
            }

            raf = requestAnimationFrame(step);
        }

        const el = containerRef.current;
        if (!el) {
            // if no element attached, start immediately
            startCount();
            return () => { };
        }

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    startCount();
                }
            }
        }, { threshold: 0.25 });

        observer.observe(el);

        return () => {
            observer.disconnect();
            if (raf) cancelAnimationFrame(raf);
        };
    }, [valueStr, duration]);

    return { count, containerRef };
}

export default useCountUp;

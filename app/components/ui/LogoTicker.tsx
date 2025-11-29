"use client";
import React from 'react';
import Image from 'next/image';

// Danh sách các logo đối tác (thêm / chỉnh sửa ở đây)
const logos = [
    { src: '/logo.png', alt: 'RRed' },
    { src: '/logos/edureka.png', alt: 'Edureka!' },
    { src: '/logos/reliance.png', alt: 'Reliance Retail' },
    { src: '/logos/pixis.png', alt: 'Pixis' },
    { src: '/logos/insta-astro.png', alt: 'Insta Astro' },
    { src: '/logos/amazon.png', alt: 'Amazon' },
];

// Nhân đôi để animation lặp mượt
const duplicatedLogos = [...logos, ...logos];

export default function LogoTicker() {
    return (
        <section className="py-12 bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="logo-heading">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight flex items-center">
                            <span className="mr-4 w-1.5 h-8 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 inline-block" aria-hidden="true" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500">Đối tác tin cậy của chúng tôi</span>
                        </h3>
                        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl">Những doanh nghiệp đồng hành cùng <span className="font-semibold text-orange-600">Anbi</span></p>
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                        <span className="text-xs text-slate-400">Hợp tác từ</span>
                        <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium">Trusted</span>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden">
                        {/* gradient masks at sides for soft fade */}
                        <div className="absolute inset-y-0 left-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)' }} />
                        <div className="absolute inset-y-0 right-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)' }} />

                        <div className="py-6">
                            <div className="overflow-hidden">
                                <div className="logo-slide-track flex items-center whitespace-nowrap will-change-transform">
                                    {duplicatedLogos.map((logo, idx) => (
                                        <div
                                            key={idx}
                                            className="logo-item flex-shrink-0 mx-10 md:mx-14 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                                        >
                                            <Image
                                                src={logo.src}
                                                alt={logo.alt}
                                                width={240}
                                                height={96}
                                                className="object-contain h-16 md:h-20"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                :root {
                    --logo-track-duration: 10s; /* slightly faster */
                }

                /* Heading entrance */
                @keyframes fadeInUpSmall {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .logo-heading { animation: fadeInUpSmall 420ms ease forwards; }

                @keyframes slide-logos {
                    0% { transform: translate3d(0,0,0); }
                    100% { transform: translate3d(-50%,0,0); }
                }

                .logo-slide-track {
                    animation: slide-logos var(--logo-track-duration) linear infinite;
                    align-items: center;
                }

                /* Pause on hover/focus for accessibility */
                .logo-slide-track:hover,
                .logo-slide-track:focus-within {
                    animation-play-state: paused;
                }

                /* Respect user preference for reduced motion */
                @media (prefers-reduced-motion: reduce) {
                    .logo-slide-track { animation: none; }
                }

                .logo-item { width: 240px; }

                /* Make sure the track keeps enough width for smooth looping */
                .logo-slide-track > .logo-item { display: inline-flex; }
            `}</style>
        </section>
    );
}
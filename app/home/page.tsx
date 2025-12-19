"use client";

import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import Banner from "../components/ui/Banner";
import Footer from "../components/layout/Footer";
import Slidebarhandle from "../components/ui/Slidebarhandle";
import FeatureSection from "../components/ui/FeatureSection";
import LogoTicker from "../components/ui/LogoTicker";
import StatsCounter from "../components/ui/StatsCounter";
import TestimonialCarousel from "../components/ui/Testimonials";
import SideWebsite from "../components/ui/SideWebsite";
import PriceQuote from "../components/ui/PriceQuote";
import Webcontact from "../components/ui/Webcontact";
import Blogs from "../components/ui/Blogs";

// Cấu hình hiệu ứng mặc định cho các section
const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    },
};

export default function Home() {
    return (
        <>
            <Header />

            {/* Banner thường hiện ngay lập tức nên không cần hiệu ứng cuộn quá mạnh */}
            <Banner />

            <main className="overflow-hidden"> {/* Tránh bị scroll ngang do animation */}

                <SectionWrapper>
                    <div className="mt-4">
                        <FeatureSection />
                    </div>
                </SectionWrapper>

                <SectionWrapper>
                    <Slidebarhandle />
                </SectionWrapper>

                <SectionWrapper>
                    <PriceQuote />
                </SectionWrapper>

                <SectionWrapper>
                    <LogoTicker />
                </SectionWrapper>

                <SectionWrapper>
                    <SideWebsite />
                </SectionWrapper>

                <SectionWrapper>
                    <StatsCounter />
                </SectionWrapper>

                <SectionWrapper>
                    <TestimonialCarousel />
                </SectionWrapper>

                <SectionWrapper>
                    <Webcontact />
                </SectionWrapper>

                <SectionWrapper>
                    <Blogs />
                </SectionWrapper>

            </main>

            <Footer />
        </>
    );
}

/**
 * Component hỗ trợ việc bao bọc các section với hiệu ứng cuộn
 */
function SectionWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} // Hiện khi cách mép màn hình 100px
            variants={revealVariants}
        >
            {children}
        </motion.div>
    );
}
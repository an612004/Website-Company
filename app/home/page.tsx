"use client";
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
export default function Home() {

    return (
        <>
            <Header />
            <Banner />
            {/* Feature section below banner */}
            <div className="mt-4">

                <FeatureSection />
            </div>

            <div>
                <Slidebarhandle />
            </div>
            <div>
                <PriceQuote />
            </div>
            <div>
                <LogoTicker />
            </div>
            <div>
                <SideWebsite />
            </div>

            <div>
                <StatsCounter />
            </div>
            <div>
                <TestimonialCarousel />
            </div>
            <div>
                <Webcontact />
            </div>
            <div>
                <Blogs />
            </div>
            <Footer />

        </>
    );

}
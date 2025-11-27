"use client";
import Header from "../components/layout/Header";
import Banner from "../components/ui/Banner";
import Footer from "../components/layout/Footer";
import Slidebarhandle from "../components/ui/Slidebarhandle";
import FeatureSection from "../components/ui/FeatureSection";
export default function Home() {
    return (
        <>
            <Header />
            <Banner />
            {/* Feature section below banner */}
            <div className="mt-4">
                <div className="text-center text-4xl font-bold">
                    Dịch Vụ chỉ có Tại Anbi
                </div>
                <FeatureSection />
            </div>
            <div>
                <Slidebarhandle />
            </div>
            <Footer />

        </>
    );

}
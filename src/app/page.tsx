import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import BackgroundShift from "@/components/BackgroundShift";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Marquee from "@/components/sections/Marquee";
import Products from "@/components/sections/Products";
import Ingredients from "@/components/sections/Ingredients";
import Instagram from "@/components/sections/Instagram";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Story />
        <Marquee />
        <Products />
        <Ingredients />
        <Instagram />
        <Contact />
      </main>
      <Footer />
      <MobileCTA />
      <div aria-hidden className="grain" />
      {/* mounted last so its triggers are measured after every section has laid out */}
      <BackgroundShift />
    </SmoothScroll>
  );
}

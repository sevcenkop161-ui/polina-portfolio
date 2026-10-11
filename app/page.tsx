import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Works from "@/components/Works";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import Grain from "@/components/Grain";
import SmoothScroll from "@/components/SmoothScroll";

// Страница — просто порядок секций. Хочешь переставить или убрать блок —
// меняй строки здесь.
export default function Home() {
  return (
    <>
      <div className="px-[clamp(12px,3vw,32px)] pb-10 pt-4">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-[18px]">
          <Nav />
          <Hero />
          <Marquee />
          <About />
          <Works />
          <Marquee />
          <Services />
          <Process />
          <Contacts />
          <Footer />
        </div>
      </div>
      <Grain />
      <SmoothScroll />
    </>
  );
}

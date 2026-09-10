import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import BriefingForm from "@/components/BriefingForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Reveal from "@/components/Reveal";

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Reveal><HowItWorks /></Reveal>
      <Reveal divider><Portfolio /></Reveal>
      <Reveal divider><Testimonials /></Reveal>
      <Reveal divider><Pricing /></Reveal>
      <Reveal divider><BriefingForm /></Reveal>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;

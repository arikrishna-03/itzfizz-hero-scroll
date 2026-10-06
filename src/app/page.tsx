import React from "react";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Hero />
      <AboutSection />
      <Footer />
    </div>
  );
}

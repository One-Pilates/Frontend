import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Equipment from './components/Equipment';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Slider from './components/Slider';
import Info from './components/Info';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollReveal from '../../shared/components/ScrollReveal';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      
      <ScrollReveal animation="fade-up">
        <Slider />
      </ScrollReveal>
      
      <ScrollReveal animation="fade-up" delay={0.2}>
        <Services />
      </ScrollReveal>
      
      <ScrollReveal animation="fade-up">
        <About />
      </ScrollReveal>
      
      <ScrollReveal animation="zoom-in">
        <Equipment />
      </ScrollReveal>
      
      <ScrollReveal animation="fade-up">
        <Info />
      </ScrollReveal>
      
      <ScrollReveal animation="fade-up">
        <Testimonials />
      </ScrollReveal>
      
      <ScrollReveal animation="fade-up">
        <FAQ />
      </ScrollReveal>
      
      <ScrollReveal animation="fade-up">
        <Contact />
      </ScrollReveal>
      
      <Footer />
            
      <WhatsAppButton />
    </>
  );
}
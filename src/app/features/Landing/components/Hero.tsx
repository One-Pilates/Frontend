import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Botao from "../../../shared/components/Button";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center p-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[3px] z-[1]" />

      {/* Content Container */}
      <div className="relative z-[2] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="max-w-2xl text-left">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4 sm:mb-5 md:mb-6 leading-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
            Transforme seu corpo, descubra sua melhor versão.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 sm:mb-8 md:mb-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            "Porque seu corpo é único e merece cuidado exclusivo."
          </p>

          {/* Buttons Container */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-wrap">
            {/* CTA Button */}
            <Botao 
              texto="Agende sua aula experimental" 
              cor="bg-main" 
              icone={FaWhatsapp}
              onClick={() =>
                window.open(
                  'https://api.whatsapp.com/send/?phone=551130514139&text=Ol%C3%A1%2C+consegui+o+contato+atrav%C3%A9s+do+site+e+gostaria+de+agendar+uma+aula+experimental.&type=phone_number&app_absent=0', 
                  '_blank'
                )
              }
            />

            {/* WhatsApp Info */}
            <div className="flex items-center gap-3 text-white">
              <div className="flex flex-col leading-tight">
                <span className="text-sm sm:text-base md:text-lg font-bold text-white">
                  +20 anos cuidando de você
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

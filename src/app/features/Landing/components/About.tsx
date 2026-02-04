import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function About() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Content Side */}
          <div className="text-center lg:text-left">
            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-semibold text-[#F77433] mb-2 tracking-wide uppercase">
              +20 ANOS DE HISTÓRIA
            </p>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
              Sobre nossa trajetória...
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
              Somos um Studio de Pilates localizado em São Paulo, com profissionais experientes e
              equipamentos de última geração. Nosso estúdio está situado próximo à Av. Paulista e ao Metrô Paraíso,
              proporcionando fácil acesso e conforto a todos os alunos.
            </p>

            {/* Button */}
            <button className="inline-flex items-center gap-2 bg-[#F77433] text-white border-none py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_10px_rgba(247,116,51,0.3)] hover:bg-[#F77433]/85 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(247,116,51,0.4)] active:translate-y-0">
              <FaPlus className="text-sm" />
              Mais Detalhes
            </button>
          </div>

          {/* Image Side */}
          <div className="flex justify-center relative">
            {/* Glow Effect Behind */}
            <div className="absolute top-1/2 left-1/2 w-[70%] h-[70%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(247,116,51,0.35)_0%,_transparent_70%)] blur-[60px] -z-10" />

            {/* Image */}
            <img
              src="/about.png"
              alt="Studio de Pilates"
              className="w-[80%] max-w-md h-auto rounded-2xl bg-gray-100 shadow-[0_0_25px_rgba(247,116,51,0.25),_0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-400 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(247,116,51,0.4),_0_8px_28px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

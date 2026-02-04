import React from 'react';
import { FaPhoneAlt, FaRegBuilding } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function Info() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          
          {/* Phone Card */}
          <div className="p-6 sm:p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 bg-gradient-to-br from-[#F77433] to-[#FF9461] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(255,112,67,0.25)]">
              <FaPhoneAlt className="text-2xl sm:text-3xl md:text-4xl text-white" />
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              Telefone
            </h3>

            {/* Highlight */}
            <p className="text-base sm:text-lg md:text-xl font-semibold text-[#F77433] mb-3 leading-snug">
              +55 (11) 3051-4139
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 m-0">
              Ligue para nós ou clique no número para falar conosco e marcar sua visita.
            </p>
          </div>

          {/* Email Card */}
          <div className="p-6 sm:p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 bg-gradient-to-br from-[#F77433] to-[#FF9461] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(255,112,67,0.25)]">
              <MdEmail className="text-2xl sm:text-3xl md:text-4xl text-white" />
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              E-mail
            </h3>

            {/* Highlight */}
            <p className="text-base sm:text-lg md:text-xl font-semibold text-[#F77433] mb-3 leading-snug">
              atendimento@onepilates.com.br
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 m-0">
              Ficou com alguma dúvida ou tem alguma sugestão? Envie para nós.
            </p>
          </div>

          {/* Hours Card */}
          <div className="p-6 sm:p-8 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 bg-gradient-to-br from-[#F77433] to-[#FF9461] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(255,112,67,0.25)]">
              <FaRegBuilding className="text-2xl sm:text-3xl md:text-4xl text-white" />
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              Horário de Atendimento
            </h3>

            {/* Highlight */}
            <p className="text-base sm:text-lg md:text-xl font-semibold text-[#F77433] mb-3 leading-snug">
              Nosso horário de atendimento
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 m-0">
              é de Seg. a Qui. das 7h as 22 e Sex das 7h ás 19h
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

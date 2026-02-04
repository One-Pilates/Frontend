import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: 'Preciso de encaminhamento médico para iniciar as sessões?',
      answer: 'Sim! Recomendamos trazer um encaminhamento médico ou avaliação física para garantir a segurança e a melhor experiência nas sessões.'
    },
    {
      question: 'Como agendar uma aula experimental?',
      answer: 'Você pode agendar facilmente pelo nosso site, WhatsApp ou telefone, de acordo com a sua conveniência.'
    },
    {
      question: 'Quais são os tipos de aulas oferecidas pelo One Pilates?',
      answer: 'Oferecemos aulas individuais, em dupla e em grupo, todas adaptadas para todos os níveis, desde iniciantes até avançados.'
    },
    {
      question: 'Quais são os diferenciais do One Pilates em relação a outros estúdios?',
      answer: 'Profissionais altamente qualificados, equipamentos modernos e atendimento totalmente personalizado para você.'
    },
    {
      question: 'Quais são os horários de funcionamento?',
      answer: 'Nosso estúdio funciona de segunda a sexta, das 7h às 20h, e aos sábados, das 8h às 14h.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gray-50 text-center px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 relative">
          Perguntas Frequentes
          <span className="block w-16 sm:w-20 h-1 bg-[#F77433] rounded-sm mx-auto mt-4" />
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-10 sm:mb-12 md:mb-14 max-w-3xl mx-auto leading-relaxed">
          Aqui você encontra as respostas para as dúvidas mais comuns sobre nosso estúdio.
        </p>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`mb-4 sm:mb-5 bg-white rounded-xl overflow-hidden border transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(0,0,0,0.08)] ${
                openIndex === index
                  ? 'border-[#F77433] shadow-[0_8px_22px_rgba(247,116,51,0.25)]'
                  : 'border-[#F77433]/20'
              }`}
            >
              {/* Question Button */}
              <button
                className="w-full p-5 sm:p-6 md:p-7 bg-transparent border-none text-left text-base sm:text-lg md:text-xl font-semibold text-gray-900 cursor-pointer flex justify-between items-center transition-all duration-300 relative group hover:bg-[#F77433]/5"
                onClick={() => toggleFAQ(index)}
              >
                <span className="pr-4">{faq.question}</span>
                
                {/* Icon */}
                <span
                  className={`text-2xl sm:text-3xl font-bold transition-all duration-300 text-[#F77433] flex-shrink-0 ${
                    openIndex === index ? 'rotate-45' : ''
                  }`}
                >
                  {openIndex === index ? '×' : '+'}
                </span>

                {/* Hover underline */}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#F77433] transition-all duration-300 group-hover:w-full" />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  openIndex === index
                    ? 'max-h-[200px] py-4 px-5 sm:px-6 md:px-7 pb-5 sm:pb-6 border-l-4 border-[#F77433] bg-[#F77433]/5'
                    : 'max-h-0 p-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

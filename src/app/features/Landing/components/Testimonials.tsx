import React from 'react';

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  time: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Luciana Cordeiro',
    text: 'O One Pilates é um estúdio maravilhoso, com profissionais muito competentes, o que é fundamental. Atendimento impecável!',
    rating: 5,
    time: 'Editado um ano atrás',
    initials: 'L'
  },
  {
    name: 'Erika Zsoldos',
    text: 'Faço pilates na One Pilates desde 2016 e amo! A equipe é maravilhosa, super capacitadas e atenciosas.',
    rating: 5,
    time: 'Um ano atrás',
    initials: 'E'
  },
  {
    name: 'Vivian Kairalla',
    text: 'Estou há doze anos no One Pilates e a cada dia o estúdio se supera com relação à qualidade da aulas e profissionais.',
    rating: 5,
    time: 'Editado um ano atrás',
    initials: 'V'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-white px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <p className="text-sm text-gray-500 mb-2">
            O que os clientes dizem.
          </p>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Testemunhos
          </h2>
          
          <span className="block text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            "Atribuímos um grande valor a relacionamentos sólidos e vemos os benefícios que eles{' '}
            <br className="hidden sm:block" />
            trazem para o nosso negócio. O feedback do cliente é vital para nos ajudar a acertar."
          </span>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 sm:p-7 md:p-8 rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]"
            >
              {/* Top Section */}
              <div className="flex items-center mb-4 sm:mb-5">
                {/* Avatar */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-lg sm:text-xl mr-3 sm:mr-4 flex-shrink-0">
                  {testimonial.initials}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {testimonial.name}
                  </h4>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {testimonial.time}
                  </span>
                </div>
              </div>

              {/* Stars */}
              <div className="text-yellow-400 text-lg sm:text-xl mb-3 sm:mb-4">
                {'★'.repeat(testimonial.rating)}
              </div>

              {/* Text */}
              <p className="italic text-gray-600 text-sm sm:text-base leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

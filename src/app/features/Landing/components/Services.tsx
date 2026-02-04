import React from 'react';

interface Service {
  icon: string;
  title: string;
}

export default function Services() {
  const services: Service[] = [
    { icon: '/services/1.png', title: 'Acupuntura' },
    { icon: '/services/2.png', title: 'Osteopatia' },
    { icon: '/services/3.png', title: 'RPG (Reeducação Postural Global)' },
    { icon: '/services/4.png', title: 'Microfisioterapia' },
    { icon: '/services/5.png', title: 'Shiatsu' },
    { icon: '/services/6.png', title: 'Drenagem Linfática' },
    { icon: '/services/7.png', title: 'Fisioterapia' },
    { icon: '/services/8.png', title: 'Pilates' }
  ];

  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-10 sm:mb-12 md:mb-14 lg:mb-16 text-gray-900 leading-snug">
          Nossos serviços, pensados para o que <br className="hidden sm:block" />
          você realmente precisa
        </h2>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-x-8 lg:gap-y-12 justify-items-center">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="text-center flex flex-col items-center w-full max-w-[250px] group"
            >
              {/* Icon */}
              <img 
                src={service.icon} 
                alt={service.title}
                className="w-40 sm:w-44 md:w-48 lg:w-52 h-auto mb-3 sm:mb-4 transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              
              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 px-2">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

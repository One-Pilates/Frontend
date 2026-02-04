import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-black/75 backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
        }
        py-4 sm:py-5 md:py-6
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* LOGO */}
          <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
            <img
              src="/logoBranca.png"
              alt="One Pilates"
              className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto object-contain"
            />
          </div>

          {/* MENU DESKTOP */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-10 list-none">
            <li>
              <a
                href="#home"
                className="text-white font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 hover:text-[#F77433] cursor-pointer"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="text-white font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 hover:text-[#F77433] cursor-pointer"
              >
                Serviços
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-white font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 hover:text-[#F77433] cursor-pointer"
              >
                Sobre
              </a>
            </li>
            <li>
              <a
                href="#equipment"
                className="text-white font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 hover:text-[#F77433] cursor-pointer"
              >
                Equipamentos
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="text-white font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 hover:text-[#F77433] cursor-pointer"
              >
                Depoimentos
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-white font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 hover:text-[#F77433] cursor-pointer"
              >
                Contato
              </a>
            </li>
          </ul>

          {/* BOTÃO MENU MOBILE */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none focus:ring-2 focus:ring-[#F77433] rounded-lg p-1 transition-all"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMenuOpen ? (
                <FiX size={28} className="sm:w-8 sm:h-8" />
              ) : (
                <FiMenu size={28} className="sm:w-8 sm:h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div
        className={`
          md:hidden
          absolute top-full left-0 w-full
          bg-black/90 backdrop-blur-xl
          transition-all duration-300 ease-in-out
          ${isMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-5 pointer-events-none'
          }
          shadow-2xl
        `}
      >
        <ul className="flex flex-col items-center list-none py-6 px-4 space-y-4">
          <li className="w-full text-center">
            <a
              href="#home"
              onClick={closeMenu}
              className="block text-white text-lg sm:text-xl font-medium py-3 transition-colors duration-300 hover:text-[#F77433] active:text-[#F77433]"
            >
              Home
            </a>
          </li>
          <li className="w-full text-center">
            <a
              href="#services"
              onClick={closeMenu}
              className="block text-white text-lg sm:text-xl font-medium py-3 transition-colors duration-300 hover:text-[#F77433] active:text-[#F77433]"
            >
              Serviços
            </a>
          </li>
          <li className="w-full text-center">
            <a
              href="#about"
              onClick={closeMenu}
              className="block text-white text-lg sm:text-xl font-medium py-3 transition-colors duration-300 hover:text-[#F77433] active:text-[#F77433]"
            >
              Sobre
            </a>
          </li>
          <li className="w-full text-center">
            <a
              href="#equipment"
              onClick={closeMenu}
              className="block text-white text-lg sm:text-xl font-medium py-3 transition-colors duration-300 hover:text-[#F77433] active:text-[#F77433]"
            >
              Equipamentos
            </a>
          </li>
          <li className="w-full text-center">
            <a
              href="#testimonials"
              onClick={closeMenu}
              className="block text-white text-lg sm:text-xl font-medium py-3 transition-colors duration-300 hover:text-[#F77433] active:text-[#F77433]"
            >
              Depoimentos
            </a>
          </li>
          <li className="w-full text-center">
            <a
              href="#contact"
              onClick={closeMenu}
              className="block text-white text-lg sm:text-xl font-medium py-3 transition-colors duration-300 hover:text-[#F77433] active:text-[#F77433]"
            >
              Contato
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

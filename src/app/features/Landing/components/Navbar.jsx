  import React, { useState, useEffect } from 'react';
  import '../styles/Navbar.scss';
  import { Link } from 'react-router-dom';
  import { FiMenu, FiX } from 'react-icons/fi'; 
  import Botao from "../../../shared/components/Button";

  export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          {/* LOGO */}
          <div className="navbar-logo">
            <img
              src="/logoBranca.png"
              alt="One Pilates"
            />
          </div>

          {/* MENU DESKTOP */}
          <ul className="navbar-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Serviços</a></li>
            <li><a href="#about">Sobre</a></li>
            <li><a href="#equipment">Equipamentos</a></li>
            <li><a href="#testimonials">Depoimentos</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>

          {/* BOTÃO MOBILE */}
          <div className="navbar-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FiX size={28} color="#fff" /> : <FiMenu size={28} color="#fff" />}
          </div>
        </div>

        {/* MENU MOBILE */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#home" onClick={closeMenu}>Home</a></li>
            <li><a href="#services" onClick={closeMenu}>Serviços</a></li>
            <li><a href="#about" onClick={closeMenu}>Sobre</a></li>
            <li><a href="#equipment" onClick={closeMenu}>Equipamentos</a></li>
            <li><a href="#testimonials" onClick={closeMenu}>Depoimentos</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contato</a></li>
          </ul>
        </div>
      </nav>
    );
  }

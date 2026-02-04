import '../styles/Footer.scss';
import { FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">

          <div className="footer-logo">
            <img src="/logoOriginal.png" alt="One Pilates" />
            <h3>One Pilates</h3>
            <span>Porque seu Corpo é Único</span>
            <div className="footer-contact">
              <p><FaMapMarkerAlt /> R. Abílio Soares, 233 - Paraíso, São Paulo - SP</p>
              <p><FaPhoneAlt /> (11) 97215-7232</p>
              <p><FaEnvelope /> contato@onepilates.com.br</p>
            </div>
          </div>

          <div className="footer-links">
            <h4>Navegação</h4>
            <nav>
              <a href="#home">Home</a>
              <a href="#services">Serviços</a>
              <a href="#about">Sobre</a>
              <a href="#equipment">Equipamentos</a>
              <a href="#testimonials">Depoimentos</a>
              <a href="#contact">Contato</a>
            </nav>
          </div>

          <div className="footer-social">
            <h4>Redes Sociais</h4>
            <div className="social-icons">
              <a 
                href="https://www.facebook.com/onepilates31" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://www.instagram.com/one_pilates/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} One Pilates – Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

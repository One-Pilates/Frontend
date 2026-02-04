import "../styles/About.scss";
import { FaPlus } from "react-icons/fa";

export default function About() {
  return (
    <section className="about">
      <div className="about__container">
        
        <div className="about__content">
          <p className="about__subtitle">+20 ANOS DE HISTÓRIA</p>
          <h2 className="about__title">Sobre nossa trajetória...</h2>
          <p className="about__text">
            Somos um Studio de Pilates localizado em São Paulo, com profissionais experientes e
            equipamentos de última geração. Nosso estúdio está situado próximo à Av. Paulista e ao Metrô Paraíso,
            proporcionando fácil acesso e conforto a todos os alunos.
          </p>
          <button className="about__button">
            <FaPlus className="about__icon" /> Mais Detalhes
          </button>
        </div>

        <div className="about__image">
          <img
            src="/about.png"
            alt="Studio de Pilates"
          />
        </div>
      </div>
    </section>
  );
}

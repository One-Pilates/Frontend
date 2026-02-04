import "../styles/Equipment.scss";
import { FaPlus } from "react-icons/fa";

export default function Equipment() {
  return (
    <section className="equipment" id="equipment">
      <div className="equipment__container">
        <div className="equipment__image">
          <img src="/1.jpg" alt="Equipamentos do Studio One Pilates" />
        </div>

        <div className="equipment__content">
          <h2 className="equipment__title">Nossos Equipamentos</h2>
          <p className="equipment__text">
            Na One Pilates, sua saúde e segurança estão em primeiro lugar. 
            Trabalhamos exclusivamente com equipamentos da marca Physio Pilates, 
            referência em qualidade, ergonomia e inovação no mercado.
          </p>

          <button className="equipment__button">
            <FaPlus className="equipment__icon" />
            Mais Detalhes
          </button>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import '../styles/Info.scss';
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";

export default function Info() {
  return (
    <section className="info-section">
      <div className="info-container">
        <div className="info-card">
          <div className="icon-wrapper">
            <FaPhoneAlt className="icon" />
          </div>
          <h3>Telefone</h3>
          <p className="highlight">+55 (11) 3051-4139</p>
          <p className="description">
            Ligue para nós ou clique no número para falar conosco e marcar sua visita.
          </p>
        </div>

        <div className="info-card">
          <div className="icon-wrapper">
            <MdEmail className="icon" />
          </div>
          <h3>E-mail</h3>
          <p className="highlight">atendimento@onepilates.com.br</p>
          <p className="description">
            Ficou com alguma dúvida ou tem alguma sugestão? Envie para nós.
          </p>
        </div>

        <div className="info-card">
          <div className="icon-wrapper">
            <FaRegBuilding className="icon" />
          </div>
          <h3>Horário de Atendimento</h3>
          <p className="highlight">Nosso horário de atendimento</p>
          <p className="description">
            é de Seg. a Qui. das 7h as 22 e Sex das 7h ás 19h
          </p>
        </div>
      </div>
    </section>
  );
}
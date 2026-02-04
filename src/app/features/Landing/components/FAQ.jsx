import React, { useState } from 'react';
import '../styles/FAQ.scss';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <div className="container">
        <h2>Perguntas Frequentes</h2>
        <p className="faq-subtitle">
          Aqui você encontra as respostas para as dúvidas mais comuns sobre nosso estúdio.
        </p>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className={`faq-icon ${openIndex === index ? 'open' : ''}`}>
                  {openIndex === index ? '×' : '+'}
                </span>
              </button>
              <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

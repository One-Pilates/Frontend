import '../styles/Testimonials.scss';

const testimonials = [
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

export default function Testimonials(){
  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <p>O que os clientes dizem.</p>
          <h2>Testemunhos</h2>
          <span className="testimonial-intro">
            "Atribuímos um grande valor a relacionamentos sólidos e vemos os benefícios que eles <br/>trazem para o nosso negócio. O feedback do cliente é vital para nos ajudar a acertar."
          </span>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-top">
                <div className="avatar">{t.initials}</div>
                <div className="testimonial-info">
                  <h4>{t.name}</h4>
                  <span>{t.time}</span>
                </div>
              </div>
              <div className="stars">{'★'.repeat(t.rating)}</div>
              <p>"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


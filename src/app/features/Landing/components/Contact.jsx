import '../styles/Contact.scss';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { FaPaperPlane } from 'react-icons/fa';

export default function Contact() {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const validateForm = (name, email, message) => {
    if (!name || name.trim().length < 2) {
      Swal.fire({
        icon: 'error',
        title: 'Nome inválido',
        text: 'O nome precisa ter pelo menos 2 caracteres.',
        confirmButtonColor: '#ff6b35',
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Por favor, insira um email válido.',
        confirmButtonColor: '#ff6b35',
      });
      return false;
    }
    if (!message || message.trim().length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Mensagem curta',
        text: 'A mensagem precisa ter pelo menos 10 caracteres.',
        confirmButtonColor: '#ff6b35',
      });
      return false;
    }
    return true;
  };

  const confirmAndSend = (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const name = formData.get('user_name');
    const email = formData.get('user_email');
    const message = formData.get('message');

    if (!validateForm(name, email, message)) return;

    Swal.fire({
      title: 'Confirmar envio?',
      text: 'Deseja realmente enviar sua mensagem?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff6b35',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        sendEmail();
      }
    });
  };

  const sendEmail = () => {
    setIsSending(true);

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Enviado!',
            text: 'Sua mensagem foi enviada com sucesso.',
            confirmButtonColor: '#ff6b35',
          });
          form.current.reset();
        },
        (error) => {
          console.error('Erro:', error.text);
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível enviar a mensagem. Tente novamente.',
            confirmButtonColor: '#ff6b35',
          });
        }
      )
      .finally(() => setIsSending(false));
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-content">

          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58527.1334970865!2d-46.676152560448834!3d-23.53445017723577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59971fafccd9%3A0xb26de13ea6e41891!2sOne%20Pilates-%20Studio%20de%20Pilates!5e0!3m2!1spt-BR!2sbr!4v1757821649258!5m2!1spt-BR!2sbr"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <div className="contact-form">
            <h2>Contate-nos</h2>
            <p>R. Abílio Soares, 233 - Paraíso, São Paulo - SP, 04005-001</p>

            <form ref={form} onSubmit={confirmAndSend}>
              <div className="form-group">
                <label htmlFor="user_name">Nome *</label>
                <input type="text" name="user_name" id="user_name" placeholder="Digite seu nome" required />
              </div>
              <div className="form-group">
                <label htmlFor="user_email">Email</label>
                <input type="email" name="user_email" id="user_email" placeholder="Digite seu email" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mensagem *</label>
                <textarea name="message" id="message" placeholder="Digite sua mensagem" required></textarea>
              </div>

              <button type="submit" className="btn-submit" disabled={isSending}>
                <FaPaperPlane className="icon" />
                {isSending ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

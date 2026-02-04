import React, { useRef, useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { FaPaperPlane } from 'react-icons/fa';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const validateForm = (name: string, email: string, message: string): boolean => {
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

  const confirmAndSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    const formData = new FormData(form.current);
    const name = formData.get('user_name') as string;
    const email = formData.get('user_email') as string;
    const message = formData.get('message') as string;

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
    if (!form.current) return;
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
          form.current?.reset();
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
    <section id="contact" className="py-20 sm:py-24 md:py-32 bg-white mb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-stretch">
          
          {/* Map Section */}
          <div className="w-full h-full min-h-[400px] sm:min-h-[450px] lg:min-h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58527.1334970865!2d-46.676152560448834!3d-23.53445017723577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59971fafccd9%3A0xb26de13ea6e41891!2sOne%20Pilates-%20Studio%20de%20Pilates!5e0!3m2!1spt-BR!2sbr!4v1757821649258!5m2!1spt-BR!2sbr"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Form Section */}
          <div className="flex flex-col">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Contate-nos
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              R. Abílio Soares, 233 - Paraíso, São Paulo - SP, 04005-001
            </p>

            <form ref={form} onSubmit={confirmAndSend} className="flex flex-col gap-4 sm:gap-5">
              {/* Name Field */}
              <div className="flex flex-col">
                <label 
                  htmlFor="user_name" 
                  className="font-semibold text-gray-900 mb-2 text-sm sm:text-base"
                >
                  Nome *
                </label>
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  placeholder="Digite seu nome"
                  required
                  className="w-full p-3 sm:p-4 border border-[#F77433] rounded-lg text-sm sm:text-base bg-white text-gray-900 focus:outline-none focus:border-[#F77433] focus:shadow-[0_0_5px_rgba(247,116,51,0.4)] transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <label 
                  htmlFor="user_email" 
                  className="font-semibold text-gray-900 mb-2 text-sm sm:text-base"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  id="user_email"
                  placeholder="Digite seu email"
                  className="w-full p-3 sm:p-4 border border-[#F77433] rounded-lg text-sm sm:text-base bg-white text-gray-900 focus:outline-none focus:border-[#F77433] focus:shadow-[0_0_5px_rgba(247,116,51,0.4)] transition-all"
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col">
                <label 
                  htmlFor="message" 
                  className="font-semibold text-gray-900 mb-2 text-sm sm:text-base"
                >
                  Mensagem *
                </label>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Digite sua mensagem"
                  required
                  className="w-full p-3 sm:p-4 border border-[#F77433] rounded-lg text-sm sm:text-base bg-white text-gray-900 min-h-[120px] resize-y focus:outline-none focus:border-[#F77433] focus:shadow-[0_0_5px_rgba(247,116,51,0.4)] transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className="self-start inline-flex items-center justify-center gap-2 sm:gap-3 bg-[#F77433] text-white border-none py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_10px_rgba(247,116,51,0.3)] hover:bg-[#F77433]/85 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(247,116,51,0.4)] active:translate-y-0 active:shadow-[0_3px_8px_rgba(247,116,51,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0"
              >
                <FaPaperPlane className="text-sm sm:text-base" />
                {isSending ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

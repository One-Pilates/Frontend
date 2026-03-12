import { useState } from 'react';
import './CodigoVerificacao.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IoArrowBack } from 'react-icons/io5';
import api from '../../services/api';
import BackgroundLogin from '../../components/BackgroundLogin';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEnviar = async (e) => {
    e?.preventDefault();
    if (!email) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    const loadingId = toast.loading('Enviando código de verificação...');

    try {
      const response = await api.post('auth/criarCodigoVerificacao', { email });
      console.log('Email enviado para:', email);
      console.log('Resposta do servidor:', response.data);

      toast.success('Código enviado! Verifique seu e-mail.', { id: loadingId });
      navigate('/codigo-verificacao', { state: { email } });
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
      toast.error('Não foi possível enviar o código. Tente novamente.', { id: loadingId });
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <button onClick={() => navigate(-1)} className="botao-voltar">
          <IoArrowBack size={18} /> Voltar
        </button>

        <div className="login__header">
          <h1 className="login__title">Esqueci minha senha</h1>
          <p className="login__subtitle">Informe seu e-mail para recuperar o acesso.</p>
        </div>

        <form className="login__form" onSubmit={handleEnviar}>
          <div className="login__field">
            <label htmlFor="email" className="login__label">
              Email
            </label>
            <input
              placeholder="onepilates@onepilates.com"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login__input"
              required
            />
          </div>
          <button type="submit" className="login__button">
            Enviar
          </button>
        </form>

        <p className="login__contact">
          Precisa de acesso? <span>Contate o administrador</span>
        </p>
      </div>

      <BackgroundLogin />

      <p className="login__terms">
        Ao continuar, você concorda com nossos <span>Termos de Uso</span> e{' '}
        <span>Política de Privacidade</span>.
      </p>
    </div>
  );
}

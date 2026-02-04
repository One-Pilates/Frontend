import { FaArrowLeft } from "react-icons/fa";
import StepIndicator from "./components/StepIndicator";
import Button from "./components/Button";
import DadosPessoaisScreen from "./screens/DadosPessoais";
import EnderecoScreen from "./screens/Endereco";
import InformacoesProfissionaisScreen from "./screens/InformacoesProfissionais";
import ConfirmacaoScreen from "./screens/Confirmacao";
import './style.scss';
import { useNavigate } from "react-router-dom";

const RegisterTeacherView = ({
  etapaAtual,
  etapas,
  dadosPessoais,
  endereco,
  informacoesProfissionais,
  especialidades,
  cadastrando,
  erros,
  setDadosPessoais,
  setEndereco,
  setInformacoesProfissionais,
  buscarCep,
  proximaEtapa,
  etapaAnterior,
  voltarEtapa,
  irParaEtapa,
  cadastrarProfessor,
  cancelarCadastro,
}) => {
  const navigate = useNavigate();

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <DadosPessoaisScreen
            dados={dadosPessoais}
            atualizar={(novos) => setDadosPessoais(prev => ({ ...prev, ...novos }))}
            erros={erros}
          />
        );
      case 2:
        return (
          <EnderecoScreen
            dados={endereco}
            atualizar={(novos) => setEndereco(prev => ({ ...prev, ...novos }))}
            buscarCep={buscarCep}
            erros={erros}
          />
        );
      case 3:
        return (
          <InformacoesProfissionaisScreen
            dados={informacoesProfissionais}
            atualizar={(novos) => setInformacoesProfissionais(prev => ({ ...prev, ...novos }))}
            especialidades={especialidades}
            erros={erros}
          />
        );
      case 4:
        return (
          <ConfirmacaoScreen
            dadosPessoais={dadosPessoais}
            endereco={endereco}
            informacoesProfissionais={informacoesProfissionais}
            especialidades={especialidades}
            cadastrando={cadastrando}
            onCadastrar={cadastrarProfessor}
            onVoltar={voltarEtapa}
            onCancelar={cancelarCadastro}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <button className="back-button" onClick={() => navigate("/secretaria/professor")}>
          <FaArrowLeft />
          <span>Voltar</span>
        </button>
        <h1 className="main-title">Preencha os dados para criar a conta</h1>
      </div>

      <div className="register-content">
        <div className="register-card">
          <StepIndicator
            steps={etapas}
            currentStep={etapaAtual}
            onStepClick={irParaEtapa}
          />

          <form className="register-form" onSubmit={(e) => e.preventDefault()}>
            {renderEtapa()}

            {etapaAtual < 4 && (
              <div className="button-group">
                {etapaAtual > 1 && (
                  <Button variant="secondary" onClick={etapaAnterior}>
                    Voltar
                  </Button>
                )}
                <Button variant="primary" onClick={proximaEtapa}>
                  {etapaAtual === 3 ? "Revisar" : "Continuar"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterTeacherView;
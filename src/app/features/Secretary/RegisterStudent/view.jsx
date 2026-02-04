import { FaArrowLeft } from "react-icons/fa";
import StepIndicator from "./components/StepIndicator";
import Button from "./components/Button";
import DadosPessoaisScreen from "./screens/DadosPessoais";
import EnderecoScreen from "./screens/Endereco";
import InformacoesAlunoScreen from "./screens/InformacoesAlunos";
import ConfirmacaoAlunoScreen from "./screens/Confirmacao";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const RegisterStudentView = ({
  etapaAtual,
  etapas,
  dadosPessoais,
  endereco,
  informacoesAluno,
  erros,
  atualizarDadosPessoais,
  atualizarEndereco,
  atualizarInformacoesAluno,
  buscarCep,
  proximaEtapa,
  etapaAnterior,
  irParaEtapa,
  finalizar,
  concluir,
  voltar,
  cadastrarAluno,
  cancelarCadastro,
}) => {
  const navigate = useNavigate();

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <DadosPessoaisScreen
            dados={dadosPessoais}
            atualizar={atualizarDadosPessoais}
            erros={erros}
          />
        );
      case 2:
        return (
          <EnderecoScreen
            dados={endereco}
            atualizar={atualizarEndereco}
            buscarCep={buscarCep}
            erros={erros}
          />
        );
      case 3:
        return (
          <InformacoesAlunoScreen
            dados={informacoesAluno}
            atualizar={atualizarInformacoesAluno}
            erros={erros}
          />
        );
      case 4:
        return (
          <ConfirmacaoAlunoScreen
            dadosPessoais={dadosPessoais}
            endereco={endereco}
            informacoesAluno={informacoesAluno}
            onVoltar={etapaAnterior}
            onCancelar={cancelarCadastro}
            onCadastrar={cadastrarAluno}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <button
          className="back-button"
          onClick={() => navigate("/secretaria/alunos")}
        >
          <FaArrowLeft />
          <span>Voltar</span>
        </button>
        <h1 className="main-title"> Preencha os dados para criar a conta</h1>
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
                  {etapaAtual === 3 ? "Cadastrar" : "Continuar"}
                </Button>
              </div>
            )}

            {/* Buttons for etapa 4 are rendered inside the Confirmacao screen */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudentView;

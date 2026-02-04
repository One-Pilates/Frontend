import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../../provider/api";

// Função para validar CPF
const validarCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

// Função para validar email
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const useRegisterStudentModel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dadosIniciais = location.state || {};

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [erros, setErros] = useState({});

  const [dadosPessoais, setDadosPessoais] = useState(
    dadosIniciais.dadosPessoais || {
      fotoPerfil: "",
      nomeCompleto: "",
      email: "",
      cpf: "",
      dataNascimento: "",
      telefone: "",
    }
  );

  const [endereco, setEndereco] = useState(
    dadosIniciais.endereco || {
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    }
  );

  const [informacoesAluno, setInformacoesAluno] = useState(
    dadosIniciais.informacoesAluno || {
      problemasMobilidade: false,
      observacoes: "",
    }
  );

  const etapas = [
    { label: "Dados Pessoais" },
    { label: "Endereço" },
    { label: "Informações" },
    { label: "Confirmação" },
  ];

  const atualizarDadosPessoais = (novos) => {
    setDadosPessoais((prev) => ({ ...prev, ...novos }));
    if (erros.dadosPessoais) {
      setErros((prev) => ({ ...prev, dadosPessoais: {} }));
    }
  };

  const atualizarEndereco = (novos) => {
    setEndereco((prev) => ({ ...prev, ...novos }));
    if (erros.endereco) {
      setErros((prev) => ({ ...prev, endereco: {} }));
    }
  };

  const atualizarInformacoesAluno = (novos) => {
    setInformacoesAluno((prev) => ({ ...prev, ...novos }));
    if (erros.informacoesAluno) {
      setErros((prev) => ({ ...prev, informacoesAluno: {} }));
    }
  };

  // Buscar CEP usando ViaCEP API
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();

        if (!data.erro) {
          atualizarEndereco({
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          });
        } else {
          Swal.fire("CEP não encontrado!", "", "warning");
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
        Swal.fire("Erro ao buscar CEP", "Tente novamente", "error");
      }
    }
  };

  // Validação de cada etapa
  const validarEtapa = () => {
    const novosErros = {};

    if (etapaAtual === 1) {
      if (!dadosPessoais.nomeCompleto.trim()) {
        novosErros.nomeCompleto = "Nome completo é obrigatório";
      }
      if (!dadosPessoais.email.trim()) {
        novosErros.email = "Email é obrigatório";
      } else if (!validarEmail(dadosPessoais.email)) {
        novosErros.email = "Email inválido";
      }
      if (!dadosPessoais.cpf.trim()) {
        novosErros.cpf = "CPF é obrigatório";
      } else if (!validarCPF(dadosPessoais.cpf)) {
        novosErros.cpf = "CPF inválido";
      }
      if (!dadosPessoais.dataNascimento) {
        novosErros.dataNascimento = "Data de nascimento é obrigatória";
      }
      if (!dadosPessoais.telefone.trim()) {
        novosErros.telefone = "Telefone é obrigatório";
      }
    }

    if (etapaAtual === 2) {
      if (!endereco.cep.trim()) novosErros.cep = "CEP é obrigatório";
      if (!endereco.logradouro.trim())
        novosErros.logradouro = "Logradouro é obrigatório";
      if (!endereco.numero.trim()) novosErros.numero = "Número é obrigatório";
      if (!endereco.bairro.trim()) novosErros.bairro = "Bairro é obrigatório";
      if (!endereco.cidade.trim()) novosErros.cidade = "Cidade é obrigatória";
      if (!endereco.estado) novosErros.estado = "Estado é obrigatório";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const proximaEtapa = () => {
    if (validarEtapa()) {
      if (etapaAtual === 3) {
        finalizar();
      } else if (etapaAtual < 4) {
        setEtapaAtual(etapaAtual + 1);
      }
    } else {
      Swal.fire(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos obrigatórios corretamente.",
        "warning"
      );
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const irParaEtapa = (numeroEtapa) => {
    if (numeroEtapa <= etapaAtual && numeroEtapa >= 1) {
      setEtapaAtual(numeroEtapa);
    }
  };

  const voltar = () => {
    navigate("/secretary", {
      state: {
        dadosPessoais,
        endereco,
        informacoesAluno,
      },
    });
  };

  const finalizar = () => {
    console.log("📋 Dados do aluno (pré-visualização):", {
      dadosPessoais,
      endereco,
      informacoesAluno,
    });

    setEtapaAtual(4);
  };

  const concluir = () => {
    Swal.fire(
      "Cadastro concluído!",
      "Aluno cadastrado com sucesso!",
      "success"
    );
    navigate("/secretaria/alunos");
  };

  const cancelarCadastro = () => {
   
    setDadosPessoais({
    
      nomeCompleto: "",
      email: "",
      cpf: "",
      dataNascimento: "",
      telefone: "",
    });

    setEndereco({
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    });

    setInformacoesAluno({
      problemasMobilidade: false,
      observacoes: "",
    });

    navigate("/secretaria/alunos");
  };

  const cadastrarAluno = async () => {
    const payload = {
      nome: dadosPessoais.nomeCompleto || "",
      email: dadosPessoais.email || "",
      cpf: dadosPessoais.cpf || "",
      dataNascimento: dadosPessoais.dataNascimento || "",
      status: true,
      alunoComLimitacoesFisicas: !!informacoesAluno.problemasMobilidade,
      tipoContato: dadosPessoais.telefone || "",
      notificacaoAtiva: true,
      endereco: {
        rua: endereco.logradouro || "",
        numero: endereco.numero || "",
        bairro: endereco.bairro || "",
        cidade: endereco.cidade || "",
        estado: endereco.estado || "",
        cep: endereco.cep || "",
        uf: endereco.estado || "",
      },
    };

    try {
      const res = await api.post("api/alunos", payload);
      Swal.fire("Sucesso", "Aluno cadastrado com sucesso.", "success");
      navigate("/secretaria/alunos");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      Swal.fire("Erro", "Não foi possível cadastrar o aluno.", "error");
    }
  };

  return {
    etapaAtual,
    etapas,
    erros,

    dadosPessoais,
    endereco,
    informacoesAluno,

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
    cancelarCadastro,
    cadastrarAluno,
  };
};

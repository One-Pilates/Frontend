import {useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import api from "../../../../provider/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const useGerenciamentoProfessorModel = () => {
  const {user} = useAuth();
  const [professores, setProfessores] = useState([]);
  const [professoresOriginais, setProfessoresOriginais] = useState([]);
  const navigate = useNavigate();

  useEffect( () => {
    fetchProfessores();
  }, []);
  
  const fetchProfessores = async () => {
    try {
      console.log("Buscando professores...");
      const response = await api.get("api/professores");
      const data = response.data;
      console.log("Professores recebidosUseEffect:", data);
      setProfessores(data);
      setProfessoresOriginais(data);
      
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    }

  };

  const deletarProfessor = async (professorId) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`api/professores/${professorId}`);
          console.log("Professor deletado:", response.data);
          fetchProfessores();
          Swal.fire({
            icon: "success",
            title: "Deletado!",
            text: "O professor foi deletado com sucesso.",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Erro ao deletar professor:", error);
        }
      }
    });
  };


  const filterByNome = (event) => {
    const name = event.target.value.trim();
    
    if (!name) {
      setProfessores(professoresOriginais);
      return;
    }
    
    const filtrados = professoresOriginais.filter(professor => 
      professor.nome.toLowerCase().includes(name.toLowerCase())
    );
    
    setProfessores(filtrados);
  }

  return {
    professores,
    user,
    deletarProfessor,
    filterByNome,
    navigate,
  };
};

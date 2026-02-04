import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../../provider/api";
import { useAuth } from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const useGerenciamentoAlunoModel = () => {
    const {_user} = useAuth();
    const [alunos, setAlunos] = useState([]);
    const [statusFilter, setStatusFilter] = useState("todos");
    const [filterByNome, setFilterByNome] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const alunosPerPage = 7;
    const navigate = useNavigate(); 

  useEffect(() => {
    fetchAlunos();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [filterByNome, statusFilter]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const fetchAlunos = async () => {
    try {
      console.log("Fetching alunos...");
      const response = await api.get("api/alunos");
      const data = response.data;
      console.log("Alunos fetched:", data);
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      
    }
  }

  const deleteAluno = async (alunoId) => {
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
              await api.delete(`api/alunos/${alunoId}`);
              setAlunos(alunos.filter(aluno => aluno.id !== alunoId));
              Swal.fire({
                icon: "success",
                title: "Deletado!",
                text: "O aluno foi deletado com sucesso.",
                confirmButtonText: "OK",
              });
            } catch (error) {
              console.error("Erro ao deletar aluno:", error);
            }
          }
        });
  }

  const filteredStudents = alunos.filter((aluno) => {
    const matchesSearch =
      aluno.nome.toLowerCase().includes(filterByNome.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "ativo" && aluno.status) ||
      (statusFilter === "inativo" && !aluno.status);

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / alunosPerPage);
  const startIndex = (currentPage - 1) * alunosPerPage;
  const endIndex = startIndex + alunosPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  return {
    filteredStudents,
    _user,
    setFilterByNome,
    setStatusFilter,
    startIndex,
    endIndex,
    totalPages,
    currentPage,
    setCurrentPage,
    currentStudents,
    calculateAge,
    deleteAluno,
    navigate,
  };
};

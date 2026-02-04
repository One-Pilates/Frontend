import {useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../../../provider/api";

export const useViewProfileModel = () => {
  const { id } = useParams();
  const location = useLocation();
  const [dadosUser, setDadosUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tipo = location.pathname.includes('/professor') ? 'professor' : 'aluno';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        const endpoint = tipo === 'professor' 
          ? `api/professores/${id}` 
          : `api/alunos/${id}`;
        
        const response = await api.get(endpoint);
        const data = response.data;
        console.log(`Dados do ${tipo} recebidos:`, data);
        
        if (tipo === 'professor' && data.foto) {
          setDadosUser({
            ...data,
            foto: `${api.defaults.baseURL}/api/imagens/${data.foto}?token=${localStorage.getItem('token')}`
          });
        } else {
          setDadosUser(data);
        }
        
      } catch (error) {
        console.error(`Erro ao buscar ${tipo}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchUser();
  }, [id, tipo]);

  return { 
    dadosUser, 
    tipo, 
    loading,
    navigate
  };
};

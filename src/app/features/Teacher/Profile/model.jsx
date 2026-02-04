import { useState, useRef, useEffect} from "react";
import { useAuth } from "../../../../hooks/useAuth";
import api from "../../../../provider/api"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import userIconImg from "/user-icon.png";

export const useProfileUserModel = () => {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState({
    nome:  "",
    cargo: "",
    role: "",
    email: "",
    foto: "",
    dataNascimento: "",
    telefone: "",
    receberNotificacao: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [originalData, setOriginalData] = useState(userData);
  const [hasChanged, setHasChanged] = useState(false);
  const [specialtiesMap, setSpecialtiesMap] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState(new Set());
  const navigate = useNavigate();
  const [originalSpecialties, setOriginalSpecialties] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'PROFESSOR') return;
      try {
        const especialidadesResponse = await api.get(`api/especialidades`);
        const especialidadesData = especialidadesResponse.data;

        console.log('especialidadesData', especialidadesData);
        console.log('professorEspecialidadedata', user.especialidades);

        if (user.especialidades && Array.isArray(user.especialidades)) {
          const idsEspecialidadesProfessor = new Set(
            user.especialidades.map(esp => esp.id)
          );
          setSelectedSpecialties(idsEspecialidadesProfessor);
          setOriginalSpecialties(new Set(idsEspecialidadesProfessor));
        }

        setSpecialtiesMap(especialidadesData);

      } catch (err) {
        console.error('Erro ao carregar especialidades:', err);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    
    const currentData = {
      nome: user?.nome || "",
      cargo: user?.cargo || "",
      role: user?.role || "",
      foto: user?.foto ? `${api.defaults.baseURL}/api/imagens/${user.foto}?token=${localStorage.getItem('token')}` : userIconImg,
      email: user?.email || "",
      dataNascimento: user?.idade || user?.dataNascimento || "",
      telefone: user?.telefone || "",
      receberNotificacao: user?.notificacaoAtiva ?? user?.receberNotificacao ?? false,
    };
    console.log('URL da foto:', currentData.foto);
    
        setUserData(currentData);
        setOriginalData(currentData);

        console.log('dadosUser carregados com sucesso');
  }, [user]);

  useEffect(() => {
    const checkChanges = () => {
      const dataChanged = JSON.stringify(userData) !== JSON.stringify(originalData);

      const specialtiesChanged = 
        userData.role === 'PROFESSOR' && (
          selectedSpecialties.size !== originalSpecialties.size ||
          ![...selectedSpecialties].every(id => originalSpecialties.has(id))
        );
      
      if (dataChanged || specialtiesChanged) {
        setHasChanged(true);
      } else {
        setHasChanged(false);
      }
    };
    checkChanges();
  }, [userData, originalData, selectedSpecialties, originalSpecialties]);

  const handleEditFotoClick = () => {
    console.log('Clicou para editar foto');
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log('Arquivo selecionado:', file);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Formato inválido',
        text: 'Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG, etc).',
        confirmButtonText: 'OK',
      });
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Arquivo muito grande',
        text: 'A imagem deve ter no máximo 5MB. Por favor, selecione uma imagem menor.',
        confirmButtonText: 'OK',
      });
      e.target.value = '';
      return;
    }

    setProfileImage(file);
    
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    setUserData(prev => ({
      ...prev,
      foto: objectUrl // Temporário para preview
    }));
    
    e.target.value = '';
  };

  const cancelChanges = () => {
    setUserData(originalData);
    if (user.role === 'PROFESSOR') {
      setSelectedSpecialties(new Set(originalSpecialties));
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setUserData(prev => ({
        ...prev,
        foto: originalData.foto
      }));
    }
    setProfileImage(null);  
    setHasChanged(false);
  }

  const saveChanges = async () => {
    if (!hasChanged) {
      console.log("Nenhuma alteração detectada");
      return;
    }

    const emailChanged = userData.email !== originalData.email;

    try {

      let endpoint = '';
      let endpointImg = ''
      switch (user.role) {
        case 'PROFESSOR':
          endpoint = `api/professores/${user.id}`;
          endpointImg = `api/professores/${user.id}/uploadFoto`;
          break;
        case 'ADMINISTRADOR':
          endpoint = `api/administradores/${user.id}`;
          endpointImg = `api/administradores/${user.id}/uploadFoto`;
          break;
        case 'SECRETARIA':
          endpoint = `api/secretarias/${user.id}`;
          endpointImg = `api/secretarias/${user.id}/uploadFoto`;
          break;
        default:
          throw new Error('Role não reconhecida');
      }

      let imageName = user.foto;

      if (profileImage) {

        try {

          const formData = new FormData();
          formData.append("file", profileImage);

          console.log("Enviando foto para:", endpointImg);
          const fotoResponse = await api.post(endpointImg, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          });

          imageName = fotoResponse.data;
          console.log("✅ Foto enviada com sucesso:", imageName);
          
          // Limpar preview e arquivo selecionado
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
          setProfileImage(null);
        } catch (err) {
          console.error("❌ Erro ao fazer upload da foto:", err);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao enviar foto',
            text: 'Não foi possível fazer upload da imagem. Os outros dados serão salvos.',
            confirmButtonText: 'OK',
          });
        }
      }

      const userDTO = {
        nome: userData.nome.trim(),
        email: userData.email,
        idade: userData.dataNascimento,
        telefone: userData.telefone,
        notificacaoAtiva: userData.receberNotificacao,
      };

      if (user.role === 'PROFESSOR') {
        userDTO.especialidadeIds = Array.from(selectedSpecialties);
      }

      console.log("Enviando dados para atualização:", userDTO);
      console.log("Endpoint:", endpoint);

      const response = await api.patch(endpoint, userDTO);
      const data = response.data;
      
      console.log("✅ Dados atualizados com sucesso:", data);

      const updatedData = {
        ...userData,
        foto: `${api.defaults.baseURL}/api/imagens/${imageName}?token=${localStorage.getItem('token')}`
      };

      setUserData(updatedData);
      setOriginalData(updatedData);
      setOriginalSpecialties(new Set(selectedSpecialties));
      
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      
      setHasChanged(false);

      if (emailChanged) {
        await Swal.fire({
          icon: 'success',
          title: 'Perfil atualizado!',
          text: 'Seu email foi alterado. Por segurança, você precisa fazer login novamente.',
          confirmButtonText: 'OK',
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Perfil atualizado!',
          text: 'Seus dados foram atualizados com sucesso.',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar perfil',
        text: 'Ocorreu um erro ao atualizar seus dados. Por favor, tente novamente mais tarde.',
        confirmButtonText: 'OK',
      });
      console.error("========== ERRO ==========");
      console.error("❌ Erro ao atualizar dados:", error.message);
      console.error("Status HTTP:", error.response?.status);
      console.error("Mensagem do backend:", error.response?.data);
      console.error("Token usado na requisição:", error.config?.headers?.Authorization?.substring(0, 50) + "...");
    }
  };

  const toggleSpecialty = (especialidadeId) => {
    setSelectedSpecialties((prev) => {
      const newSet = new Set(prev);
      
      if (newSet.has(especialidadeId)) {
        newSet.delete(especialidadeId);
      } else {
        newSet.add(especialidadeId);
      }
      return newSet;
    });
  };
  
  const isSpecialtySelected = (especialidadeId) => {
    return selectedSpecialties.has(especialidadeId);
  };

  return {
    userData,
    setUserData,
    profileImage,
    previewUrl,
    fileInputRef,
    handleEditFotoClick,
    handleFileChange,
    hasChanged,
    toggleSpecialty,
    isSpecialtySelected,
    cancelChanges,
    specialtiesMap,
    saveChanges,
    userIconImg
  };
};

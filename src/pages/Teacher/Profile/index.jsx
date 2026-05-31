import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { formatarTelefone } from '../../../utils/utils';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiPhone,
  FiCamera,
  FiEdit3,
  FiBell,
  FiAward,
  FiSave,
  FiX,
  FiHome,
  FiMapPin,
} from 'react-icons/fi';
import userIconImg from '/user-icon.png';
import './style.scss';

const ProfileUser = () => {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState({
    nome: '',
    cargo: '',
    role: '',
    email: '',
    foto: '',
    dataNascimento: '',
    telefone: '',
    receberNotificacao: false,
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      uf: '',
    },
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

        if (user.especialidades && Array.isArray(user.especialidades)) {
          const idsEspecialidadesProfessor = new Set(user.especialidades.map((esp) => esp.id));
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
      nome: user?.nome || '',
      cargo: user?.cargo || '',
      role: user?.role || '',
      foto: user?.foto
        ? `${api.defaults.baseURL}/api/imagens/funcionarios/${user.id}`
        : userIconImg,
      email: user?.email || '',
      dataNascimento: user?.idade || user?.dataNascimento || '',
      telefone: formatarTelefone(user?.telefone) || '',
      receberNotificacao: user?.notificacaoAtiva ?? user?.receberNotificacao ?? false,
      endereco: {
        rua: user?.endereco?.rua || '',
        numero: user?.endereco?.numero || '',
        bairro: user?.endereco?.bairro || '',
        cidade: user?.endereco?.cidade || '',
        estado: user?.endereco?.estado || '',
        cep: user?.endereco?.cep || '',
        uf: user?.endereco?.uf || '',
      },
    };

    setUserData(currentData);
    setOriginalData(currentData);
  }, [user]);

  useEffect(() => {
    const dataChanged = JSON.stringify(userData) !== JSON.stringify(originalData);

    const specialtiesChanged =
      userData.role === 'PROFESSOR' &&
      (selectedSpecialties.size !== originalSpecialties.size ||
        ![...selectedSpecialties].every((id) => originalSpecialties.has(id)));

    setHasChanged(dataChanged || specialtiesChanged);
  }, [userData, originalData, selectedSpecialties, originalSpecialties]);

  const handleEditFotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG, etc).');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warning('A imagem deve ter no máximo 10MB. Por favor, selecione uma imagem menor.');
      e.target.value = '';
      return;
    }

    setProfileImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setUserData((prev) => ({
      ...prev,
      foto: objectUrl,
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
      setUserData((prev) => ({
        ...prev,
        foto: originalData.foto,
      }));
    }
    setProfileImage(null);
    setHasChanged(false);
  };

  const saveChanges = async () => {
    if (!hasChanged) return;

    const emailChanged = userData.email !== originalData.email;

    try {
      let endpoint = '';
      let endpointImg = '';
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
          formData.append('file', profileImage);

          const fotoResponse = await api.post(endpointImg, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          imageName = fotoResponse.data;

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
          setProfileImage(null);
        } catch (err) {
          console.error('Erro ao fazer upload da foto:', err);
          toast.error('Não foi possível fazer upload da imagem. Os outros dados serão salvos.');
        }
      }

      const userDTO = {
        nome: userData.nome.trim(),
        email: userData.email,
        idade: userData.dataNascimento,
        telefone: userData.telefone.replace(/\D/g, ''),
        notificacaoAtiva: userData.receberNotificacao,
        endereco: {
          rua: userData.endereco.rua.trim(),
          numero: userData.endereco.numero.trim(),
          bairro: userData.endereco.bairro.trim(),
          cidade: userData.endereco.cidade.trim(),
          estado: userData.endereco.estado.trim(),
          uf: userData.endereco.uf.trim(),
          cep: userData.endereco.cep.trim(),
        },
      };

      if (user.role === 'PROFESSOR') {
        userDTO.especialidadeIds = Array.from(selectedSpecialties);
      }

      const response = await api.patch(endpoint, userDTO);
      const data = response.data;

      const updatedData = {
        ...userData,
        foto: `${api.defaults.baseURL}/api/imagens/${imageName}?token=${localStorage.getItem('token')}`,
      };

      setUserData(updatedData);
      setOriginalData(updatedData);
      setOriginalSpecialties(new Set(selectedSpecialties));

      const mergedUser = { 
        ...user,
        ...data, 
        ...updatedData,
        telefone: userDTO.telefone,
        endereco: {
          ...user.endereco,
          ...(data.endereco || {}),
          ...userDTO.endereco,
        }
      };
      setUser(mergedUser);
      localStorage.setItem('user', JSON.stringify(mergedUser));

      setHasChanged(false);

      if (emailChanged) {
        await Swal.fire({
          icon: 'success',
          title: 'Perfil atualizado!',
          text: 'Seu email foi alterado. Por segurança, você precisa fazer login novamente.',
          confirmButtonText: 'OK',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
      } else {
        toast.success('Perfil atualizado! Seus dados foram salvos com sucesso.');
      }
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Por favor, tente novamente.');
      console.error('Erro ao atualizar dados:', error);
    }
  };

  const handleTelefoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatted = '';
    if (digits.length === 0) {
      formatted = '';
    } else if (digits.length <= 2) {
      formatted = `(${digits}`;
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    setUserData({ ...userData, telefone: formatted });
  };

  const handleCepChange = (e) => {
    let cepValue = e.target.value.replace(/\D/g, '');
    if (cepValue.length > 5) {
      cepValue = cepValue.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setUserData({
      ...userData,
      endereco: { ...userData.endereco, cep: cepValue },
    });
  };

  const getEstadoNome = (uf) => {
    const estados = {
      AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará',
      DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão',
      MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará',
      PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
      SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
    };
    return estados[uf] || '';
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setUserData((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              rua: data.logradouro || prev.endereco.rua,
              bairro: data.bairro || prev.endereco.bairro,
              cidade: data.localidade || prev.endereco.cidade,
              estado: data.estado || getEstadoNome(data.uf) || prev.endereco.estado,
              uf: data.uf || prev.endereco.uf,
            },
          }));
          toast.success('Endereço preenchido automaticamente!');
        } else {
          toast.error('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error('Erro ao buscar informações do CEP.');
      }
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

  return (
    <div className="profile-page px-3 sm:px-4 md:px-6 lg:px-8 py-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-(--text-escuro) mb-2">Editar Perfil</h1>
          <p className="text-sm sm:text-base text-(--text-cinza)">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-(--laranja-principal) shadow-lg">
                <img
                  src={previewUrl || userData.foto || userIconImg}
                  alt={userData.nome || 'Usuário'}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleEditFotoClick}
                className="absolute bottom-0 right-0 bg-(--laranja-principal) text-white p-3 rounded-full shadow-lg hover:bg-(--laranja-hover) transition-all duration-300 hover:scale-110"
                aria-label="Editar foto"
              >
                <FiCamera size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-(--text-escuro) mb-1">
                {userData.nome || 'Nome do Usuário'}
              </h2>
              <p className="text-base sm:text-lg text-(--text-cinza) mb-3">
                {userData.cargo || 'Professor'}
              </p>
              {hasChanged && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-(--laranja-principal) text-sm font-medium rounded-full">
                  <FiEdit3 size={14} />
                  Alterações não salvas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-4">
          <h3 className="text-xl font-bold text-(--text-escuro) mb-4 flex items-center gap-2">
            <FiUser className="text-(--laranja-principal)" size={24} />
            Informações Pessoais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                  <FiUser size={20} />
                </div>
                <input
                  type="text"
                  value={userData?.nome}
                  onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-(--text-escuro) mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                  <FiMail size={20} />
                </div>
                <input
                  type="email"
                  value={userData?.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                Data de Nascimento
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                  <FiCalendar size={20} />
                </div>
                <input
                  type="date"
                  value={userData?.dataNascimento}
                  onChange={(e) => setUserData({ ...userData, dataNascimento: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                  <FiPhone size={20} />
                </div>
                <input
                  type="tel"
                  value={userData?.telefone}
                  onChange={handleTelefoneChange}
                  maxLength={16}
                  className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          {
            <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-4">
              <h3 className="text-xl font-bold text-(--text-escuro) mb-4 flex items-center gap-2">
                <FiHome className="text-(--laranja-principal)" size={24} />
                Endereço
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                    Rua
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                      <FiMapPin size={20} />
                    </div>
                    <input
                      type="text"
                      value={userData?.endereco?.rua || ''}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          endereco: { ...userData.endereco, rua: e.target.value },
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                      placeholder="Digite o nome da rua"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                    Numero
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                      <FiMapPin size={20} />
                    </div>
                    <input
                      type="text"
                      value={
                        userData?.endereco?.numero === '0'
                          ? 'S/N'
                          : userData?.endereco?.numero || ''
                      }
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          endereco: { ...userData.endereco, numero: e.target.value },
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                      placeholder="Digite o número da residência"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                    Bairro
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                      <FiMapPin size={20} />
                    </div>
                    <input
                      type="text"
                      value={userData?.endereco?.bairro || ''}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          endereco: { ...userData.endereco, bairro: e.target.value },
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                      placeholder="Digite o nome do bairro"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                    Cidade
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                      <FiMapPin size={20} />
                    </div>
                    <input
                      type="text"
                      value={userData?.endereco?.cidade || ''}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          endereco: { ...userData.endereco, cidade: e.target.value },
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                      placeholder="Digite o nome da cidade"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                    Estado
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                      <FiMapPin size={20} />
                    </div>
                    <input
                      type="text"
                      value={userData?.endereco?.estado || ''}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          endereco: { ...userData.endereco, estado: e.target.value },
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                      placeholder="Digite o nome do estado"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                    UF
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                      <FiMapPin size={20} />
                    </div>
                    <input
                      type="text"
                      value={userData?.endereco?.uf || ''}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          endereco: { ...userData.endereco, uf: e.target.value },
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                      placeholder="Digite a sigla do estado"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--text-escuro) mb-2">
                    CEP
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-cinza)">
                      <FiMapPin size={20} />
                    </div>
                    <input
                      type="text"
                      value={userData?.endereco?.cep || ''}
                      onChange={handleCepChange}
                      onBlur={handleCepBlur}
                      className="w-full pl-12 pr-4 py-3 bg-(--bg-claro) border-2 border-transparent rounded-xl text-(--text-escuro) focus:border-(--laranja-principal) focus:bg-white transition-all outline-none"
                      placeholder="Digite o CEP"
                      maxLength={9}
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
        {/* Notifications Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-4">
          <h3 className="text-xl font-bold text-(--text-escuro) mb-4 flex items-center gap-2">
            <FiBell className="text-(--laranja-principal)" size={24} />
            Preferências de Notificação
          </h3>

          <div className="flex items-center justify-between p-4 bg-(--bg-claro) rounded-xl">
            <div>
              <p className="font-semibold text-(--text-escuro) mb-1">Receber Notificações</p>
              <p className="text-sm text-(--text-cinza)">
                Receba atualizações sobre suas aulas e lembretes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(userData.receberNotificacao)}
                onChange={(e) => setUserData({ ...userData, receberNotificacao: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-(--laranja-principal)"></div>
            </label>
          </div>
        </div>

        {/* Specialties Card - Only for Professors */}
        {userData.role === 'PROFESSOR' && (
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-4">
            <h3 className="text-xl font-bold text-(--text-escuro) mb-4 flex items-center gap-2">
              <FiAward className="text-(--laranja-principal)" size={24} />
              Especialidades
            </h3>

            <div className="flex flex-wrap gap-3">
              {specialtiesMap &&
                specialtiesMap.map((especialidade) => (
                  <label
                    key={especialidade.id}
                    className={`specialty-chip ${isSpecialtySelected(especialidade.id) ? 'specialty-chip--selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSpecialtySelected(especialidade.id)}
                      onChange={() => toggleSpecialty(especialidade.id)}
                      className="hidden"
                    />
                    <span className="specialty-chip__text">{especialidade.nome}</span>
                    {isSpecialtySelected(especialidade.id) && (
                      <span className="specialty-chip__check">✓</span>
                    )}
                  </label>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={saveChanges}
            disabled={!hasChanged}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3 bg-(--laranja-principal) text-white font-semibold rounded-xl hover:bg-(--laranja-hover) disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:hover:shadow-md"
          >
            <FiSave size={20} />
            Salvar Alterações
          </button>

          {hasChanged && (
            <button
              onClick={cancelChanges}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
            >
              <FiX size={20} />
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;

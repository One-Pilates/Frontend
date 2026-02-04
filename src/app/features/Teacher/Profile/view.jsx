import React from "react";
import { FaPen } from "react-icons/fa";
import "./style.scss";

const ProfileUserView = ({
  userData,
  previewUrl,
  userIconImg,
  fileInputRef,
  handleEditFotoClick,
  handleFileChange,
  setUserData,
  hasChanged,
  cancelChanges,
  toggleSpecialty,
  isSpecialtySelected,
  specialtiesMap,
  saveChanges,
}) => {
  return (
    <div className="profile-user">
      {/* HEADER */}
      <div className="profile-user__header">
        <div className="profile-user__foto-container">
          <img
            src={previewUrl || userData.foto || userIconImg}
            alt={userData.nome || "Usuário"}
            className="profile-user__foto"
          />

          <button
            type="button"
            className="profile-user__foto-edit"
            onClick={handleEditFotoClick}
            aria-label="Editar foto"
          >
            <FaPen size={12} aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <div className="profile-user__info">
          <h2 className="profile-user__nome">{userData.nome}</h2>
          <p className="profile-user__cargo">
            {userData.cargo || "Professor"}
          </p>
        </div>
      </div>
      <hr className="mt-2 mb-2" />
      {/* FORM */}
      <div className="profile-user__form">
        {/* NOME / EMAIL */}
        <div className="profile-user__row">
          <div className="profile-user__field">
            <label className="profile-user__label">Nome Completo</label>
            <div className="profile-user__input-group">
              <input
                type="text"
                value={userData.nome}
                onChange={(e) =>
                  setUserData({ ...userData, nome: e.target.value })
                }
                className="profile-user__input"
              />
            </div>
          </div>

          <div className="profile-user__field">
            <label className="profile-user__label">Email</label>
            <div className="profile-user__input-group">
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    email: e.target.value,
                  })
                }
                className="profile-user__input"
              />
            </div>
          </div>
        </div>

        {/* DATA / TELEFONE */}
        <div className="profile-user__row">
          <div className="profile-user__field">
            <label className="profile-user__label">Data de nascimento</label>
            <input
              type="date"
              value={userData.dataNascimento}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  dataNascimento: e.target.value,
                })
              }
              className="profile-user__input"
            />
          </div>

          <div className="profile-user__field">
            <label className="profile-user__label">Telefone</label>
            <input
              type="tel"
              value={userData.telefone}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  telefone: e.target.value,
                })
              }
              className="profile-user__input"
            />
          </div>
        </div>

        {/* SENHA / NOTIFICAÇÃO */}
        <div className="profile-user__row profile-user__row--align-end">
          {/* <div className="profile-user__field">
            <label className="profile-user__label">Senha</label>
            <input
              type="text"
              value={dadosUser.senha}
              onChange={(e) =>
                setDadosUser({
                  ...dadosUser,
                  senha: e.target.value,
                })
              }
              className="profile-user__input"
            />
          </div> */}

          <div className="profile-user__notification">
              <span className="profile-user__notification-text">
                Deseja receber notificação?
              </span>
              <label className="profile-user__switch">
                <input
                  type="checkbox"
                  checked={Boolean(userData.receberNotificacao)}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      receberNotificacao: e.target.checked,
                    })
                  }
                  aria-label="Receber notificações"
                />
                <span className="profile-user__switch-slider" />
              </label>
            </div>
        </div>

        {/* ESPECIALIDADES */}
        {userData.role === 'PROFESSOR' && (
        <div className="profile-user__especialidades">
          <label className="profile-user__label">Especialidades</label>
          <div className="profile-user__checkbox-container">
            {specialtiesMap && specialtiesMap.map((especialidade) => (
              <label
                key={especialidade.id}
                className="profile-user__checkbox"
              >
                <input
                  type="checkbox"
                  checked={isSpecialtySelected(especialidade.id)}
                  onChange={() => toggleSpecialty(especialidade.id)}
                />
                <span>{especialidade.nome}</span>
              </label>
            ))}
          </div>
        </div>
        )}


        {/* BOTÕES */}
        <div className="profile-user__buttons">
          <button
            onClick={cancelChanges}
            hidden={!hasChanged}
            className="profile-user__btn profile-user__btn--cancel"
          >
            Cancelar
          </button>
          <button
            onClick={saveChanges}
            disabled={!hasChanged}
            className="profile-user__btn profile-user__btn--save"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUserView;

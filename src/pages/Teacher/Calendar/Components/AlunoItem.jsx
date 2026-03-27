import React from 'react';
import { FiUser } from 'react-icons/fi';
import { FaWheelchair } from 'react-icons/fa';
import '../Styles/AlunoItem.scss';

const AlunoItem = ({ nome, status, alunoComLimitacoesFisicas }) => (
  <div className="aluno-item">
    <div className="aluno-avatar">
      <FiUser size={20} color="#FF6B35" />
    </div>
    <div className="aluno-info" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span className="aluno-nome">{nome}</span>
      {alunoComLimitacoesFisicas === true && (
        <FaWheelchair size={16} style={{ color: '#0066cc' }} title="Aluno com limitações físicas" />
      )}
    </div>
  </div>
);

export default AlunoItem;

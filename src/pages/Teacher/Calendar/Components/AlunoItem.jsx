import React from 'react';
import { FaWheelchair } from 'react-icons/fa';
import '../Styles/AlunoItem.scss';

const AlunoItem = ({ nome, status, alunoComLimitacoesFisicas }) => {
  const getInitials = (n) => {
    if (!n) return 'UA';
    const names = n.trim().split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (n) => {
    const colors = ['#f77433', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];
    const charCode = n ? n.charCodeAt(0) : 0;
    return colors[charCode % colors.length];
  };

  return (
    <div className="aluno-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
      <div 
        className="aluno-avatar" 
        style={{ 
          background: getAvatarColor(nome),
          color: '#fff',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          flexShrink: 0
        }}
      >
        {getInitials(nome)}
      </div>
      <div className="aluno-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="aluno-nome" style={{ fontWeight: '600', color: 'var(--text-escuro)', fontSize: '0.95rem' }}>{nome}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
          {alunoComLimitacoesFisicas === true && (
            <span style={{
              background: 'rgba(37, 99, 235, 0.12)',
              color: '#2563eb',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.65rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <FaWheelchair size={10} /> PCD
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlunoItem;

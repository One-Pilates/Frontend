import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaWheelchair } from 'react-icons/fa';

const AlunoItem = ({ nome, status, onRemove, alunoComLimitacoesFisicas }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      background: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '8px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontWeight: '600', color: '#333' }}>{nome}</span>
      {status && (
        <span style={{ marginLeft: '4px', color: '#666', fontSize: '0.875rem' }}>({status})</span>
      )}
      {alunoComLimitacoesFisicas === true && (
        <FaWheelchair size={16} style={{ color: '#0066cc' }} title="Aluno com limitações físicas" />
      )}
    </div>
    {onRemove && (
      <button
        onClick={onRemove}
        style={{
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FiX size={14} />
      </button>
    )}
  </div>
);

export default AlunoItem;

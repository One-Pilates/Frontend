import React, { useState, useEffect } from "react";
import { FiEdit2, FiX, FiPlus, FiTrash2 } from "react-icons/fi";

const AlunoItem = ({ nome, status, onRemove }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '8px'
  }}>
    <div>
      <span style={{ fontWeight: '600', color: '#333' }}>{nome}</span>
      {status && <span style={{ marginLeft: '8px', color: '#666', fontSize: '0.875rem' }}>({status})</span>}
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
          alignItems: 'center'
        }}
      >
        <FiTrash2 size={14} />
      </button>
    )}
  </div>
);

export default AlunoItem;

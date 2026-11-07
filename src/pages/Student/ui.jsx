import { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';
import { iniciais } from './studentUtils';

const TONS = {
  laranja: { background: '#fff1e8', color: '#c2410c' },
  verde: { background: '#e7f6ec', color: '#15803d' },
  cinza: { background: '#eceff1', color: '#546e7a' },
  vermelho: { background: '#fdecec', color: '#b91c1c' },
};

export function Card({ children, className = '', style, ...resto }) {
  return (
    <section
      className={`rounded-2xl p-4 ${className}`}
      style={{
        background: 'var(--branco)',
        color: 'var(--text-escuro)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        ...style,
      }}
      {...resto}
    >
      {children}
    </section>
  );
}

export function Selo({ tom = 'cinza', children }) {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={TONS[tom] || TONS.cinza}
    >
      {children}
    </span>
  );
}

export function Titulo({ children, subtitulo }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-escuro)' }}>
        {children}
      </h1>
      {subtitulo && (
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-cinza)' }}>
          {subtitulo}
        </p>
      )}
    </div>
  );
}

export function EstadoCarregando({ texto = 'Carregando...' }) {
  return (
    <div
      className="flex flex-col items-center gap-3 py-16"
      role="status"
      style={{ color: 'var(--text-cinza)' }}
    >
      <div
        className="h-8 w-8 rounded-full border-4 animate-spin"
        style={{ borderColor: 'var(--cor-borda)', borderTopColor: 'var(--laranja-principal)' }}
      />
      <span className="text-sm">{texto}</span>
    </div>
  );
}

export function EstadoErro({ mensagem, onTentar }) {
  return (
    <Card className="text-center" role="alert">
      <FiAlertCircle size={28} className="mx-auto mb-2" style={{ color: '#b91c1c' }} />
      <p className="text-sm mb-3">{mensagem}</p>
      {onTentar && (
        <button
          type="button"
          onClick={onTentar}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
          style={{ background: 'var(--laranja-principal)' }}
        >
          Tentar de novo
        </button>
      )}
    </Card>
  );
}

export function EstadoVazio({ icone: Icone, titulo, texto }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-12 px-6">
      {Icone && <Icone size={40} style={{ color: 'var(--cor-borda)' }} />}
      <p className="font-semibold">{titulo}</p>
      {texto && (
        <p className="text-sm" style={{ color: 'var(--text-cinza)' }}>
          {texto}
        </p>
      )}
    </div>
  );
}

/** Botões de escolha de período: opcoes = [{ valor, rotulo }]. */
export function ChipsPeriodo({ opcoes, valor, onChange, rotuloGrupo }) {
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label={rotuloGrupo}>
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        return (
          <button
            key={o.valor}
            type="button"
            aria-pressed={ativo}
            onClick={() => onChange(o.valor)}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background: ativo ? 'var(--laranja-principal)' : 'var(--branco)',
              color: ativo ? '#fff' : 'var(--text-escuro)',
              border: `1px solid ${ativo ? 'var(--laranja-principal)' : 'var(--cor-borda)'}`,
            }}
          >
            {o.rotulo}
          </button>
        );
      })}
    </div>
  );
}

/** Foto do professor (se houver) ou as iniciais. */
export function Avatar({ nome, professorId, comFoto = false, tamanho = 36 }) {
  const [falhou, setFalhou] = useState(false);
  const mostrarFoto = comFoto && professorId && !falhou;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-bold"
      style={{
        width: tamanho,
        height: tamanho,
        fontSize: tamanho * 0.38,
        background: '#ffe3d1',
        color: 'var(--laranja-principal)',
      }}
    >
      {mostrarFoto ? (
        <img
          src={`${api.defaults.baseURL}/api/imagens/funcionarios/${professorId}`}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setFalhou(true)}
        />
      ) : (
        iniciais(nome)
      )}
    </span>
  );
}

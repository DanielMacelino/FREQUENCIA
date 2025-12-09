import React from 'react';
import './FaturaView.css';
import { Gasto } from '../types';

interface FaturaViewProps {
  gastos: Gasto[];
  loading: boolean;
  isMesAtual: boolean;
  onDeletar: (id: number) => void;
}

const FaturaView: React.FC<FaturaViewProps> = ({ gastos, loading, isMesAtual, onDeletar }) => {
  const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const getPessoaColor = (pessoa: string) => {
    switch (pessoa) {
      case 'Daniel':
        return '#667eea';
      case 'Douglas':
        return '#f093fb';
      case 'Casa':
        return '#4facfe';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="fatura-view">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="fatura-view">
      <div className="fatura-header">
        <h2>📋 Fatura do Mês</h2>
        <div className="total-fatura">
          <span className="total-label">Total:</span>
          <span className="total-valor">{formatarValor(total)}</span>
        </div>
      </div>

      {gastos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum gasto registrado para este mês.</p>
        </div>
      ) : (
        <div className="gastos-list">
          {gastos.map((gasto) => (
            <div key={gasto.id} className="gasto-item">
              <div className="gasto-info">
                <div className="gasto-descricao">
                  <h3>{gasto.descricao}</h3>
                  <div className="gasto-meta">
                    <span className="gasto-categorias">
                      {gasto.categorias.split(',').map((cat, idx) => (
                        <span key={idx} className="categoria-tag">
                          {cat.trim()}
                        </span>
                      ))}
                    </span>
                    <span
                      className="gasto-pessoa"
                      style={{ backgroundColor: getPessoaColor(gasto.pessoa) }}
                    >
                      {gasto.pessoa}
                    </span>
                  </div>
                </div>
                <div className="gasto-valor">{formatarValor(gasto.valor)}</div>
              </div>
              {isMesAtual && (
                <button
                  className="delete-button"
                  onClick={() => onDeletar(gasto.id)}
                  title="Deletar gasto"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaturaView;


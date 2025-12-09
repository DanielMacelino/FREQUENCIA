import React from 'react';
import './GastosPorPessoa.css';
import { Gasto } from '../types';

interface GastosPorPessoaProps {
  gastos: Gasto[];
  isMesAtual: boolean;
  onDeletar: (id: number) => void;
}

const GastosPorPessoa: React.FC<GastosPorPessoaProps> = ({ gastos, isMesAtual, onDeletar }) => {
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

  const getPessoaIcon = (pessoa: string) => {
    switch (pessoa) {
      case 'Daniel':
        return '👤';
      case 'Douglas':
        return '👤';
      case 'Casa':
        return '🏠';
      default:
        return '👤';
    }
  };

  // Agrupar gastos por pessoa
  const gastosPorPessoa: { [key: string]: Gasto[] } = {};
  const pessoas = ['Daniel', 'Douglas', 'Casa'];

  pessoas.forEach((pessoa) => {
    gastosPorPessoa[pessoa] = gastos.filter((gasto) => gasto.pessoa === pessoa);
  });

  // Calcular totais por pessoa
  const totaisPorPessoa: { [key: string]: number } = {};
  pessoas.forEach((pessoa) => {
    totaisPorPessoa[pessoa] = gastosPorPessoa[pessoa].reduce(
      (sum, gasto) => sum + gasto.valor,
      0
    );
  });

  // Não mostrar se não houver gastos
  if (gastos.length === 0) {
    return null;
  }

  return (
    <div className="gastos-por-pessoa">
      <h2>👥 Gastos por Pessoa</h2>
      <div className="pessoas-grid">
        {pessoas.map((pessoa) => {
          const gastosPessoa = gastosPorPessoa[pessoa];
          const totalPessoa = totaisPorPessoa[pessoa];

          return (
            <div key={pessoa} className="pessoa-section">
              <div
                className="pessoa-header"
                style={{ borderLeftColor: getPessoaColor(pessoa) }}
              >
                <div className="pessoa-title">
                  <span className="pessoa-icon">{getPessoaIcon(pessoa)}</span>
                  <h3>Gastos de "{pessoa}"</h3>
                </div>
                <div className="pessoa-total">
                  <span className="total-label">Total:</span>
                  <span
                    className="total-valor"
                    style={{ color: getPessoaColor(pessoa) }}
                  >
                    {formatarValor(totalPessoa)}
                  </span>
                </div>
              </div>

              {gastosPessoa.length === 0 ? (
                <div className="empty-pessoa">
                  <p>Nenhum gasto registrado</p>
                </div>
              ) : (
                <div className="gastos-pessoa-list">
                  {gastosPessoa.map((gasto) => (
                    <div key={gasto.id} className="gasto-pessoa-item">
                      <div className="gasto-pessoa-info">
                        <div className="gasto-pessoa-descricao">
                          <h4>{gasto.descricao}</h4>
                          <div className="gasto-pessoa-meta">
                            <span className="gasto-pessoa-categorias">
                              {gasto.categorias.split(',').map((cat, idx) => (
                                <span key={idx} className="categoria-tag-small">
                                  {cat.trim()}
                                </span>
                              ))}
                            </span>
                          </div>
                        </div>
                        <div className="gasto-pessoa-valor">
                          {formatarValor(gasto.valor)}
                        </div>
                      </div>
                      {isMesAtual && (
                        <button
                          className="delete-button-small"
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
        })}
      </div>
    </div>
  );
};

export default GastosPorPessoa;


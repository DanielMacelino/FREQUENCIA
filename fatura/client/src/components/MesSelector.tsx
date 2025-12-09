import React from 'react';
import './MesSelector.css';

interface MesSelectorProps {
  mes: number;
  ano: number;
  onMesChange: (mes: number) => void;
  onAnoChange: (ano: number) => void;
}

const MesSelector: React.FC<MesSelectorProps> = ({ mes, ano, onMesChange, onAnoChange }) => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const anos = [];
  const anoAtual = new Date().getFullYear();
  for (let i = anoAtual - 2; i <= anoAtual; i++) {
    anos.push(i);
  }

  return (
    <div className="mes-selector">
      <div className="selector-group">
        <label htmlFor="mes">Mês:</label>
        <select
          id="mes"
          value={mes}
          onChange={(e) => onMesChange(parseInt(e.target.value))}
          className="select-input"
        >
          {meses.map((nomeMes, index) => (
            <option key={index} value={index + 1}>
              {nomeMes}
            </option>
          ))}
        </select>
      </div>

      <div className="selector-group">
        <label htmlFor="ano">Ano:</label>
        <select
          id="ano"
          value={ano}
          onChange={(e) => onAnoChange(parseInt(e.target.value))}
          className="select-input"
        >
          {anos.map((anoOption) => (
            <option key={anoOption} value={anoOption}>
              {anoOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MesSelector;


import React, { useState } from 'react';
import './AdicionarGasto.css';
import { Gasto } from '../types';

interface AdicionarGastoProps {
  mes: number;
  ano: number;
  onAdicionar: (gasto: Omit<Gasto, 'id' | 'data_criacao'>) => void;
}

const CATEGORIAS = [
  'Coisas de Casa',
  'Alimentação',
  'Besteira',
  'Viagens',
  'Outros'
];

const PESSOAS = ['Daniel', 'Douglas', 'Casa'];

const AdicionarGasto: React.FC<AdicionarGastoProps> = ({ mes, ano, onAdicionar }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [pessoa, setPessoa] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao || !valor || categoriasSelecionadas.length === 0 || !pessoa) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const valorNumero = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumero) || valorNumero <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    onAdicionar({
      descricao,
      valor: valorNumero,
      categorias: categoriasSelecionadas.join(','),
      pessoa,
      mes,
      ano,
    });

    // Limpar formulário
    setDescricao('');
    setValor('');
    setCategoriasSelecionadas([]);
    setPessoa('');
  };

  const toggleCategoria = (categoria: string) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria]
    );
  };

  return (
    <div className="adicionar-gasto">
      <h2>➕ Adicionar Novo Gasto</h2>
      <form onSubmit={handleSubmit} className="gasto-form">
        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <input
            type="text"
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Pizza"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="valor">Valor (R$):</label>
          <input
            type="text"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex: 35.00"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Categorias (múltipla escolha):</label>
          <div className="categorias-grid">
            {CATEGORIAS.map((categoria) => (
              <label key={categoria} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(categoria)}
                  onChange={() => toggleCategoria(categoria)}
                />
                <span>{categoria}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pessoa">Quem fez a compra:</label>
          <select
            id="pessoa"
            value={pessoa}
            onChange={(e) => setPessoa(e.target.value)}
            className="form-input"
          >
            <option value="">Selecione...</option>
            {PESSOAS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Adicionar Gasto
        </button>
      </form>
    </div>
  );
};

export default AdicionarGasto;


import React, { useState } from 'react';
import './AdicionarGasto.css';

const CATEGORIAS = [
  'Coisas de Casa',
  'Alimentação',
  'Besteira',
  'Viagens',
  'Outros'
];

const PESSOAS = ['Daniel', 'Douglas', 'Casa'];

interface AdicionarGastoProps {
  onAdicionar: (gasto: { descricao: string; valor: number; categoria: string; pessoa: string }) => void;
}

const AdicionarGasto: React.FC<AdicionarGastoProps> = ({ onAdicionar }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [pessoa, setPessoa] = useState(PESSOAS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !categoria || !pessoa) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    onAdicionar({ descricao, valor: parseFloat(valor), categoria, pessoa });
    setDescricao('');
    setValor('');
  };

  return (
    <form className="adicionar-gasto-form" onSubmit={handleSubmit}>
      <h3>Adicionar Compra</h3>
      <div className="form-group">
        <label>Descrição</label>
        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Compras no mercado" />
      </div>
      <div className="form-group">
        <label>Valor</label>
        <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 150.75" />
      </div>
      <div className="form-group">
        <label>Tipo</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Quem Comprou</label>
        <select value={pessoa} onChange={(e) => setPessoa(e.target.value)}>
          {PESSOAS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <button type="submit" className="btn-primary">Adicionar</button>
    </form>
  );
};

export default AdicionarGasto;

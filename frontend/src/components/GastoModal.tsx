import React from 'react';
import './GastoModal.css';

interface GastoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gasto: any) => void;
  gastoInicial?: any;
}

const CATEGORIAS = ['Alimentação', 'Transporte', 'Casa', 'Lazer', 'Outros'];
const PESSOAS = ['Douglas', 'Daniel', 'Casa', 'Outros'];

const GastoModal: React.FC<GastoModalProps> = ({ isOpen, onClose, onSave, gastoInicial }) => {
  const [gasto, setGasto] = React.useState(gastoInicial || {});

  React.useEffect(() => {
    // When modal opens for a new expense, pre-fill if there's a selected user
    // Otherwise, when editing, load the expense as is.
    if (!gastoInicial) {
      setGasto({});
    } else {
      setGasto(gastoInicial);
    }
  }, [gastoInicial, isOpen]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setGasto({ ...gasto, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(gasto);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}>×</button>
        <h2>{gasto.id ? 'Editar Gasto' : 'Adicionar Gasto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descrição</label>
            <input type="text" name="descricao" value={gasto.descricao || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Valor</label>
            <input type="number" name="valor" value={gasto.valor || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select name="categoria" value={gasto.categoria || ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Pessoa</label>
            <select name="pessoa" value={gasto.pessoa || ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {PESSOAS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Observação</label>
            <textarea name="observacao" value={gasto.observacao || ''} onChange={handleChange}></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GastoModal;

import { useNavigate } from 'react-router-dom';
import './Choice.css';

export default function Choice() {
  const navigate = useNavigate();
  const user = localStorage.getItem('selectedUser') || 'Convidado';

  const goTo = (path: string) => {
    navigate(path);
  };

  const backToUsers = () => {
    localStorage.removeItem('selectedUser');
    navigate('/');
  };

  return (
    <div className="choice-page">
      <button className="btn-back" onClick={backToUsers}>← Voltar</button>
      <h2>Usuário: {user}</h2>
      <h3>O que deseja ver?</h3>
      <div className="choice-buttons">
        <button className="btn" onClick={() => goTo('/frequencia')}>Frequencia</button>
        <button className="btn" onClick={() => goTo('/fatura')}>Fatura</button>
      </div>
    </div>
  );
}

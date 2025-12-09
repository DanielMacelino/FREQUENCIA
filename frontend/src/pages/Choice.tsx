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
      <header className="choice-header">
        <button className="btn-back" onClick={backToUsers}>← Voltar</button>
        <h2 className="user-greeting">Usuário: {user}</h2>
      </header>
      <main className="choice-main">
        <h3 className="section-title">O que deseja ver?</h3>
        <div className="choice-buttons">
          <button className="btn-choice" onClick={() => goTo('/frequencia')}>
            <span className="icon">📅</span>
            <span>Frequência</span>
          </button>
          <button className="btn-choice" onClick={() => goTo('/fatura')}>
            <span className="icon">📄</span>
            <span>Fatura</span>
          </button>
        </div>
      </main>
    </div>
  );
}

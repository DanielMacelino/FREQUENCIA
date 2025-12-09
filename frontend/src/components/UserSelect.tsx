import { useNavigate } from 'react-router-dom';
import './UserSelect.css';
import { useAppContext } from '../context/AppContext';

const users = ['Daniel', 'douglas', 'Convidado 1'];

export default function UserSelect() {
  const navigate = useNavigate();
  const { setSelectedUser } = useAppContext();

  const handleSelect = (user: string) => {
    // Atualiza via contexto para manter estado reativo em toda a app
    setSelectedUser(user);
    navigate('/choice');
  };

  return (
    <div className="user-select">
      <h1>Selecione o usuário</h1>
      <div className="user-list">
        {users.map((u) => (
          <button key={u} className="user-btn" onClick={() => handleSelect(u)}>
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}

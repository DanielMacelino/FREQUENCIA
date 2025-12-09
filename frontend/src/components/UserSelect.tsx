import { useNavigate } from 'react-router-dom';
import './UserSelect.css';

const users = ['Daniel', 'douglas', 'Convidado 1'];

export default function UserSelect() {
  const navigate = useNavigate();

  const handleSelect = (user: string) => {
    localStorage.setItem('selectedUser', user);
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

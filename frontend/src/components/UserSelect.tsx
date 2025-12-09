import { useNavigate } from 'react-router-dom';
import './UserSelect.css';
import { useAppContext } from '../context/AppContext';

const users = ['Daniel', 'douglas', 'Convidado 1'];

export default function UserSelect() {
  const navigate = useNavigate();
  const { setSelectedUser } = useAppContext();

  const handleSelect = (user: string) => {
    setSelectedUser(user);
    navigate('/choice');
  };

  return (
    <div className="user-select-container">
      <div className="user-select-card">
        <h1 className="user-select-title">Quem está usando?</h1>
        <div className="user-list">
          {users.map((user) => (
            <button 
              key={user} 
              className="user-btn" 
              onClick={() => handleSelect(user)}
            >
              <span className="user-avatar">{user.charAt(0)}</span>
              <span className="user-name">{user}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

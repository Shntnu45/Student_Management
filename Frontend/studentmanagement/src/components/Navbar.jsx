import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onToggle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar d-flex align-items-center justify-content-between px-4">
      <button className="btn btn-link text-dark p-0" onClick={onToggle}>
        <i className="bi bi-list fs-4" />
      </button>
      <div className="d-flex align-items-center gap-3">
        <span className="topbar-user">
          <i className="bi bi-person-circle me-1" />
          Admin
        </span>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1" />
          Logout
        </button>
      </div>
    </header>
  );
}

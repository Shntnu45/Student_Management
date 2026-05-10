import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/students', icon: 'bi-people-fill', label: 'Students' },
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`sidebar d-flex flex-column${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-brand">
        <i className="bi bi-mortarboard-fill me-2" />
        {!collapsed && <span>EduAdmin</span>}
      </div>
      <nav className="sidebar-nav flex-grow-1">
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className={`bi ${icon}`} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {!collapsed && <small className="text-muted">v1.0.0</small>}
      </div>
    </aside>
  );
}

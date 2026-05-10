import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-shell${collapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} />
      <div className="main-area d-flex flex-column">
        <Navbar onToggle={() => setCollapsed((c) => !c)} />
        <main className="content-area flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export default function UserLayout() {
  useEffect(() => {
    // Garante que o scroll comece no topo ao trocar de rota interna do portal
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="user-app-container">
      <div className="user-app-mobile-view">
        <Outlet />
      </div>
    </div>
  );
}

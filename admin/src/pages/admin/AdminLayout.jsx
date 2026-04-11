import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'guia2025';

export default function AdminLayout() {
  const [logado, setLogado] = useState(() => localStorage.getItem('admin_logado') === 'true');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogin(e) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem('admin_logado', 'true');
      setLogado(true);
      navigate('/admin/dashboard');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_logado');
    setLogado(false);
  }

  if (!logado) return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📍</div>
        <h1>Guia da Cidade</h1>
        <p>Painel Administrativo</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Usuário</label>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin" required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••" required />
          </div>
          {erro && <p className="erro">{erro}</p>}
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>📍</span>
          <div>
            <div className="sidebar-title">Guia da Cidade</div>
            <div className="sidebar-sub">Admin</div>
          </div>
        </div>
        <nav>
          <button 
            className={`nav-btn ${location.pathname.includes('/dashboard') ? 'active' : ''}`} 
            onClick={() => navigate('/admin/dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${location.pathname.includes('/prestadores') ? 'active' : ''}`} 
            onClick={() => navigate('/admin/prestadores')}
          >
            👷 Prestadores
          </button>
        </nav>
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

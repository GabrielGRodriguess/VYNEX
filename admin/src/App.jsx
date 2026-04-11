import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/Dashboard';
import Prestadores from './pages/Prestadores';
import UserLayout from './pages/user/UserLayout';
import UserHome from './pages/user/Home';
import PrestadoresList from './pages/user/PrestadoresList';
import Perfil from './pages/user/Perfil';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Padrão - Redireciona para o Portal do Usuário */}
        <Route path="/" element={<Navigate to="/user" replace />} />

        {/* Portal do Usuário (Simulação Mobile) */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="prestadores/:cidadeId/:categoriaId" element={<PrestadoresList />} />
          <Route path="prestador/:prestadorId" element={<Perfil />} />
        </Route>

        {/* Painel Administrativo */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="prestadores" element={<Prestadores />} />
        </Route>

        {/* 404 - Redireciona para o Início */}
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </Router>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Search, MapPin, Wrench, AlertCircle } from 'lucide-react';

const ICONS = {
  'Eletricista': '⚡', 'Encanador': '🔧', 'Pedreiro': '🏗️',
  'Pintor': '🎨', 'Diarista': '🧹', 'Mecânico': '🔩',
  'Chaveiro': '🔑', 'Jardineiro': '🌿', 'Desentupidora': '🚿',
  'Assistência Técnica': '🛠️',
};

export default function UserHome() {
  const [cidades, setCidades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Guia da Cidade | Início";
    async function fetchData() {
      try {
        setLoading(true);
        const { data: cData, error: cErr } = await supabase.from('cidades').select('*').eq('ativo', true).order('nome');
        if (cErr) throw cErr;
        
        const { data: catData, error: catErr } = await supabase.from('categorias').select('*').order('nome');
        if (catErr) throw catErr;

        setCidades(cData || []);
        setCategorias(catData || []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Não foi possível conectar ao banco de dados. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="user-loading">Carregando informações...</div>;

  if (error) {
    return (
      <div className="user-screen empty-state">
        <AlertCircle size={48} color="#C62828" />
        <p>{error}</p>
        <button className="btn-add" onClick={() => window.location.reload()}>Tentar Novamente</button>
      </div>
    );
  }

  if (!cidadeSelecionada) {
    return (
      <div className="user-screen">
        <div className="user-header">
          <h1>📍 Guia da Cidade</h1>
          <p>Selecione sua cidade para ver prestadores</p>
        </div>
        <div className="user-content">
          {cidades.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma cidade cadastrada no momento.</p>
            </div>
          ) : (
            cidades.map(c => (
              <button key={c.id} className="user-card" onClick={() => {
                setCidadeSelecionada(c);
                document.title = `Guia da Cidade | ${c.nome}`;
              }}>
                <div>
                  <strong>📍 {c.nome}</strong>
                  <span>{c.estado}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  const catFiltradas = categorias.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="user-screen">
      <div className="user-header compact">
        <div className="flex-row">
          <button className="back-btn" onClick={() => setCidadeSelecionada(null)}>⬅</button>
          <h2>📍 {cidadeSelecionada.nome}</h2>
        </div>
      </div>
      <div className="user-search-box">
        <div className="search-input-wrapper">
          <Search size={20} color="#888" />
          <input 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)} 
            placeholder="Buscar categoria..." 
          />
        </div>
      </div>
      
      <div className="user-content grid-content">
        {catFiltradas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma categoria encontrada.</p>
          </div>
        ) : (
          catFiltradas.map(cat => (
            <button 
              key={cat.id} 
              className="user-grid-card"
              onClick={() => navigate(`/user/prestadores/${cidadeSelecionada.id}/${cat.id}`)}
            >
              <span className="icon-large">{ICONS[cat.nome] || '🔧'}</span>
              <strong>{cat.nome}</strong>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

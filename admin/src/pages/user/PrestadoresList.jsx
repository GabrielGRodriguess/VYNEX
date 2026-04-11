import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Search, ChevronLeft, Star, AlertCircle } from 'lucide-react';

export default function PrestadoresList() {
  const { cidadeId, categoriaId } = useParams();
  const navigate = useNavigate();
  const [prestadores, setPrestadores] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState({ cidade: '', categoria: '' });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // 1. Info
        const { data: cid } = await supabase.from('cidades').select('nome').eq('id', cidadeId).single();
        const { data: cat } = await supabase.from('categorias').select('nome').eq('id', categoriaId).single();
        setInfo({ cidade: cid?.nome || 'Cidade', categoria: cat?.nome || 'Profissionais' });
        document.title = `Guia | ${cat?.nome || 'Profissionais'} em ${cid?.nome || 'Cidade'}`;

        // 2. Destaques gerais da cidade
        const { data: dest } = await supabase.from('prestadores')
          .select('*, categoria:categorias(nome)')
          .eq('cidade_id', cidadeId)
          .eq('premium', true)
          .limit(5);
        setDestaques(dest || []);

        // 3. Prestadores da categoria
        const { data: prest } = await supabase.from('prestadores')
          .select('*')
          .eq('cidade_id', cidadeId)
          .eq('categoria_id', categoriaId)
          .eq('ativo', true)
          .order('premium', { ascending: false })
          .order('cliques_whatsapp', { ascending: false });
        
        setPrestadores(prest || []);
      } catch (err) {
        console.error("Erro ao carregar profissionais:", err);
        setError("Erro ao buscar profissionais.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [cidadeId, categoriaId]);

  if (loading) return <div className="user-loading">Buscando profissionais...</div>;

  if (error) return (
    <div className="user-screen empty-state">
      <AlertCircle size={40} color="#888" />
      <p>{error}</p>
      <button className="back-btn" style={{color: '#1565C0'}} onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );

  const filtrados = prestadores.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (p.descricao && p.descricao.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="user-screen bg-gray">
      <div className="user-header compact">
        <div className="flex-row">
          <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
          <h2>{info.categoria} <span className="subtitle-sm">em {info.cidade}</span></h2>
        </div>
      </div>

      <div className="user-search-box">
        <div className="search-input-wrapper">
          <Search size={18} color="#888" />
          <input 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)} 
            placeholder="Buscar nome ou detalhe..." 
          />
        </div>
      </div>

      {destaques.length > 0 && busca === '' && (
        <div className="vip-carousel-wrapper">
          <h3 className="section-title">⭐ Em Destaque</h3>
          <div className="vip-carousel">
            {destaques.map(d => (
              <button 
                key={d.id} 
                className="vip-card"
                onClick={() => navigate(`/user/prestador/${d.id}`)}
              >
                <div className="vip-badge">PREMIUM</div>
                <strong>{d.nome}</strong>
                <span>{d.categoria?.nome}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="user-content">
        <h3 className="section-title">Resultados ({filtrados.length})</h3>
        
        {filtrados.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>Nenhum profissional encontrado</p>
          </div>
        ) : (
          filtrados.map(p => (
            <button key={p.id} className={`list-card ${p.premium ? 'premium' : ''}`} onClick={() => navigate(`/user/prestador/${p.id}`)}>
              {p.premium && <div className="badge-small">⭐ DESTAQUE</div>}
              <strong>{p.nome}</strong>
              <p className="desc-lines">{p.descricao}</p>
              <div className="stats-row">
                <span className="stat">📞 {p.cliques_whatsapp} contatos</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

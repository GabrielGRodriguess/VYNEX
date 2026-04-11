import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Phone, ArrowLeft, MessageCircle } from 'lucide-react';

export default function Perfil() {
  const { prestadorId } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await supabase.from('prestadores')
          .select('*, cidade:cidades(nome)')
          .eq('id', prestadorId)
          .single();
        
        if (data) {
          setP(data);
          document.title = `Perfil | ${data.nome}`;
          // Atualiza views
          await supabase.from('prestadores').update({ visualizacoes: (data.visualizacoes || 0) + 1 }).eq('id', data.id);
        }
      } catch(e) {
        console.error("Erro ao carregar perfil:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [prestadorId]);

  async function handleWhatsApp() {
    try {
      if (p.cidade_id) {
        await supabase.rpc('registrar_lead', { p_prestador_id: p.id, p_cidade_id: p.cidade_id });
        // update local state
        setP(prev => ({...prev, cliques_whatsapp: (prev.cliques_whatsapp || 0) + 1}));
      }
    } catch(e) { console.error('Erro ao salvar lead', e); }

    const tel = p.telefone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá, encontrei você pelo Guia da Cidade e gostaria de um orçamento!`);
    window.open(`https://wa.me/55${tel}?text=${msg}`, '_blank');
  }

  if (loading) return <div className="user-loading">Carregando profissional...</div>;
  if (!p) return <div className="user-screen empty-state"><p>Profissional não encontrado.</p></div>;

  return (
    <div className="user-screen bg-gray flex-col h-full">
      <div className="profile-header">
        <button className="back-btn back-abs" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <div className="avatar">
          {p.nome.charAt(0).toUpperCase()}
        </div>
        {p.premium && <div className="badge-prof">⭐ PROFISSIONAL DESTAQUE</div>}
        <h2>{p.nome}</h2>
      </div>

      <div className="profile-content flex-1">
        <div className="card-section">
          <h3>Sobre</h3>
          <p>{p.descricao || 'Este profissional ainda não adicionou uma descrição.'}</p>
        </div>

        <div className="stats-dash">
          <div className="stat-card">
            <strong>{p.cliques_whatsapp || 0}</strong>
            <span>Contatos WhatsApp</span>
          </div>
          <div className="stat-card">
            <strong>{p.visualizacoes || 0}</strong>
            <span>Visualizações</span>
          </div>
        </div>

        <div className="card-section">
          <h3>Local de Atendimento</h3>
          <p className="text-gray">📍 {p.cidade?.nome}</p>
        </div>

        <div className="card-section">
          <h3>Telefone de Contato</h3>
          <p className="text-blue">📞 {p.telefone}</p>
        </div>
      </div>

      <div className="profile-footer">
        <button className="btn-whatsapp" onClick={handleWhatsApp}>
          <MessageCircle size={20} style={{marginRight: 8}} />
          Chamar no WhatsApp
        </button>
      </div>
    </div>
  );
}

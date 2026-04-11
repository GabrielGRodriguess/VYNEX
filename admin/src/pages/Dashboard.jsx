import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [metricas, setMetricas] = useState({ prestadores: 0, leads: 0, cliques: 0, premium: 0 })
  const [top, setTop] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const [{ count: totalPrestadores }, { count: totalLeads }, { data: prestData }] = await Promise.all([
        supabase.from('prestadores').select('*', { count: 'exact', head: true }),
        supabase.from('logs_leads').select('*', { count: 'exact', head: true }),
        supabase.from('prestadores').select('nome, cliques_whatsapp, premium').order('cliques_whatsapp', { ascending: false }).limit(5),
      ])
      const premium = prestData?.filter(p => p.premium).length || 0
      const cliques = prestData?.reduce((acc, p) => acc + (p.cliques_whatsapp || 0), 0) || 0
      setMetricas({ prestadores: totalPrestadores || 0, leads: totalLeads || 0, cliques, premium })
      setTop(prestData || [])
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <p>Carregando...</p>

  return (
    <div>
      <h1 className="page-title">📊 Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="icon">👷</span>
          <span className="val">{metricas.prestadores}</span>
          <span className="label">Prestadores Cadastrados</span>
        </div>
        <div className="stat-card">
          <span className="icon">💬</span>
          <span className="val">{metricas.leads}</span>
          <span className="label">Leads Gerados</span>
        </div>
        <div className="stat-card">
          <span className="icon">⭐</span>
          <span className="val">{metricas.premium}</span>
          <span className="label">Prestadores Premium</span>
        </div>
        <div className="stat-card">
          <span className="icon">📞</span>
          <span className="val">{metricas.cliques}</span>
          <span className="label">Cliques no WhatsApp</span>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header"><h2>🏆 Top 5 mais contactados</h2></div>
        <table>
          <thead>
            <tr><th>Prestador</th><th>Contatos</th><th>Status</th></tr>
          </thead>
          <tbody>
            {top.map((p, i) => (
              <tr key={i}>
                <td><strong>{p.nome}</strong></td>
                <td>{p.cliques_whatsapp}</td>
                <td>{p.premium ? <span className="badge-premium">⭐ Premium</span> : <span className="badge-normal">Normal</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

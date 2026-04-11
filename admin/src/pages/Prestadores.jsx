import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const FORM_VAZIO = { nome: '', telefone: '', descricao: '', cidade_id: '', categoria_id: '', premium: false, ativo: true }

export default function Prestadores() {
  const [lista, setLista] = useState([])
  const [cidades, setCidades] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filtroC, setFiltroC] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarTudo()
  }, [filtroC])

  async function carregarTudo() {
    setLoading(true)
    let query = supabase.from('prestadores').select('*, cidades(nome), categorias(nome)').order('premium', { ascending: false }).order('nome')
    if (filtroC) query = query.eq('cidade_id', filtroC)
    const [{ data: p }, { data: c }, { data: cat }] = await Promise.all([
      query,
      supabase.from('cidades').select('*').order('nome'),
      supabase.from('categorias').select('*').order('nome'),
    ])
    setLista(p || [])
    setCidades(c || [])
    setCategorias(cat || [])
    setLoading(false)
  }

  function abrirNovo() { setForm(FORM_VAZIO); setEditId(null); setModal(true) }
  function abrirEditar(p) {
    setForm({ nome: p.nome, telefone: p.telefone, descricao: p.descricao || '', cidade_id: p.cidade_id, categoria_id: p.categoria_id, premium: p.premium, ativo: p.ativo })
    setEditId(p.id); setModal(true)
  }

  async function salvar(e) {
    e.preventDefault()
    const dados = { ...form, cidade_id: Number(form.cidade_id), categoria_id: Number(form.categoria_id) }
    let errorObj = null;
    if (editId) {
      const { error } = await supabase.from('prestadores').update(dados).eq('id', editId)
      errorObj = error
    } else {
      const { error } = await supabase.from('prestadores').insert(dados)
      errorObj = error
    }
    
    if (errorObj) {
      alert("Erro ao salvar: " + errorObj.message)
      console.error(errorObj)
    } else {
      setModal(false)
      carregarTudo()
    }
  }

  async function excluir(id) {
    if (confirm('Excluir este prestador?')) {
      const { error } = await supabase.from('prestadores').delete().eq('id', id)
      if (error) alert("Erro ao excluir: " + error.message)
      carregarTudo()
    }
  }

  return (
    <div>
      <h1 className="page-title">👷 Prestadores</h1>

      <div className="filters">
        <select value={filtroC} onChange={e => setFiltroC(e.target.value)}>
          <option value="">Todas as cidades</option>
          {cidades.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <button className="btn-add" onClick={abrirNovo}>+ Novo Prestador</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>Nome</th><th>Cidade</th><th>Categoria</th><th>Contatos</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#888' }}>Carregando...</td></tr>
            ) : lista.map(p => (
              <tr key={p.id}>
                <td><strong>{p.nome}</strong></td>
                <td>{p.cidades?.nome || '—'}</td>
                <td>{p.categorias?.nome || '—'}</td>
                <td>{p.cliques_whatsapp}</td>
                <td>{p.premium ? <span className="badge-premium">⭐ Premium</span> : <span className="badge-normal">Normal</span>}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-sm btn-edit" onClick={() => abrirEditar(p)}>✏️ Editar</button>
                  <button className="btn-sm btn-delete" onClick={() => excluir(p.id)}>🗑️ Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editId ? '✏️ Editar Prestador' : '+ Novo Prestador'}</h2>
            <form onSubmit={salvar}>
              <div className="form-group"><label>Nome *</label><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required /></div>
              <div className="form-group"><label>Telefone (somente números) *</label><input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} required /></div>
              <div className="form-group"><label>Descrição</label><textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
              <div className="form-group">
                <label>Cidade *</label>
                <select value={form.cidade_id} onChange={e => setForm({ ...form, cidade_id: e.target.value })} required>
                  <option value="">Selecionar...</option>
                  {cidades.map(c => <option key={c.id} value={c.id}>{c.nome} - {c.estado}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Categoria *</label>
                <select value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })} required>
                  <option value="">Selecionar...</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" id="premium" checked={form.premium} onChange={e => setForm({ ...form, premium: e.target.checked })} />
                <label htmlFor="premium">⭐ Marcar como Premium (aparece no topo)</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

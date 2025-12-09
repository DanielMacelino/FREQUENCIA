import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabaseService, configureSupabase } from '../services/supabaseClient';
import './Fatura.css';

export default function Fatura() {
  const navigate = useNavigate();
  const { selectedUser } = useAppContext();
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [gastos, setGastos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase config inputs (runtime)
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.gastos.getByPeriodo(ano, mes);
      setGastos(data || []);
    } catch (err: any) {
      setError(err?.message || String(err));
      setGastos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ano, mes]);

  const back = () => navigate('/choice');

  const handleConfigure = () => {
    if (!supabaseUrl || !supabaseKey) return setError('Informe URL e ANON KEY');
    configureSupabase(supabaseUrl, supabaseKey);
    setError(null);
    load();
  };

  return (
    <div className="fatura-page">
      <button className="btn-back" onClick={back}>← Voltar</button>
      <h2>Fatura</h2>
      <h4>Usuário: {selectedUser || 'Convidado'}</h4>

      <div className="filtro">
        <label>
          Ano:
          <input type="number" value={ano} onChange={(e) => setAno(Number(e.target.value))} />
        </label>
        <label>
          Mês:
          <input type="number" value={mes} onChange={(e) => setMes(Number(e.target.value))} min={1} max={12} />
        </label>
        <button onClick={load} className="btn-primary">Carregar</button>
      </div>

      {error && (
        <div className="error-box">
          <p>{error}</p>
          <p>Se o erro for "Configuração do Supabase ausente", configure abaixo (apenas em dev):</p>
        </div>
      )}

      <div className="config-supabase">
        <input placeholder="Supabase URL" value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} />
        <input placeholder="Supabase ANON KEY" value={supabaseKey} onChange={(e) => setSupabaseKey(e.target.value)} />
        <button onClick={handleConfigure} className="btn-secondary">Salvar Configuração</button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="gastos-list">
          {gastos.length === 0 ? <p>Nenhum gasto neste período.</p> : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Pessoa</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((g: any) => (
                  <tr key={g.id}>
                    <td>{g.id}</td>
                    <td>{g.descricao || g.categoria || '-'}</td>
                    <td>{g.valor}</td>
                    <td>{g.pessoa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

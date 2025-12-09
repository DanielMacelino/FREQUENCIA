import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { supabaseService } from '../services/supabaseClient';
import GastoModal from '../components/GastoModal';
import './Fatura.css';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const getRandomColor = () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;

export default function Fatura() {
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [gastos, setGastos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gastoAtual, setGastoAtual] = useState<any>(null);

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
  }, [ano, mes]);

  const handleSaveGasto = async (gasto: any) => {
    try {
      const gastoToSave = { ...gasto, valor: Number(gasto.valor) };
      if (gastoToSave.id) {
        await supabaseService.gastos.update(gastoToSave.id, gastoToSave);
      } else {
        await supabaseService.gastos.create({ ...gastoToSave, ano, mes });
      }
      load();
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteGasto = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este gasto?')) {
      try {
        await supabaseService.gastos.delete(id);
        load();
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  // KPIs e Dados para Gráficos
  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.valor || 0), 0);
  const gastosPorCategoria = gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + Number(g.valor || 0);
    return acc;
  }, {});
  const gastosPorPessoa = gastos.reduce((acc, g) => {
    acc[g.pessoa] = (acc[g.pessoa] || 0) + Number(g.valor || 0);
    return acc;
  }, {});
  const rankingPessoas = Object.entries(gastosPorPessoa).sort(([, a]: any, [, b]: any) => b - a);

  // Dados do Gráfico de Pizza
  const pieData = {
    labels: Object.keys(gastosPorCategoria),
    datasets: [{
      data: Object.values(gastosPorCategoria),
      backgroundColor: Object.keys(gastosPorCategoria).map(() => getRandomColor()),
      hoverOffset: 4,
    }],
  };

  return (
    <div className="fatura-container">
      <header className="fatura-header">
        <h1>Fatura Mensal</h1>
        <div className="header-controls">
          <input type="month" className="month-picker" value={`${ano}-${mes.toString().padStart(2, '0')}`} onChange={e => {
            const [year, month] = e.target.value.split('-');
            setAno(Number(year));
            setMes(Number(month));
          }} />
          <button className="btn-add" onClick={() => { setGastoAtual(null); setIsModalOpen(true); }}>Adicionar Gasto</button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-spinner">Carregando...</div>}

      <div className="kpi-bar">
        <div className="kpi-item"><span>Total Gasto</span><strong>{totalGastos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
      </div>

      <main className="fatura-grid">
        <div className="grid-item chart-container">
          <h3>Gastos por Categoria</h3>
          {gastos.length > 0 ? <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p>Sem dados para exibir.</p>}
        </div>

        <div className="grid-item ranking-container">
          <h3>Ranking de Despesas</h3>
          <ul className="ranking-list">
            {rankingPessoas.map(([pessoa, valor]) => (
              <li key={pessoa} className="ranking-item">
                <span>{pessoa}</span>
                <strong>{Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <section className="transactions-section">
        <h3>Todos os Lançamentos</h3>
        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead><tr><th>Descrição</th><th>Valor</th><th>Categoria</th><th>Pessoa</th><th>Data</th><th>Ações</th></tr></thead>
            <tbody>
              {gastos.map(g => (
                <tr key={g.id}>
                  <td>{g.descricao}</td>
                  <td>{Number(g.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>{g.categoria}</td>
                  <td>{g.pessoa}</td>
                  <td>{new Date(g.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="action-buttons">
                    <button className="btn-icon edit" onClick={() => { setGastoAtual(g); setIsModalOpen(true); }}>✏️</button>
                    <button className="btn-icon delete" onClick={() => handleDeleteGasto(g.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <GastoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveGasto} 
        gastoInicial={gastoAtual}
      />
    </div>
  );
}

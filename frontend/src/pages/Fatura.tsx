import { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { supabaseService } from '../services/supabaseClient';
import GastoModal from '../components/GastoModal';
import './Fatura.css';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const getRandomColor = () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;

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
      // Ensure valor is a number before saving
      const gastoToSave = { ...gasto, valor: Number(gasto.valor) };

      if (gastoToSave.id) { // Update
        await supabaseService.gastos.update(gastoToSave.id, gastoToSave);
      } else { // Create
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

  // KPIs
  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.valor || 0), 0);
  const topCategoria = gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + Number(g.valor || 0);
    return acc;
  }, {});
  const topPessoa = gastos.reduce((acc, g) => {
    acc[g.pessoa] = (acc[g.pessoa] || 0) + Number(g.valor || 0);
    return acc;
  }, {});

  const [topCat, topCatValue] = Object.entries(topCategoria).sort((a: any, b: any) => b[1] - a[1])[0] || ['N/A', 0];
  const [topP, topPValue] = Object.entries(topPessoa).sort((a: any, b: any) => b[1] - a[1])[0] || ['N/A', 0];

  // Chart Data
  const pieData = {
    labels: Object.keys(topCategoria),
    datasets: [{
      data: Object.values(topCategoria),
      backgroundColor: Object.keys(topCategoria).map(() => getRandomColor()),
    }],
  };

  const lineData = {
    labels: [...new Set(gastos.map(g => new Date(g.created_at).toLocaleDateString('pt-BR')))].sort((a,b) => a.localeCompare(b)),
    datasets: [{
      label: 'Evolução dos Gastos',
      data: gastos.reduce((acc, g) => {
        const date = new Date(g.created_at).toLocaleDateString('pt-BR');
        acc[date] = (acc[date] || 0) + Number(g.valor || 0);
        return acc;
      }, {}),
      fill: false,
      borderColor: '#4bc0c0',
    }],
  };

  return (
    <div className="fatura-page">
      <header className="fatura-header">
        <h1>Fatura Mensal</h1>
        <div className="header-actions">
          <input type="month" value={`${ano}-${mes.toString().padStart(2, '0')}`} onChange={e => {
            const [year, month] = e.target.value.split('-');
            setAno(Number(year));
            setMes(Number(month));
          }} />
          <button className="btn-primary" onClick={() => { setGastoAtual(null); setIsModalOpen(true); }}>Adicionar Gasto</button>
        </div>
      </header>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>Carregando dados...</p>}

      <section className="kpi-section">
        <div className="kpi-card"><h4>Total Gasto</h4><p>{totalGastos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
        <div className="kpi-card"><h4>Categoria Principal</h4><p>{String(topCat)} ({Number(topCatValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</p></div>
        <div className="kpi-card"><h4>Quem Mais Gastou</h4><p>{String(topP)} ({Number(topPValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</p></div>
      </section>

      <section className="charts-section">
        <div className="chart-card"><h3>Gastos por Categoria</h3>{gastos.length > 0 ? <Pie data={pieData} /> : <p>Sem dados para exibir.</p>}</div>
        <div className="chart-card"><h3>Evolução dos Gastos</h3>{gastos.length > 0 ? <Line data={lineData} />: <p>Sem dados para exibir.</p>}</div>
      </section>

      <section className="table-section">
        <h3>Todos os Lançamentos</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Descrição</th><th>Valor</th><th>Categoria</th><th>Pessoa</th><th>Data</th><th>Ações</th></tr></thead>
            <tbody>
              {gastos.map(g => (
                <tr key={g.id}>
                  <td>{g.descricao}</td>
                  <td>{Number(g.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>{g.categoria}</td>
                  <td>{g.pessoa}</td>
                  <td>{new Date(g.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button className="btn-icon" onClick={() => { setGastoAtual(g); setIsModalOpen(true); }}>✏️</button>
                    <button className="btn-icon" onClick={() => handleDeleteGasto(g.id)}>🗑️</button>
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

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Graficos.css';
import { Estatisticas } from '../types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface GraficosProps {
  estatisticas: Estatisticas;
}

const Graficos: React.FC<GraficosProps> = ({ estatisticas }) => {
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  // Dados para gráfico de pizza (por pessoa)
  const dadosPessoa = {
    labels: estatisticas.porPessoa.map((item) => item.pessoa),
    datasets: [
      {
        label: 'Gastos por Pessoa',
        data: estatisticas.porPessoa.map((item) => item.total),
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(240, 147, 251, 0.8)',
          'rgba(79, 172, 254, 0.8)',
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(240, 147, 251, 1)',
          'rgba(79, 172, 254, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Processar categorias (pode haver múltiplas por gasto)
  const categoriaTotais: { [key: string]: number } = {};
  estatisticas.porCategoria.forEach((item) => {
    const categorias = item.categorias.split(',');
    categorias.forEach((cat) => {
      const categoria = cat.trim();
      categoriaTotais[categoria] = (categoriaTotais[categoria] || 0) + item.total;
    });
  });

  const categoriasArray = Object.entries(categoriaTotais)
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);

  // Dados para gráfico de barras (por categoria)
  const dadosCategoria = {
    labels: categoriasArray.map((item) => item.categoria),
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: categoriasArray.map((item) => item.total),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  const opcoesPizza = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = formatarValor(context.parsed);
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const opcoesBarra = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return formatarValor(context.parsed.y);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatarValor(value);
          },
        },
      },
    },
  };

  return (
    <div className="graficos-container">
      <h2>📊 Análise de Gastos</h2>
      <div className="graficos-grid">
        <div className="grafico-card">
          <h3>Gastos por Pessoa</h3>
          {estatisticas.porPessoa.length > 0 ? (
            <div className="chart-wrapper">
              <Pie data={dadosPessoa} options={opcoesPizza} />
            </div>
          ) : (
            <p className="no-data">Nenhum dado disponível</p>
          )}
        </div>

        <div className="grafico-card">
          <h3>Gastos por Categoria</h3>
          {categoriasArray.length > 0 ? (
            <div className="chart-wrapper">
              <Bar data={dadosCategoria} options={opcoesBarra} />
            </div>
          ) : (
            <p className="no-data">Nenhum dado disponível</p>
          )}
        </div>
      </div>

      <div className="resumo-estatisticas">
        <div className="estatistica-item">
          <span className="estatistica-label">Total Geral:</span>
          <span className="estatistica-valor">
            {formatarValor(estatisticas.totalGeral)}
          </span>
        </div>
        {estatisticas.porPessoa.map((item) => (
          <div key={item.pessoa} className="estatistica-item">
            <span className="estatistica-label">{item.pessoa}:</span>
            <span className="estatistica-valor">{formatarValor(item.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Graficos;


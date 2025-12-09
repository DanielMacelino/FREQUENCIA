import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './FaturaFinal.css';
import { Gasto } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FaturaFinalProps {
  gastos: Gasto[];
}

const FaturaFinal: React.FC<FaturaFinalProps> = ({ gastos }) => {
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  // Calcular totais por pessoa
  const calcularTotalPorPessoa = (pessoa: string): number => {
    return gastos
      .filter((gasto) => gasto.pessoa === pessoa)
      .reduce((sum, gasto) => sum + gasto.valor, 0);
  };

  const totalDaniel = calcularTotalPorPessoa('Daniel');
  const totalDouglas = calcularTotalPorPessoa('Douglas');
  const totalCasa = calcularTotalPorPessoa('Casa');

  // Total = Daniel + Douglas + Casa
  const totalGeral = totalDaniel + totalDouglas + totalCasa;

  // Fatura Final = Total - Douglas
  const faturaFinal = totalGeral - totalDouglas;

  // Dados para o gráfico
  const dadosGrafico = {
    labels: ['Daniel', 'Douglas', 'Casa', 'Total', 'Fatura Final'],
    datasets: [
      {
        label: 'Valores (R$)',
        data: [totalDaniel, totalDouglas, totalCasa, totalGeral, faturaFinal],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)', // Daniel - azul
          'rgba(240, 147, 251, 0.8)', // Douglas - rosa
          'rgba(79, 172, 254, 0.8)',  // Casa - azul claro
          'rgba(255, 193, 7, 0.8)',   // Total - amarelo
          'rgba(46, 213, 115, 0.8)',  // Fatura Final - verde
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(240, 147, 251, 1)',
          'rgba(79, 172, 254, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(46, 213, 115, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const valor = context.parsed.y;
            return formatarValor(valor);
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
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Não mostrar se não houver gastos
  if (gastos.length === 0) {
    return null;
  }

  return (
    <div className="fatura-final">
      <h2>💰 Fatura Final</h2>
      
      <div className="fatura-final-content">
        <div className="fatura-final-calculo">
          <div className="calculo-formula">
            <div className="formula-section">
              <div className="formula-title">Primeiro: Soma Total</div>
              <div className="formula-item">
                <span className="formula-label">Daniel:</span>
                <span className="formula-valor positivo">{formatarValor(totalDaniel)}</span>
              </div>
              <div className="formula-sinal">+</div>
              <div className="formula-item">
                <span className="formula-label">Douglas:</span>
                <span className="formula-valor positivo">{formatarValor(totalDouglas)}</span>
              </div>
              <div className="formula-sinal">+</div>
              <div className="formula-item">
                <span className="formula-label">Casa:</span>
                <span className="formula-valor positivo">{formatarValor(totalCasa)}</span>
              </div>
              <div className="formula-sinal">=</div>
              <div className="formula-item total">
                <span className="formula-label">Total:</span>
                <span className="formula-valor total-valor">{formatarValor(totalGeral)}</span>
              </div>
            </div>

            <div className="formula-divider"></div>

            <div className="formula-section">
              <div className="formula-title">Segundo: Cálculo da Fatura</div>
              <div className="formula-item">
                <span className="formula-label">Total:</span>
                <span className="formula-valor positivo">{formatarValor(totalGeral)}</span>
              </div>
              <div className="formula-sinal">-</div>
              <div className="formula-item">
                <span className="formula-label">Douglas:</span>
                <span className="formula-valor negativo">{formatarValor(totalDouglas)}</span>
              </div>
              <div className="formula-sinal">=</div>
              <div className="formula-resultado">
                <span className="resultado-label">Fatura Final:</span>
                <span className={`resultado-valor ${faturaFinal >= 0 ? 'positivo' : 'negativo'}`}>
                  {formatarValor(faturaFinal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="fatura-final-grafico">
          <h3>Visualização Gráfica</h3>
          <div className="chart-container">
            <Bar data={dadosGrafico} options={opcoesGrafico} />
          </div>
          <div className="grafico-legenda">
            <div className="legenda-item">
              <span className="legenda-color" style={{ backgroundColor: 'rgba(102, 126, 234, 0.8)' }}></span>
              <span>Daniel</span>
            </div>
            <div className="legenda-item">
              <span className="legenda-color" style={{ backgroundColor: 'rgba(240, 147, 251, 0.8)' }}></span>
              <span>Douglas</span>
            </div>
            <div className="legenda-item">
              <span className="legenda-color" style={{ backgroundColor: 'rgba(79, 172, 254, 0.8)' }}></span>
              <span>Casa</span>
            </div>
            <div className="legenda-item">
              <span className="legenda-color" style={{ backgroundColor: 'rgba(255, 193, 7, 0.8)' }}></span>
              <span>Total</span>
            </div>
            <div className="legenda-item">
              <span className="legenda-color" style={{ backgroundColor: 'rgba(46, 213, 115, 0.8)' }}></span>
              <span>Fatura Final</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fatura-final-resumo">
        <div className="resumo-card">
          <span className="resumo-label">Total Daniel:</span>
          <span className="resumo-valor">{formatarValor(totalDaniel)}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Total Douglas:</span>
          <span className="resumo-valor">{formatarValor(totalDouglas)}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Total Casa:</span>
          <span className="resumo-valor">{formatarValor(totalCasa)}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Total Geral:</span>
          <span className="resumo-valor total-geral">{formatarValor(totalGeral)}</span>
        </div>
        <div className="resumo-card destaque">
          <span className="resumo-label">Fatura Final:</span>
          <span className={`resumo-valor ${faturaFinal >= 0 ? 'positivo' : 'negativo'}`}>
            {formatarValor(faturaFinal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FaturaFinal;


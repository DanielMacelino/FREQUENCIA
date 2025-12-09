import React, { useState, useEffect } from 'react';
import './App.css';
import MesSelector from './components/MesSelector';
import FaturaView from './components/FaturaView';
import AdicionarGasto from './components/AdicionarGasto';
import Graficos from './components/Graficos';
import GastosPorPessoa from './components/GastosPorPessoa';
import FaturaFinal from './components/FaturaFinal';
import { Gasto, Estatisticas } from './types';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();
  const isMesAtual = mesSelecionado === mesAtual && anoSelecionado === anoAtual;

  useEffect(() => {
    carregarGastos();
    carregarEstatisticas();
  }, [mesSelecionado, anoSelecionado]);

  const carregarGastos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/gastos/${anoSelecionado}/${mesSelecionado}`);
      const data = await response.json();
      setGastos(data);
    } catch (error) {
      console.error('Erro ao carregar gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await fetch(`${API_URL}/estatisticas/${anoSelecionado}/${mesSelecionado}`);
      const data = await response.json();
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleAdicionarGasto = async (novoGasto: Omit<Gasto, 'id' | 'data_criacao'>) => {
    try {
      const response = await fetch(`${API_URL}/gastos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoGasto),
      });

      if (response.ok) {
        await carregarGastos();
        await carregarEstatisticas();
      }
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error);
    }
  };

  const handleDeletarGasto = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/gastos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await carregarGastos();
        await carregarEstatisticas();
      }
    } catch (error) {
      console.error('Erro ao deletar gasto:', error);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>💳 Controle de Fatura</h1>
        <p>Gerenciamento de gastos do cartão compartilhado</p>
      </header>

      <div className="container">
        <MesSelector
          mes={mesSelecionado}
          ano={anoSelecionado}
          onMesChange={setMesSelecionado}
          onAnoChange={setAnoSelecionado}
        />

        {isMesAtual && (
          <AdicionarGasto
            mes={mesSelecionado}
            ano={anoSelecionado}
            onAdicionar={handleAdicionarGasto}
          />
        )}

        {estatisticas && <Graficos estatisticas={estatisticas} />}

        <GastosPorPessoa
          gastos={gastos}
          isMesAtual={isMesAtual}
          onDeletar={handleDeletarGasto}
        />

        <FaturaFinal gastos={gastos} />

        <FaturaView
          gastos={gastos}
          loading={loading}
          isMesAtual={isMesAtual}
          onDeletar={handleDeletarGasto}
        />
      </div>
    </div>
  );
}

export default App;


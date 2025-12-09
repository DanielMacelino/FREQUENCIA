import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import MesSelector from './components/MesSelector';
import FaturaView from './components/FaturaView';
import AdicionarGasto from './components/AdicionarGasto';
import Graficos from './components/Graficos';
import GastosPorPessoa from './components/GastosPorPessoa';
import FaturaFinal from './components/FaturaFinal';
import { Gasto, Estatisticas } from './types';
import { supabaseService } from './supabaseClient';

function App() {
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();
  const isMesAtual = mesSelecionado === mesAtual && anoSelecionado === anoAtual;

  const carregarGastos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supabaseService.gastos.getByPeriodo(anoSelecionado, mesSelecionado);
      setGastos(data);
    } finally {
      setLoading(false);
    }
  }, [anoSelecionado, mesSelecionado]);

  const carregarEstatisticas = useCallback(async () => {
    try {
      const data = await supabaseService.gastos.getEstatisticas(anoSelecionado, mesSelecionado);
      setEstatisticas(data);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao carregar estatísticas:', err);
      }
    }
  }, [anoSelecionado, mesSelecionado]);

  useEffect(() => {
    carregarGastos();
    carregarEstatisticas();
  }, [carregarGastos, carregarEstatisticas]);

  const handleAdicionarGasto = async (novoGasto: Omit<Gasto, 'id' | 'data_criacao'>) => {
    try {
      await supabaseService.gastos.create({
        ...novoGasto,
        mes: mesSelecionado,
        ano: anoSelecionado,
      });

      await carregarGastos();
      await carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error);
    }
  };

  const handleDeletarGasto = async (id: number) => {
    try {
      await supabaseService.gastos.delete(id);
      await carregarGastos();
      await carregarEstatisticas();
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


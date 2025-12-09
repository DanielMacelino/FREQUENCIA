import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseClient';
import { Frequencia, PeriodoResponse } from '../services/api';
import { format, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const selectedUser = typeof window !== 'undefined' ? (localStorage.getItem('selectedUser') || '') : '';
  const [frequencias, setFrequencias] = useState<Frequencia[]>([]);
  const [periodoData, setPeriodoData] = useState<PeriodoResponse | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingFrequencia, setEditingFrequencia] = useState<Frequencia | null>(null);
  const [formData, setFormData] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    horas: '',
    atividade: '',
    observacao: '',
  });
  const [loading, setLoading] = useState(false);

  const ano = currentDate.getFullYear();
  const mes = currentDate.getMonth() + 1;

  useEffect(() => {
    loadFrequencias();
  }, [ano, mes]);

  const loadFrequencias = async () => {
    try {
      setLoading(true);
      if (!selectedUser) {
        alert('Usuário não selecionado');
        return;
      }
      
      const data = await supabaseService.frequencia.getByPeriodo(ano, mes, selectedUser);
      const totalHoras = await supabaseService.frequencia.getTotalHoras(ano, mes, selectedUser);
      
      const dataInicio = new Date(ano, mes - 1, 20);
      const proximoMes = mes === 12 ? 1 : mes + 1;
      const proximoAno = mes === 12 ? ano + 1 : ano;
      const dataFim = new Date(proximoAno, proximoMes - 1, 19);
      
      setPeriodoData({
        frequencias: data,
        periodo: {
          dataInicio: format(dataInicio, 'yyyy-MM-dd'),
          dataFim: format(dataFim, 'yyyy-MM-dd'),
        },
        totalHoras,
      });
      setFrequencias(data);
    } catch (error) {
      console.error('Erro ao carregar frequências:', error);
      alert('Erro ao carregar frequências');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!selectedUser) {
        alert('Usuário não selecionado');
        return;
      }

      const frequenciaData = {
        data: formData.data,
        horas: parseFloat(formData.horas),
        atividade: formData.atividade,
        observacao: formData.observacao,
        ano,
        mes,
      };

      if (editingFrequencia) {
        await supabaseService.frequencia.update(editingFrequencia.id!, frequenciaData);
      } else {
        await supabaseService.frequencia.create(frequenciaData, selectedUser);
      }
      
      setShowModal(false);
      setEditingFrequencia(null);
      resetForm();
      loadFrequencias();
    } catch (error: any) {
      console.error('Erro ao salvar frequência:', error);
      const errorMessage = error?.message || 'Erro ao salvar frequência';
      alert(`Erro ao salvar frequência: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (frequencia: Frequencia) => {
    setEditingFrequencia(frequencia);
    setFormData({
      data: frequencia.data,
      horas: frequencia.horas.toString(),
      atividade: frequencia.atividade,
      observacao: frequencia.observacao || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta frequência?')) return;
    try {
      setLoading(true);
      await supabaseService.frequencia.delete(id);
      loadFrequencias();
    } catch (error) {
      console.error('Erro ao deletar frequência:', error);
      alert('Erro ao deletar frequência');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      data: format(new Date(), 'yyyy-MM-dd'),
      horas: '',
      atividade: '',
      observacao: '',
    });
  };

  const openModal = () => {
    resetForm();
    setEditingFrequencia(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFrequencia(null);
    resetForm();
  };

  // Calcular período: dia 20 ao dia 19 do próximo mês
  const getPeriodoDates = () => {
    const anoAtual = currentDate.getFullYear();
    const mesAtual = currentDate.getMonth() + 1;
    
    const dataInicio = new Date(anoAtual, mesAtual - 1, 20);
    const proximoMes = mesAtual === 12 ? 1 : mesAtual + 1;
    const proximoAno = mesAtual === 12 ? anoAtual + 1 : anoAtual;
    const dataFim = new Date(proximoAno, proximoMes - 1, 19);
    
    return { dataInicio, dataFim };
  };

  const { dataInicio, dataFim } = getPeriodoDates();
  const diasPeriodo = eachDayOfInterval({ start: dataInicio, end: dataFim });

  const getFrequenciaByDate = (date: Date) => {
    return frequencias.find(f => isSameDay(parseISO(f.data), date));
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const backToChoice = () => {
    navigate('/choice');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <div>
              <h1>Sistema de Frequência - PET Saúde Digital</h1>
              {selectedUser && <div style={{fontSize: 14, color: '#666'}}>Usuário: {selectedUser}</div>}
            </div>
            <div style={{display: 'flex', gap: '8px'}}>
              <button className="btn-primary" onClick={openModal}>
                <span>+</span> Nova Frequência
              </button>
              <button className="btn-secondary" onClick={backToChoice} style={{padding: '8px 12px'}}>
                ← Voltar
              </button>
            </div>
          </div>
        </header>

        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total de Horas</h3>
            <p className="stat-value">{periodoData?.totalHoras || '0.00'}h</p>
          </div>
          <div className="stat-card">
            <h3>Registros</h3>
            <p className="stat-value">{frequencias.length}</p>
          </div>
          <div className="stat-card stat-card-periodo">
            <h3>Período Atual</h3>
            <p className="stat-value stat-value-periodo">
              {format(dataInicio, 'dd/MM')} - {format(dataFim, 'dd/MM/yyyy')}
            </p>
          </div>
        </div>

        <div className="calendar-section">
          <div className="calendar-header">
            <button className="btn-nav" onClick={() => changeMonth(-1)}>←</button>
            <h2>{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</h2>
            <button className="btn-nav" onClick={() => changeMonth(1)}>→</button>
          </div>

          <div className="calendar-grid">
            {diasPeriodo.map((dia) => {
              const frequencia = getFrequenciaByDate(dia);
              const isToday = isSameDay(dia, new Date());
              
              return (
                <div
                  key={dia.toISOString()}
                  className={`calendar-day ${frequencia ? 'has-frequency' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => {
                    if (frequencia) {
                      handleEdit(frequencia);
                    } else {
                      setFormData(prev => ({ ...prev, data: format(dia, 'yyyy-MM-dd') }));
                      openModal();
                    }
                  }}
                >
                  <div className="day-number">{format(dia, 'd')}</div>
                  {frequencia && (
                    <div className="day-info">
                      <span className="day-hours">{frequencia.horas}h</span>
                      <span className="day-activity">{frequencia.atividade}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="list-section">
          <h2>Listagem de Frequências</h2>
          {loading && <p>Carregando...</p>}
          {!loading && frequencias.length === 0 && (
            <p className="empty-state">Nenhuma frequência registrada neste período</p>
          )}
          {!loading && frequencias.length > 0 && (
            <div className="frequencias-list">
              {frequencias.map((freq) => (
                <div key={freq.id} className="frequencia-item">
                  <div className="frequencia-main">
                    <div className="frequencia-date">
                      {format(parseISO(freq.data), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    <div className="frequencia-hours">{freq.horas}h</div>
                    <div className="frequencia-activity">{freq.atividade}</div>
                    {freq.observacao && (
                      <div className="frequencia-obs">{freq.observacao}</div>
                    )}
                  </div>
                  <div className="frequencia-actions">
                    <button className="btn-edit" onClick={() => handleEdit(freq)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(freq.id!)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingFrequencia ? 'Editar' : 'Nova'} Frequência</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Horas</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.horas}
                  onChange={(e) => setFormData({ ...formData, horas: e.target.value })}
                  placeholder="Ex: 4.5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Atividade</label>
                <input
                  type="text"
                  value={formData.atividade}
                  onChange={(e) => setFormData({ ...formData, atividade: e.target.value })}
                  placeholder="Descreva a atividade realizada"
                  required
                />
              </div>
              <div className="form-group">
                <label>Observação (opcional)</label>
                <textarea
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Observações adicionais"
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;


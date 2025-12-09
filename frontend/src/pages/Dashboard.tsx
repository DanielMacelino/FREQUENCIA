import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { frequenciaService, Frequencia } from '../services/api';
import { Header } from '../components/Header';
import { useAppContext } from '../context/AppContext';
import { format, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './Dashboard.css';

interface FormData {
  data: string;
  horas: string;
  atividade: string;
  observacao: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const { selectedUser } = useAppContext();
  const [frequencias, setFrequencias] = useState<Frequencia[]>([]);
  const [totalHoras, setTotalHoras] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingFrequencia, setEditingFrequencia] = useState<Frequencia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    data: format(new Date(), 'yyyy-MM-dd'),
    horas: '',
    atividade: '',
    observacao: '',
  });

  const ano = currentDate.getFullYear();
  const mes = currentDate.getMonth() + 1;

  const loadFrequencias = useCallback(async () => {
    if (!selectedUser) {
      setError('Usuário não selecionado. Volte e selecione um usuário.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await frequenciaService.getByPeriodo(ano, mes, selectedUser);
      
      if (data && data.frequencias) {
        setFrequencias(data.frequencias);
        setTotalHoras(parseFloat(data.totalHoras) || 0);
      } else {
        setFrequencias([]);
        setTotalHoras(0);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar frequências';
      setError(message);
      setFrequencias([]);
      setTotalHoras(0);
    } finally {
      setLoading(false);
    }
  }, [ano, mes, selectedUser]);

  useEffect(() => {
    loadFrequencias();
  }, [loadFrequencias]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Usuário não selecionado');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const frequenciaData = {
        data: formData.data,
        horas: parseFloat(formData.horas),
        atividade: formData.atividade,
        observacao: formData.observacao,
        user: selectedUser,
      };

      if (editingFrequencia?.id) {
        await frequenciaService.update(editingFrequencia.id, frequenciaData);
      } else {
        await frequenciaService.create(frequenciaData);
      }

      closeModal();
      loadFrequencias();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar frequência';
      setError(message);
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
      setError(null);
      await frequenciaService.delete(id);
      loadFrequencias();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar frequência';
      setError(message);
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

  const closeModal = () => {
    setShowModal(false);
    setEditingFrequencia(null);
    resetForm();
  };

  const getPeriodoDates = () => {
    const dataInicio = new Date(ano, mes - 1, 20);
    const proximoMes = mes === 12 ? 1 : mes + 1;
    const proximoAno = mes === 12 ? ano + 1 : ano;
    const dataFim = new Date(proximoAno, proximoMes - 1, 19);
    return { dataInicio, dataFim };
  };

  const { dataInicio, dataFim } = getPeriodoDates();
  const diasPeriodo = eachDayOfInterval({ start: dataInicio, end: dataFim });

  const getFrequenciaByDate = (date: Date) => {
    return frequencias.find((f) => isSameDay(parseISO(f.data), date));
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleBackClick = () => {
    navigate('/choice');
  };

  if (!selectedUser) {
    return (
      <div className="dashboard-error">
        <Header title="Frequência" showBackButton onBack={handleBackClick} />
        <div className="error-message-box">
          <p>Usuário não selecionado. Volte e escolha um usuário.</p>
          <button onClick={handleBackClick} className="btn-primary">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header
        title="Sistema de Frequência"
        subtitle={`Usuário: ${selectedUser}`}
        showBackButton
        onBack={handleBackClick}
      />

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="alert-close">
            ✕
          </button>
        </div>
      )}

      <div className="dashboard-container">
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total de Horas</h3>
            <p className="stat-value">{totalHoras.toFixed(2)}h</p>
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
            <button className="btn-nav" onClick={() => changeMonth(-1)} disabled={loading}>
              ←
            </button>
            <h2>{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</h2>
            <button className="btn-nav" onClick={() => changeMonth(1)} disabled={loading}>
              →
            </button>
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
                      setFormData((prev) => ({
                        ...prev,
                        data: format(dia, 'yyyy-MM-dd'),
                      }));
                      setShowModal(true);
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
          <div className="list-header">
            <h2>Frequências do Período</h2>
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              + Nova Frequência
            </button>
          </div>

          {loading && <p className="loading-text">Carregando...</p>}

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
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(freq)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => freq.id && handleDelete(freq.id)}
                      disabled={loading}
                    >
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
            <div className="modal-header">
              <h2>{editingFrequencia ? 'Editar' : 'Nova'} Frequência</h2>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="data">Data *</label>
                <input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="horas">Horas *</label>
                <input
                  id="horas"
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.horas}
                  onChange={(e) =>
                    setFormData({ ...formData, horas: e.target.value })
                  }
                  placeholder="Ex: 4.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="atividade">Atividade *</label>
                <input
                  id="atividade"
                  type="text"
                  value={formData.atividade}
                  onChange={(e) =>
                    setFormData({ ...formData, atividade: e.target.value })
                  }
                  placeholder="Descreva a atividade"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="observacao">Observação</label>
                <textarea
                  id="observacao"
                  value={formData.observacao}
                  onChange={(e) =>
                    setFormData({ ...formData, observacao: e.target.value })
                  }
                  placeholder="Observações adicionais"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
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

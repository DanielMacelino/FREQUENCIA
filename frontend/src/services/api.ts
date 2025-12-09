import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Frequencia {
  id?: number;
  data: string;
  horas: number;
  atividade: string;
  observacao?: string;
  created_at?: string;
  user?: string;
}

export interface PeriodoResponse {
  frequencias: Frequencia[];
  periodo: {
    dataInicio: string;
    dataFim: string;
  };
  totalHoras: string;
}

export const frequenciaService = {
  getAll: async (): Promise<Frequencia[]> => {
    const response = await api.get<Frequencia[]>('/frequencias');
    return response.data;
  },

  getByPeriodo: async (ano: number, mes: number, user: string): Promise<PeriodoResponse> => {
    const response = await api.get<PeriodoResponse>(`/frequencias/periodo/${ano}/${mes}?user=${user}`);
    return response.data;
  },

  getById: async (id: number): Promise<Frequencia> => {
    const response = await api.get<Frequencia>(`/frequencias/${id}`);
    return response.data;
  },

  create: async (frequencia: Omit<Frequencia, 'id' | 'created_at'>): Promise<Frequencia> => {
    const response = await api.post<Frequencia>('/frequencias', frequencia);
    return response.data;
  },

  update: async (id: number, frequencia: Partial<Frequencia>): Promise<Frequencia> => {
    const response = await api.put<Frequencia>(`/frequencias/${id}`, frequencia);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/frequencias/${id}`);
  },

  getStats: async () => {
    const response = await api.get('/frequencias/stats/geral');
    return response.data;
  },
};

export default api;

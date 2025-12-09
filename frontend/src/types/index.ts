// Domain types
export interface User {
  id: string;
  name: string;
}

export interface Frequencia {
  id?: number;
  usuario: string;
  data: string;
  horas: number;
  atividade: string;
  observacao?: string;
  ano: number;
  mes: number;
  created_at?: string;
  updated_at?: string;
}

export interface PeriodoData {
  frequencias: Frequencia[];
  periodo: {
    dataInicio: string;
    dataFim: string;
  };
  totalHoras: number;
}

// API types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface AppContextType {
  selectedUser: string | null;
  setSelectedUser: (user: string) => void;
}

export interface Gasto {
  id: number;
  descricao: string;
  valor: number;
  categorias: string;
  pessoa: string;
  mes: number;
  ano: number;
  data_criacao?: string;
}

export interface Estatisticas {
  porPessoa: Array<{
    pessoa: string;
    total: number;
  }>;
  porCategoria: Array<{
    categorias: string;
    total: number;
  }>;
  totalGeral: number;
}


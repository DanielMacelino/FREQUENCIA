import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase não configuradas. Use .env com REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseService = {
  gastos: {
    getByPeriodo: async (ano: number, mes: number) => {
      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .eq('ano', ano)
        .eq('mes', mes)
        .order('data_criacao', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    create: async (gasto: any) => {
      const { data, error } = await supabase
        .from('gastos')
        .insert([gasto])
        .select();
      
      if (error) throw error;
      return data?.[0];
    },

    delete: async (id: number) => {
      const { error } = await supabase
        .from('gastos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },

    getEstatisticas: async (ano: number, mes: number) => {
      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .eq('ano', ano)
        .eq('mes', mes);
      
      if (error) throw error;

      const gastos = data || [];
      
      const porPessoa: Record<string, number> = {};
      const porCategoria: Record<string, number> = {};
      let totalGeral = 0;

      gastos.forEach((gasto: any) => {
        porPessoa[gasto.pessoa] = (porPessoa[gasto.pessoa] || 0) + gasto.valor;
        porCategoria[gasto.categorias] = (porCategoria[gasto.categorias] || 0) + gasto.valor;
        totalGeral += gasto.valor;
      });

      return {
        porPessoa: Object.entries(porPessoa).map(([pessoa, total]) => ({ pessoa, total })),
        porCategoria: Object.entries(porCategoria).map(([categorias, total]) => ({ categorias, total })),
        totalGeral,
      };
    },
  },
};

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Primeiro tenta ler variáveis definidas em tempo de build, senão usa localStorage (dev runtime)
const envUrl = process.env.REACT_APP_SUPABASE_URL as string | undefined;
const envKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string | undefined;

const supabaseUrl = envUrl || (typeof window !== 'undefined' ? localStorage.getItem('REACT_APP_SUPABASE_URL') || '' : '');
const supabaseAnonKey = envKey || (typeof window !== 'undefined' ? localStorage.getItem('REACT_APP_SUPABASE_ANON_KEY') || '' : '');

let _supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
} else if (typeof window !== 'undefined') {
  console.warn('Variáveis de ambiente do Supabase não configuradas. Você pode definir REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY em .env ou via localStorage.');
}

export function configureSupabase(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('REACT_APP_SUPABASE_URL', url);
    localStorage.setItem('REACT_APP_SUPABASE_ANON_KEY', anonKey);
  }
  _supabase = createClient(url, anonKey);
}

const requireClient = (): SupabaseClient => {
  if (!_supabase) {
    throw new Error('Configuração do Supabase ausente. Defina REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY em .env ou configure via Settings.');
  }
  return _supabase;
};

export const supabaseService = {
  gastos: {
    getByPeriodo: async (ano: number, mes: number) => {
      const { data, error } = await requireClient()
        .from('gastos')
        .select('*')
        .eq('ano', ano)
        .eq('mes', mes)
        .order('data_criacao', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    create: async (gasto: any) => {
      const { data, error } = await requireClient()
        .from('gastos')
        .insert([gasto])
        .select();
      
      if (error) throw error;
      return data?.[0];
    },

    delete: async (id: number) => {
      const { error } = await requireClient()
        .from('gastos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },

    getEstatisticas: async (ano: number, mes: number) => {
      const { data, error } = await requireClient()
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

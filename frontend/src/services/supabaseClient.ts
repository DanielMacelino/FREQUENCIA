import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const supabaseUrl = envUrl || localStorage.getItem('VITE_SUPABASE_URL') || '';
const supabaseAnonKey = envKey || localStorage.getItem('VITE_SUPABASE_ANON_KEY') || '';

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export function configureSupabase(url: string, anonKey: string) {
  localStorage.setItem('VITE_SUPABASE_URL', url);
  localStorage.setItem('VITE_SUPABASE_ANON_KEY', anonKey);
  supabase = createClient(url, anonKey);
}

const requireClient = (): SupabaseClient => {
  if (!supabase) {
    throw new Error('Configuração do Supabase ausente. Defina VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (env) ou configure via Settings na aplicação.');
  }
  return supabase;
};

export const supabaseService = {
  // Frequência
  frequencia: {
    getByPeriodo: async (ano: number, mes: number, usuario: string) => {
      const { data, error } = await requireClient()
        .from('frequencias')
        .select('*')
        .eq('ano', ano)
        .eq('mes', mes)
        .eq('usuario', usuario)
        .order('data', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    create: async (frequencia: any, usuario: string) => {
      const { data, error } = await requireClient()
        .from('frequencias')
        .insert([{ ...frequencia, usuario }])
        .select();
      
      if (error) throw error;
      return data?.[0];
    },

    update: async (id: number, frequencia: any) => {
      const { data, error } = await requireClient()
        .from('frequencias')
        .update(frequencia)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data?.[0];
    },

    delete: async (id: number) => {
      const { error } = await requireClient()
        .from('frequencias')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },

    getTotalHoras: async (ano: number, mes: number, usuario: string) => {
      const { data, error } = await requireClient()
        .from('frequencias')
        .select('horas')
        .eq('ano', ano)
        .eq('mes', mes)
        .eq('usuario', usuario);
      
      if (error) throw error;
      const total = (data || []).reduce((sum: number, item: any) => sum + item.horas, 0);
      return parseFloat(total.toFixed(2));
    },
  },

  // Gastos/Fatura
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

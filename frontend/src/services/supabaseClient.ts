import { createClient } from '@supabase/supabase-js';

// Fallback values if environment variables are not set
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://uvdatzwktfksgclcdwrq.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZGF0endrdGZrc2djbGNkd3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNTM4MzIsImV4cCI6MjA4MDgyOTgzMn0.KeLWyqRgmw2yQvX64WARlbUKoTaY08cPfdCt8kfHnhM";

let supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const configureSupabase = (url: string, key: string) => {
  supabase = createClient(url, key);
};

const handleSupabaseError = (error: any, data: any) => {
  if (error) {
    console.error('Supabase error:', error.message);
    throw new Error(error.message);
  }
  return data;
};

export const supabaseService = {
  gastos: {
    async getByPeriodo(ano: number, mes: number) {
      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .eq('ano', ano)
        .eq('mes', mes)
        .order('created_at', { ascending: false });
      return handleSupabaseError(error, data);
    },
    async create(gasto: any) {
      const { data, error } = await supabase.from('gastos').insert(gasto).select();
      return handleSupabaseError(error, data);
    },
    async update(id: number, gasto: any) {
      const { data, error } = await supabase.from('gastos').update(gasto).eq('id', id);
      return handleSupabaseError(error, data);
    },
    async delete(id: number) {
      const { data, error } = await supabase.from('gastos').delete().eq('id', id);
      return handleSupabaseError(error, data);
    }
  },
  usuarios: {
    async getAll() {
      const { data, error } = await supabase.from('usuarios').select('nome');
      return handleSupabaseError(error, data);
    }
  }
};

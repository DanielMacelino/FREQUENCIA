
import { createClient } from '@supabase/supabase-js';

// URL e Chave Anon do seu projeto Supabase
const supabaseUrl = 'https://uvdatzwktfksgclcdwrq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZGF0endrdGZrc2djbGNkd3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNTM4MzIsImV4cCI6MjA4MDgyOTgzMn0.KeLWyqRgmw2yQvX64WARlbUKoTaY08cPfdCt8kfHnhM';

// Inicializa o cliente Supabase
// Este cliente será usado para todas as interações com o banco de dados
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

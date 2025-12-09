
import { supabase } from './supabaseClient';

// Tipagem para uma Frequência
export interface Frequencia {
  id?: number;
  data: string;
  horas: number;
  atividade: string;
  observacao?: string;
  usuario?: string;
  ano?: number;
  mes?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Função genérica para buscar uma única linha.
 * @param {string} tableName - Nome da tabela.
 * @param {string} columns - Colunas a serem selecionadas.
 * @param {object} match - Condição de busca (ex: { id: 1 }).
 * @returns {Promise<any>} - Retorna a linha encontrada ou null.
 */
export async function get(tableName: string, columns: string, match: object): Promise<any> {
  const { data, error } = await supabase
    .from(tableName)
    .select(columns)
    .match(match)
    .single();

  if (error) {
    console.error(`Erro ao buscar em ${tableName}:`, error);
    throw error;
  }
  return data;
}

/**
 * Função genérica para buscar múltiplas linhas.
 * @param {string} tableName - Nome da tabela.
 * @param {string} columns - Colunas a serem selecionadas.
 * @param {object} [match] - Condição de busca opcional.
 * @param {object} [orderBy] - Condição de ordenação opcional.
 * @returns {Promise<any[]>} - Retorna um array de linhas.
 */
export async function all(tableName: string, columns: string, match?: object, orderBy?: object): Promise<any[]> {
  let query = supabase.from(tableName).select(columns);

  if (match) {
    query = query.match(match);
  }
  if (orderBy) {
    query = query.order(Object.keys(orderBy)[0] as any, { ascending: Object.values(orderBy)[0] });
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Erro ao listar de ${tableName}:`, error);
    throw error;
  }
  return data || [];
}

/**
 * Função genérica para inserir uma nova linha.
 * @param {string} tableName - Nome da tabela.
 * @param {object} row - Objeto com os dados a serem inseridos.
 * @returns {Promise<any>} - Retorna o dado inserido.
 */
export async function insert(tableName: string, row: object): Promise<any> {
  const { data, error } = await supabase
    .from(tableName)
    .insert([row])
    .select()
    .single(); // .select().single() para retornar o registro criado

  if (error) {
    console.error(`Erro ao inserir em ${tableName}:`, error);
    throw error;
  }
  return data;
}

/**
 * Função genérica para atualizar uma linha.
 * @param {string} tableName - Nome da tabela.
 * @param {object} row - Objeto com os dados a serem atualizados.
 * @param {object} match - Condição para encontrar a linha a ser atualizada.
 * @returns {Promise<any>} - Retorna o dado atualizado.
 */
export async function update(tableName: string, row: object, match: object): Promise<any> {
  const { data, error } = await supabase
    .from(tableName)
    .update(row)
    .match(match)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar em ${tableName}:`, error);
    throw error;
  }
  return data;
}

/**
 * Função genérica para deletar uma linha.
 * @param {string} tableName - Nome da tabela.
 * @param {object} match - Condição para encontrar a linha a ser deletada.
 * @returns {Promise<void>}
 */
export async function remove(tableName: string, match: object): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .match(match);

  if (error) {
    console.error(`Erro ao deletar de ${tableName}:`, error);
    throw error;
  }
}

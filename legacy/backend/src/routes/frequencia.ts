
import express from 'express';
import {
  get as getDb,
  all as allDb,
  insert as insertDb,
  update as updateDb,
  remove as removeDb,
  Frequencia
} from '../database';

const router = express.Router();
const TABLE_NAME = 'frequencias';

// Rota para listar todas as frequências (geralmente para admin, se necessário)
router.get('/', async (req, res) => {
  try {
    const frequencias = await allDb(TABLE_NAME, '*', {}, { 'data': false }); // Ordena por data descendente
    res.json(frequencias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar frequências' });
  }
});

// Rota para listar frequências por período e por usuário
router.get('/periodo/:ano/:mes', async (req, res) => {
  try {
    const { ano, mes } = req.params;
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ error: 'O parâmetro \'user\' é obrigatório' });
    }

    const anoNum = parseInt(ano);
    const mesNum = parseInt(mes);

    // Filtros para a consulta no Supabase
    const match = {
      usuario: user,
      ano: anoNum,
      mes: mesNum
    };

    const frequencias = await allDb(TABLE_NAME, '*', match, { 'data': true }); // Ordena por data ascendente

    const totalHoras = frequencias.reduce((sum: number, f: Frequencia) => sum + (f.horas || 0), 0);

    res.json({
      frequencias,
      totalHoras: totalHoras.toFixed(2)
    });

  } catch (error) {
    console.error('Erro ao buscar frequências do período:', error);
    res.status(500).json({ error: 'Erro ao buscar frequências do período' });
  }
});

// Buscar uma única frequência pelo seu ID
router.get('/:id', async (req, res) => {
  try {
    const frequencia = await getDb(TABLE_NAME, '*', { id: req.params.id });
    if (!frequencia) {
      return res.status(404).json({ error: 'Frequência não encontrada' });
    }
    res.json(frequencia);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar frequência' });
  }
});

// Criar uma nova frequência
router.post('/', async (req, res) => {
  try {
    const { data, horas, atividade, observacao, user } = req.body;

    if (!data || horas === undefined || !atividade || !user) {
      return res.status(400).json({ error: 'Campos obrigatórios: data, horas, atividade, user' });
    }

    const horasNum = parseFloat(horas);
    if (isNaN(horasNum) || horasNum < 0) {
      return res.status(400).json({ error: 'Horas deve ser um número não negativo' });
    }

    const [ano, mes] = data.split('-').map(Number);

    const novaFrequencia = {
      data,
      horas: horasNum,
      atividade,
      observacao: observacao || null,
      usuario: user,
      ano,
      mes
    };

    const FrequenciaCriada = await insertDb(TABLE_NAME, novaFrequencia);
    res.status(201).json(FrequenciaCriada);

  } catch (error: any) {
    console.error('Erro ao criar frequência:', error);
    res.status(500).json({ 
      error: 'Erro ao criar frequência',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

// Atualizar uma frequência existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, horas, atividade, observacao, user } = req.body;

    if (!data || horas === undefined || !atividade || !user) {
      return res.status(400).json({ error: 'Campos obrigatórios: data, horas, atividade, user' });
    }

    const horasNum = parseFloat(horas);
    if (isNaN(horasNum) || horasNum < 0) {
      return res.status(400).json({ error: 'Horas deve ser um número não negativo' });
    }

    const [ano, mes] = data.split('-').map(Number);

    const dadosAtualizados = {
      data,
      horas: horasNum,
      atividade,
      observacao: observacao || null,
      usuario: user, // Garantir que o usuário seja atualizado se necessário
      ano,
      mes,
      updated_at: new Date() // Adiciona um timestamp de atualização
    };

    const frequenciaAtualizada = await updateDb(TABLE_NAME, dadosAtualizados, { id });
    res.json(frequenciaAtualizada);

  } catch (error: any) {
    console.error('Erro ao atualizar frequência:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar frequência',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

// Deletar uma frequência
router.delete('/:id', async (req, res) => {
  try {
    await removeDb(TABLE_NAME, { id: req.params.id });
    res.status(204).send(); // 204 No Content é uma resposta padrão para delete
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar frequência' });
  }
});

export default router;

import express from 'express';
import { dbRun, dbGet, dbAll, Frequencia } from '../database';

const router = express.Router();

// Listar todas as frequências
router.get('/', async (req, res) => {
  try {
    const frequencias = await dbAll('SELECT * FROM frequencias ORDER BY data DESC');
    res.json(frequencias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar frequências' });
  }
});

// Listar frequências por período (dia 20 ao dia 19 do próximo mês)
router.get('/periodo/:ano/:mes', async (req, res) => {
  try {
    const { ano, mes } = req.params;
    const anoNum = parseInt(ano);
    const mesNum = parseInt(mes);
    
    // Calcular período: dia 20 do mês atual ao dia 19 do próximo mês
    const dataInicio = `${anoNum}-${String(mesNum).padStart(2, '0')}-20`;
    const proximoMes = mesNum === 12 ? 1 : mesNum + 1;
    const proximoAno = mesNum === 12 ? anoNum + 1 : anoNum;
    const dataFim = `${proximoAno}-${String(proximoMes).padStart(2, '0')}-19`;
    
    const frequencias = await dbAll(
      'SELECT * FROM frequencias WHERE data >= ? AND data <= ? ORDER BY data ASC',
      [dataInicio, dataFim]
    );
    
    // Calcular total de horas
    const totalHoras = frequencias.reduce((sum: number, f: Frequencia) => sum + (f.horas || 0), 0);
    
    res.json({
      frequencias,
      periodo: { dataInicio, dataFim },
      totalHoras: totalHoras.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar frequências do período' });
  }
});

// Buscar frequência por ID
router.get('/:id', async (req, res) => {
  try {
    const frequencia = await dbGet('SELECT * FROM frequencias WHERE id = ?', [req.params.id]);
    if (!frequencia) {
      return res.status(404).json({ error: 'Frequência não encontrada' });
    }
    res.json(frequencia);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar frequência' });
  }
});

// Criar nova frequência
router.post('/', async (req, res) => {
  try {
    const { data, horas, atividade, observacao } = req.body;
    
    if (!data || horas === undefined || horas === null || !atividade) {
      return res.status(400).json({ error: 'Campos obrigatórios: data, horas, atividade' });
    }
    
    const horasNum = parseFloat(horas);
    if (isNaN(horasNum) || horasNum <= 0) {
      return res.status(400).json({ error: 'Horas deve ser um número positivo' });
    }
    
    const result = await dbRun(
      'INSERT INTO frequencias (data, horas, atividade, observacao) VALUES (?, ?, ?, ?)',
      [data, horasNum, atividade, observacao || null]
    );
    
    const novaFrequencia = await dbGet('SELECT * FROM frequencias WHERE id = ?', [result.lastID]) as Frequencia;
    res.status(201).json(novaFrequencia);
  } catch (error: any) {
    console.error('Erro ao criar frequência:', error);
    res.status(500).json({ 
      error: 'Erro ao criar frequência',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

// Atualizar frequência
router.put('/:id', async (req, res) => {
  try {
    const { data, horas, atividade, observacao } = req.body;
    
    if (!data || horas === undefined || horas === null || !atividade) {
      return res.status(400).json({ error: 'Campos obrigatórios: data, horas, atividade' });
    }
    
    const horasNum = parseFloat(horas);
    if (isNaN(horasNum) || horasNum <= 0) {
      return res.status(400).json({ error: 'Horas deve ser um número positivo' });
    }
    
    await dbRun(
      'UPDATE frequencias SET data = ?, horas = ?, atividade = ?, observacao = ? WHERE id = ?',
      [data, horasNum, atividade, observacao || null, req.params.id]
    );
    
    const frequenciaAtualizada = await dbGet('SELECT * FROM frequencias WHERE id = ?', [req.params.id]);
    res.json(frequenciaAtualizada);
  } catch (error: any) {
    console.error('Erro ao atualizar frequência:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar frequência',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

// Deletar frequência
router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM frequencias WHERE id = ?', [req.params.id]);
    res.json({ message: 'Frequência deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar frequência' });
  }
});

// Estatísticas gerais
router.get('/stats/geral', async (req, res) => {
  try {
    const totalRegistros = await dbGet('SELECT COUNT(*) as total FROM frequencias');
    const totalHoras = await dbGet('SELECT SUM(horas) as total FROM frequencias');
    
    res.json({
      totalRegistros: totalRegistros?.total || 0,
      totalHoras: (totalHoras?.total || 0).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;


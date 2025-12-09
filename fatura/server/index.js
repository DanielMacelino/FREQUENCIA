const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar banco de dados
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    initializeDatabase();
  }
});

// Inicializar tabelas
function initializeDatabase() {
  db.serialize(() => {
    // Tabela de gastos
    db.run(`CREATE TABLE IF NOT EXISTS gastos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      valor REAL NOT NULL,
      categorias TEXT NOT NULL,
      pessoa TEXT NOT NULL,
      mes INTEGER NOT NULL,
      ano INTEGER NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Criar índices para melhor performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_mes_ano ON gastos(mes, ano)`);
  });
}

// Rotas

// Obter todos os gastos de um mês/ano
app.get('/api/gastos/:ano/:mes', (req, res) => {
  const { ano, mes } = req.params;
  
  db.all(
    'SELECT * FROM gastos WHERE ano = ? AND mes = ? ORDER BY data_criacao DESC',
    [ano, mes],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Adicionar novo gasto
app.post('/api/gastos', (req, res) => {
  const { descricao, valor, categorias, pessoa, mes, ano } = req.body;

  if (!descricao || !valor || !categorias || !pessoa || !mes || !ano) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    return;
  }

  const categoriasStr = Array.isArray(categorias) ? categorias.join(',') : categorias;

  db.run(
    'INSERT INTO gastos (descricao, valor, categorias, pessoa, mes, ano) VALUES (?, ?, ?, ?, ?, ?)',
    [descricao, valor, categoriasStr, pessoa, mes, ano],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, descricao, valor, categorias: categoriasStr, pessoa, mes, ano });
    }
  );
});

// Atualizar gasto
app.put('/api/gastos/:id', (req, res) => {
  const { id } = req.params;
  const { descricao, valor, categorias, pessoa } = req.body;

  const categoriasStr = Array.isArray(categorias) ? categorias.join(',') : categorias;

  db.run(
    'UPDATE gastos SET descricao = ?, valor = ?, categorias = ?, pessoa = ? WHERE id = ?',
    [descricao, valor, categoriasStr, pessoa, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Gasto atualizado com sucesso', changes: this.changes });
    }
  );
});

// Deletar gasto
app.delete('/api/gastos/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM gastos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Gasto deletado com sucesso', changes: this.changes });
  });
});

// Obter estatísticas do mês
app.get('/api/estatisticas/:ano/:mes', (req, res) => {
  const { ano, mes } = req.params;

  db.all(
    `SELECT 
      pessoa,
      SUM(valor) as total,
      categorias
    FROM gastos 
    WHERE ano = ? AND mes = ?
    GROUP BY pessoa`,
    [ano, mes],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Calcular totais por categoria
      db.all(
        `SELECT categorias, SUM(valor) as total
         FROM gastos
         WHERE ano = ? AND mes = ?
         GROUP BY categorias`,
        [ano, mes],
        (err2, categoriaRows) => {
          if (err2) {
            res.status(500).json({ error: err2.message });
            return;
          }

          // Calcular total geral
          db.get(
            `SELECT SUM(valor) as total_geral
             FROM gastos
             WHERE ano = ? AND mes = ?`,
            [ano, mes],
            (err3, totalRow) => {
              if (err3) {
                res.status(500).json({ error: err3.message });
                return;
              }

              res.json({
                porPessoa: rows,
                porCategoria: categoriaRows,
                totalGeral: totalRow.total_geral || 0
              });
            }
          );
        }
      );
    }
  );
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Fechar banco de dados ao encerrar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexão com banco de dados fechada.');
    process.exit(0);
  });
});


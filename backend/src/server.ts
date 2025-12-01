import express from 'express';
import cors from 'cors';
import { initDatabase } from './database';
import frequenciaRoutes from './routes/frequencia';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Inicializar banco de dados
initDatabase();

// Rotas
app.use('/api/frequencias', frequenciaRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});


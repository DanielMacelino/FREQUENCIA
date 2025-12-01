# 🚀 Guia de Deploy

## Opção 1: Deploy no Vercel (Frontend) + Railway/Render (Backend) - RECOMENDADO

### Frontend no Vercel

1. **Conecte seu repositório GitHub ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o repositório `FREQUENCIA`
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

2. **Configure a variável de ambiente:**
   - No painel do Vercel, vá em Settings > Environment Variables
   - Adicione: `VITE_API_URL` = URL do seu backend (ex: `https://seu-backend.railway.app/api`)

3. **Faça o deploy!**

### Backend no Railway ou Render

#### Railway (Recomendado)

1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto
3. Conecte seu repositório GitHub
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Adicione a variável de ambiente `PORT` (Railway define automaticamente)
6. Após o deploy, copie a URL e use no `VITE_API_URL` do frontend

#### Render

1. Acesse [render.com](https://render.com)
2. Crie um novo Web Service
3. Conecte seu repositório GitHub
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Após o deploy, copie a URL e use no `VITE_API_URL` do frontend

---

## Opção 2: Deploy Completo no Vercel (Frontend + Backend como Serverless)

⚠️ **Nota:** SQLite não funciona bem em serverless functions. Considere migrar para Vercel Postgres ou outro banco.

Se quiser usar serverless functions, você precisaria:
1. Converter o backend para serverless functions
2. Usar um banco de dados compatível (PostgreSQL, MongoDB, etc.)

---

## Configuração Atual

O projeto está configurado para:
- **Frontend:** Deploy no Vercel
- **Backend:** Deploy separado (Railway/Render recomendado)

### Arquivos de Configuração

- `vercel.json` - Configuração do Vercel para o frontend
- `frontend/vercel.json` - Configuração alternativa

### Variáveis de Ambiente Necessárias

**Frontend (Vercel):**
- `VITE_API_URL` - URL completa do backend (ex: `https://seu-backend.railway.app/api`)

**Backend (Railway/Render):**
- `PORT` - Porta do servidor (geralmente definida automaticamente)

---

## Testando o Deploy

Após fazer o deploy:

1. Acesse a URL do frontend no Vercel
2. Verifique se o frontend carrega corretamente
3. Teste criar uma frequência
4. Verifique os logs do backend se houver erros

---

## Troubleshooting

### Erro 404 no Vercel
- Verifique se o `Root Directory` está configurado como `frontend`
- Verifique se o `Output Directory` está como `dist`
- Verifique se o build está gerando arquivos na pasta `frontend/dist`

### Erro de CORS
- Certifique-se de que o backend está configurado para aceitar requisições do domínio do Vercel
- Verifique a variável `VITE_API_URL` no Vercel

### Erro de conexão com API
- Verifique se a URL do backend está correta
- Verifique se o backend está rodando e acessível
- Verifique os logs do backend para erros


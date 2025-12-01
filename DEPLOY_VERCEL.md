# 🚀 Deploy no Vercel - Guia Rápido

## ⚠️ IMPORTANTE: Configuração no Vercel

Ao fazer o deploy no Vercel, você DEVE configurar manualmente:

### Passo 1: Configurações do Projeto

1. Acesse o painel do Vercel
2. Vá em **Settings** > **General**
3. Configure:
   - **Root Directory:** `frontend` ⚠️ **IMPORTANTE**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Passo 2: Variáveis de Ambiente

1. Vá em **Settings** > **Environment Variables**
2. Adicione:
   - **Nome:** `VITE_API_URL`
   - **Valor:** URL do seu backend (ex: `https://seu-backend.railway.app/api`)
   - **Environment:** Production, Preview, Development

### Passo 3: Deploy do Backend

O backend precisa ser deployado separadamente:

**Opção A - Railway (Recomendado):**
1. Acesse [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Selecione o repositório
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Copie a URL gerada e use no `VITE_API_URL`

**Opção B - Render:**
1. Acesse [render.com](https://render.com)
2. New > Web Service
3. Conecte o GitHub
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Copie a URL gerada e use no `VITE_API_URL`

## ✅ Verificação

Após o deploy:
- Frontend: `https://seu-projeto.vercel.app`
- Backend: `https://seu-backend.railway.app` (ou Render)

Teste criando uma frequência no sistema!


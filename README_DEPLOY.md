# Guia de Deploy - Sistema de Frequência e Fatura

## 📋 Visão Geral

Este projeto é um monorepo contendo:
- **`frontend`** - Aplicação Vite + React (Frequência)
- **`fatura/client`** - Aplicação Create React App (Gestão de Gastos)
- **`backend`** - Express.js (não usado em produção no Vercel; dados via Supabase)

Todos os dados são persistidos no **Supabase (PostgreSQL)**.

---

## 🚀 Pré-requisitos

1. **Conta Supabase** - https://supabase.com
2. **Projeto no Vercel** - https://vercel.com
3. **Git e GitHub** - Repositório já configurado

---

## 🔧 Configuração Supabase

### 1. Criar Tabelas no Supabase

Acesse **SQL Editor** no painel Supabase e execute:

```sql
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de frequências
CREATE TABLE IF NOT EXISTS frequencias (
  id BIGSERIAL PRIMARY KEY,
  usuario TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  horas NUMERIC(4,2) NOT NULL,
  atividade TEXT NOT NULL,
  observacao TEXT,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de gastos
CREATE TABLE IF NOT EXISTS gastos (
  id BIGSERIAL PRIMARY KEY,
  pessoa TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  categoria TEXT NOT NULL,
  data_gasto DATE NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_frequencias_usuario_mes_ano ON frequencias(usuario, mes, ano);
CREATE INDEX idx_frequencias_data ON frequencias(data);
CREATE INDEX idx_gastos_mes_ano ON gastos(mes, ano);
CREATE INDEX idx_gastos_categoria ON gastos(categoria);
```

### 2. Obter Chaves Supabase

No painel Supabase → **Project Settings** → **API**:
- Copiar `Project URL` (VITE_SUPABASE_URL)
- Copiar `Anon Public Key` (VITE_SUPABASE_ANON_KEY)

---

## 📦 Deploy no Vercel

### Opção A: Frontend (Frequência) - Projeto Principal

1. **Conectar GitHub ao Vercel**
   - Ir para https://vercel.com/new
   - Selecionar repositório `FREQUENCIA`
   - Framework: **Other** (Vite será detectado)

2. **Configurar Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Adicionar Environment Variables**
   - `VITE_SUPABASE_URL` = (sua URL do Supabase)
   - `VITE_SUPABASE_ANON_KEY` = (sua chave anon)

4. **Deploy**
   - Vercel fará build e deploy automaticamente

### Opção B: Fatura (App de Gastos) - Projeto Separado

1. **Criar novo projeto Vercel**
   - https://vercel.com/new
   - Mesmo repositório `FREQUENCIA`

2. **Configurar Build Settings**
   - Root Directory: `fatura/client`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Adicionar Environment Variables**
   - `REACT_APP_SUPABASE_URL` = (sua URL do Supabase)
   - `REACT_APP_SUPABASE_ANON_KEY` = (sua chave anon)

4. **Deploy**
   - Vercel fará build e deploy

---

## 🔐 Segurança

### Variáveis de Ambiente

- ✅ As chaves Anon são públicas (expostas no frontend) - CORRETO
- ❌ Nunca exponha a **Service Key** no frontend
- ✅ Configure RLS (Row Level Security) no Supabase para proteger dados

### RLS no Supabase (Recomendado)

```sql
-- Habilitar RLS em frequencias
ALTER TABLE frequencias ENABLE ROW LEVEL SECURITY;

-- Política: usuários veem apenas suas frequências
CREATE POLICY "Usuários veem suas frequências" ON frequencias
  FOR SELECT USING (usuario = current_user_id());
```

---

## 🔄 CI/CD Automático

Vercel detecta automaticamente:
- Push para `main` → Deploy automático
- Pull Requests → Deploy de preview

---

## 📝 Scripts Úteis (Desenvolvimento Local)

```bash
# Instalar todas as dependências (workspaces)
npm install

# Rodar frontend em dev
npm run dev:frontend

# Rodar fatura em dev
npm run dev:fatura

# Build todos os projetos
npm run build:all

# Build apenas frontend
npm run build:frontend

# Build apenas fatura
npm run build:fatura
```

---

## 🐛 Troubleshooting

### Tela branca no Vercel

**Causa**: Assets não sendo servidos corretamente
**Solução**: `vercel.json` está configurado com `routes` corretos

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

### Erro "Cannot find module '@supabase/supabase-js'"

**Causa**: Dependência não instalada
**Solução**: Vercel instala automaticamente; se problema persistir, limpe cache

### Variáveis de ambiente não carregadas

**Verificar**:
1. No Vercel, Project Settings → Environment Variables
2. Confirmar nomes: `VITE_*` (frontend) vs `REACT_APP_*` (fatura)
3. Redeploy após adicionar variáveis (Deployments → Redeploy)

---

## 📊 Estrutura Final

```
FREQUENCIA/
├── frontend/                # Vite + React (Frequência)
│   ├── src/
│   ├── dist/               # Build output
│   └── package.json
├── fatura/
│   └── client/             # CRA (Gastos)
│       ├── src/
│       ├── build/          # Build output
│       └── package.json
├── backend/                # Express (não usado em Vercel)
├── package.json            # Root workspaces
├── vercel.json            # Config Vercel (frontend)
└── README.md
```

---

## ✅ Checklist Pré-Deployment

- [ ] Variáveis Supabase configuradas localmente (`.env`)
- [ ] Tabelas criadas no Supabase
- [ ] `npm run build` roda sem erros
- [ ] Projeto conectado ao GitHub
- [ ] Projeto criado no Vercel
- [ ] Environment variables no Vercel (VITE_* e REACT_APP_*)
- [ ] Deploy inicia e completa com sucesso
- [ ] Testa URL do Vercel - todos os assets carregam
- [ ] Seleciona usuário, insere frequência/gasto - dados salvos no Supabase
- [ ] RLS configurado (produção)

---

## 📞 Support

Para dúvidas:
1. Verifique logs no Vercel (Deployments → Logs)
2. Verifique console do navegador (F12)
3. Confirme variáveis de ambiente

---

**Última atualização**: 9 de dezembro de 2025

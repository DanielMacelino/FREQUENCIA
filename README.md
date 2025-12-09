# Sistema de Frequência e Gestão de Gastos - PET Saúde Digital

**Aplicação profissional para registro de frequências e gestão de despesas com dashboard intuitivo e dados persistidos em Supabase.**

## 🎯 Visão Geral

Sistema monorepo com:
- ✅ **Frontend Vite + React** - Interface moderna para registro de frequências
- ✅ **App de Gestão de Gastos** (Create React App) - Dashboard de despesas com gráficos
- ✅ **Supabase PostgreSQL** - Banco de dados em produção
- ✅ **Deploy Vercel** - CI/CD automático via GitHub
- ✅ **Código profissional** - TypeScript, tratamento de erros, componentes reutilizáveis

---

## 🚀 Quick Start (Local)

### Pré-requisitos
- Node.js 16+
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/FREQUENCIA.git
cd FREQUENCIA

# Instale todas as dependências (workspaces)
npm install

# Configure variáveis de ambiente
cp frontend/.env.example frontend/.env.local
cp fatura/client/.env.example fatura/client/.env

# Preencha as variáveis com credenciais do Supabase
```

### Rodando em Desenvolvimento

```bash
# Frontend (Vite) - localhost:3002
npm run dev:frontend

# Fatura (CRA) - localhost:3003
npm run dev:fatura

# Ambos simultaneamente
npm run dev
```

---

## 📦 Estrutura do Projeto

```
FREQUENCIA/
├── frontend/                  # Frequência (Vite)
│   ├── src/
│   │   ├── components/       # Header, ErrorBoundary, UserSelect
│   │   ├── pages/            # Dashboard, Choice, FaturaEmbed
│   │   ├── context/          # AppContext (gerenciamento de estado)
│   │   ├── services/         # Supabase client & service methods
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx
│   └── dist/                 # Build output
│
├── fatura/
│   └── client/               # Gestão de Gastos (CRA)
│       ├── src/
│       │   ├── components/   # Gráficos, tabelas, formulários
│       │   ├── supabaseClient.ts
│       │   └── App.tsx
│       └── build/            # Build output
│
├── backend/                  # Express (não usado em Vercel)
│   └── src/
│
├── package.json             # Root (workspaces)
├── vercel.json             # Config Vercel
├── README_DEPLOY.md        # Guia de deployment
└── .gitignore
```

---

## 🏗️ Arquitetura

### Frontend (Frequência)
1. **UserSelect** → Seleciona usuário (Daniel, Douglas, Convidado)
2. **Choice** → Escolhe entre Frequência ou Fatura
3. **Dashboard** → Registra frequências com calendário visual
4. **FaturaEmbed** → Redireciona para app de Gastos

### Data Flow
```
UserSelect → localStorage.setItem('selectedUser')
  ↓
AppContext → useAppContext() em qualquer página
  ↓
Supabase Service → CRUD direto no PostgreSQL
```

### Supabase Schema
```sql
frequencias (id, usuario, data, horas, atividade, observacao, ano, mes)
gastos (id, pessoa, descricao, valor, categoria, data_gasto, mes, ano)
usuarios (id, nome)
```

---

## 🔐 Segurança

✅ **Chaves Anon no Frontend** - Permitido (dados públicos)
✅ **RLS (Row Level Security)** - Recomendado para produção
✅ **Sem console.logs em Prod** - Apenas em desenvolvimento
✅ **TypeScript Rigoroso** - Sem `any`

---

## 📋 Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev                  # Todos os projetos
npm run dev:frontend         # Apenas frontend
npm run dev:fatura          # Apenas fatura

# Build
npm run build               # Todos
npm run build:frontend      # Frontend
npm run build:fatura        # Fatura

# Lint/Type Check
npm run lint                # Todos
npm run type-check          # Verificar tipos
```

---

## 🌐 Deploy (Vercel)

### Pré-requisitos
1. Projeto Supabase com tabelas criadas
2. GitHub conectado ao Vercel
3. Variáveis de ambiente configuradas

### Passos

#### Frontend (Frequência)
1. Novo projeto Vercel → Conectar GitHub
2. Root Directory: `frontend`
3. Build: `npm run build`
4. Output: `dist`
5. Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

#### Fatura (Gastos)
1. Novo projeto Vercel → Mesmo repositório
2. Root Directory: `fatura/client`
3. Build: `npm run build`
4. Output: `build`
5. Env vars: `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`

**[→ Guia Completo: README_DEPLOY.md](./README_DEPLOY.md)**

---

## 🧪 Testes Locais

```bash
# Servir build estático (simula produção)
npx serve -s frontend/dist -l 5000

# Abre http://localhost:5000
```

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Tela branca em Vercel | Verifique `vercel.json` (routes config) |
| Variáveis não carregadas | Confirm names: `VITE_*` vs `REACT_APP_*` |
| "Cannot find module" | `npm install` em cada workspace |
| CORS errors | Adicionar origem no Supabase → CORS |

---

## 📚 Documentação Adicional

- **[README_DEPLOY.md](./README_DEPLOY.md)** - Guia passo-a-passo de deployment
- **[SQL_COPIAR_E_COLAR.sql](./SQL_COPIAR_E_COLAR.sql)** - Script SQL pronto
- `frontend/src/types/index.ts` - TypeScript interfaces

---

## 🔄 Contribuindo

1. Create branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -m "Add: sua feature"`
3. Push: `git push origin feature/sua-feature`
4. Pull Request

---

## 📦 Tech Stack

| Layer | Tecnologia |
|-------|-----------|
| Frontend | Vite 5, React 18, TypeScript |
| Fatura | Create React App, Chart.js |
| Database | Supabase (PostgreSQL) |
| Deploy | Vercel |
| Styling | CSS Grid/Flexbox |

---

## 📞 Suporte

Para dúvidas ou issues:
1. Verifique [README_DEPLOY.md](./README_DEPLOY.md)
2. Acesse [Vercel Logs](https://vercel.com) → Seu projeto → Deployments
3. Verifique console (F12) no navegador

---

## 📄 Licença

MIT - Use livremente em projetos pessoais e comerciais.

---

**Desenvolvido com ❤️ para PET Saúde Digital**  
Última atualização: 9 de dezembro de 2025


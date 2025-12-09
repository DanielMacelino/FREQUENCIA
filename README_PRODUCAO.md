# 📊 FREQUÊNCIA + FATURA - Aplicação Completa

Sistema integrado para controle de frequência (PET Saúde Digital) e controle de gastos compartilhados em cartão.

## 🎯 Features

### Frequência
- ✅ Registro de horas trabalhadas
- ✅ Organização por período (dia 20 ao dia 19)
- ✅ Visualização em calendário
- ✅ Estatísticas de horas por período
- ✅ Edição e exclusão de registros
- ✅ Suporte a múltiplos usuários

### Fatura
- ✅ Registro de gastos em cartão compartilhado
- ✅ Categorização de gastos
- ✅ Gráficos de gastos por pessoa e categoria
- ✅ Cálculo automático de totais
- ✅ Controle por mês e ano
- ✅ Edição e exclusão de registros

## 🚀 Quick Start

### 1. Configurar Supabase (Banco de Dados)

**Veja: `SUPABASE_SETUP.md`** para instruções completas

**Resumido:**
1. Crie projeto em https://supabase.com
2. Copie a URL e chave Anon
3. Crie as tabelas (veja SQL em SUPABASE_SETUP.md)

### 2. Configurar Variáveis de Ambiente

**Frontend:**

```bash
cp frontend/.env.example frontend/.env.local
```

Edite `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

**Fatura:**

```bash
cp fatura/client/.env.example fatura/client/.env
```

Edite `fatura/client/.env`:

```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-anon
```

### 3. Instalar Dependências

```bash
# Frontend
cd frontend && npm install

# Fatura
cd fatura/client && npm install
```

### 4. Executar em Desenvolvimento

**Terminal 1:**

```bash
cd frontend
npm run dev
```

Acessa em: `http://localhost:5173`

**Terminal 2:**

```bash
cd fatura/client
npm start
```

Acessa em: `http://localhost:3000`

### 5. Usar a Aplicação

1. Abra `http://localhost:5173`
2. Selecione um usuário (Daniel, douglas, Convidado 1)
3. Escolha:
   - **Frequencia**: Acessa o Dashboard de Frequência
   - **Fatura**: Redireciona para a aplicação de Fatura

## 📂 Estrutura do Projeto

```
FREQUENCIA/
├── frontend/                    # App de Frequência (Vite + React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx   # Principal
│   │   │   ├── Choice.tsx      # Escolha Frequência/Fatura
│   │   │   └── FaturaEmbed.tsx # Redirecionador
│   │   ├── components/
│   │   │   └── UserSelect.tsx  # Menu de usuários
│   │   ├── services/
│   │   │   ├── api.ts          # Interface com API
│   │   │   └── supabaseClient.ts # Integração Supabase
│   │   └── App.tsx
│   ├── .env.local              # ⚠️ NÃO COMMITAR
│   └── package.json
│
├── fatura/
│   └── client/                 # App de Fatura (CRA)
│       ├── src/
│       │   ├── App.tsx
│       │   ├── components/
│       │   │   ├── AdicionarGasto.tsx
│       │   │   ├── FaturaView.tsx
│       │   │   ├── Graficos.tsx
│       │   │   └── ...
│       │   ├── supabaseClient.ts # Integração Supabase
│       │   └── types.ts
│       ├── .env                # ⚠️ NÃO COMMITAR
│       └── package.json
│
├── SUPABASE_SETUP.md           # Setup do banco de dados
├── PRODUCAO.md                 # Deploy em produção
└── README.md                   # Este arquivo
```

## 🗄️ Banco de Dados (Supabase)

### Tabela: frequencias

```sql
CREATE TABLE frequencias (
  id BIGSERIAL PRIMARY KEY,
  usuario VARCHAR(255) NOT NULL,
  data DATE NOT NULL,
  horas DECIMAL(10, 2) NOT NULL,
  atividade VARCHAR(255) NOT NULL,
  observacao TEXT,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: gastos

```sql
CREATE TABLE gastos (
  id BIGSERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  categorias VARCHAR(100) NOT NULL,
  pessoa VARCHAR(100) NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Segurança

- **Chaves de ambiente**: Use `.env.local` e `.env` (não commitar)
- **RLS**: Implemente Row Level Security no Supabase
- **Autenticação**: Considere adicionar Supabase Auth
- **HTTPS**: Sempre use HTTPS em produção

## 🚢 Deploy em Produção

**Veja: `PRODUCAO.md`** para instruções detalhadas

Opções recomendadas:
- **Vercel** (Frontend + Fatura)
- **Netlify** (Frontend + Fatura)
- **Railway** (Frontend + Fatura)
- **Docker** (AWS, GCP, Azure)

## 🛠️ Tecnologias

### Frontend (Frequência)
- React 18
- TypeScript
- Vite
- React Router
- date-fns
- Supabase JS

### Fatura
- React 18 (Create React App)
- TypeScript
- Chart.js
- Supabase JS

### Backend
- Supabase (PostgreSQL + APIs)

## 📝 Notas Importantes

1. **Usuários**: Sistema simples sem autenticação real. Para produção, implemente Supabase Auth.

2. **Dados**: Todos os dados são salvos no Supabase. Backups automáticos recomendados.

3. **Permissões**: Configure RLS policies para controlar acesso por usuário.

4. **Performance**: Use índices nas tabelas para melhor performance.

## 🆘 Problemas Comuns

### "Não consigo conectar ao Supabase"

- [ ] Verifique se `.env.local` / `.env` existem
- [ ] Confirme a chave Anon e URL
- [ ] Reinicie o servidor

### "Dados não salvam"

- [ ] Verifique tabelas no Supabase
- [ ] Cheque console do navegador
- [ ] Teste conectividade com Supabase API

### "Erro ao deletar"

- [ ] Verifique permissões RLS
- [ ] Confirme que o ID existe

## 📚 Documentação Completa

- **Banco de Dados**: Ver `SUPABASE_SETUP.md`
- **Deploy**: Ver `PRODUCAO.md`
- **Supabase Docs**: https://supabase.com/docs

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação em `SUPABASE_SETUP.md` e `PRODUCAO.md`
2. Acesse https://supabase.com/docs
3. Verifique console do navegador (F12)

## 📜 Licença

Seu projeto, sua licença.

---

**Status**: Pronto para produção com Supabase ✅

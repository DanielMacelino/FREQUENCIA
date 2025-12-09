# Setup Supabase - Guia Completo

## 📋 Requisitos

1. Conta no Supabase (https://supabase.com)
2. Projeto Supabase criado
3. Node.js 16+ e npm instalados

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Salve a **URL do Projeto** e a **Chave Anônima (Anon Key)** - você vai precisar delas

## 📊 Passo 2: Criar Tabelas no Supabase

Execute os seguintes comandos SQL no SQL Editor do Supabase:

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

-- Índices para melhor performance
CREATE INDEX frequencias_usuario_idx ON frequencias(usuario);
CREATE INDEX frequencias_periodo_idx ON frequencias(ano, mes);
CREATE INDEX frequencias_usuario_periodo_idx ON frequencias(usuario, ano, mes);
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

-- Índices para melhor performance
CREATE INDEX gastos_periodo_idx ON gastos(ano, mes);
CREATE INDEX gastos_pessoa_idx ON gastos(pessoa);
```

## 🔑 Passo 3: Configurar Variáveis de Ambiente

### Frontend (Frequência - Vite)

1. Renomeie `frontend/.env.example` para `frontend/.env.local`
2. Adicione suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
VITE_API_URL=http://localhost:3000/api
```

### Fatura (CRA)

1. Renomeie `fatura/client/.env.example` para `fatura/client/.env`
2. Adicione suas credenciais:

```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## 📦 Passo 4: Instalar Dependências

```bash
# Frontend
cd frontend
npm install

# Fatura
cd fatura/client
npm install
```

## 🏃 Passo 5: Executar em Desenvolvimento

### Terminal 1 - Frontend (Frequência)

```bash
cd frontend
npm run dev
```

Acesso em: `http://localhost:5173` (ou porta informada)

### Terminal 2 - Fatura

```bash
cd fatura/client
npm start
```

Acesso em: `http://localhost:3000`

## 🌐 Fluxo da Aplicação

1. Abra o Frontend em `http://localhost:5173`
2. Selecione o usuário (Daniel, douglas, Convidado 1)
3. Escolha:
   - **Frequencia**: Acessa o Dashboard de Frequência (conectado ao Supabase)
   - **Fatura**: Redireciona para a aplicação de Fatura em `http://localhost:3000`

## 🔐 Segurança (RLS - Row Level Security)

Para produção, recomenda-se ativar RLS nas tabelas:

1. Vá para **Authentication > Policies** no Supabase
2. Crie políticas para controlar acesso por usuário:

```sql
-- Exemplo para frequencias
CREATE POLICY "Usuários podem ver suas próprias frequências"
ON frequencias FOR SELECT
USING (usuario = current_user_id());

CREATE POLICY "Usuários podem inserir suas próprias frequências"
ON frequencias FOR INSERT
WITH CHECK (usuario = current_user_id());

CREATE POLICY "Usuários podem atualizar suas próprias frequências"
ON frequencias FOR UPDATE
USING (usuario = current_user_id());

CREATE POLICY "Usuários podem deletar suas próprias frequências"
ON frequencias FOR DELETE
USING (usuario = current_user_id());
```

## 🚢 Passo 6: Deploy em Produção

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy para Vercel
```

### Fatura (CRA - Firebase Hosting ou Vercel)

```bash
cd fatura/client
npm run build
# Deploy para Vercel ou Firebase
```

### Atualizar URLs de Ambiente

Atualize as variáveis de ambiente no seu host de produção com os valores corretos do Supabase.

## 📝 Checklist Final

- [ ] Projeto Supabase criado
- [ ] Tabelas `frequencias` e `gastos` criadas
- [ ] `.env.local` configurado no frontend
- [ ] `.env` configurado no fatura/client
- [ ] `npm install` executado em ambos os projetos
- [ ] Frontend e Fatura testados localmente
- [ ] Dados salvando no Supabase
- [ ] URLs de produção configuradas antes do deploy

## 🆘 Troubleshooting

### "Variáveis de ambiente não configuradas"

Certifique-se que:
- Os arquivos `.env.local` (frontend) e `.env` (fatura) existem
- As variáveis estão preenchidas com os valores corretos do Supabase
- O servidor foi reiniciado após criar o arquivo `.env`

### Erro de conexão ao Supabase

- Verifique se a chave Anon está correta
- Verifique se a URL do projeto está correta
- Teste a conexão no Supabase Dashboard > API Docs

### Dados não carregando

- Verifique no browser console se há erros
- Confirme que as tabelas foram criadas no Supabase
- Verifique as RLS policies se estiverem habilitadas

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Cliente JavaScript Supabase](https://supabase.com/docs/reference/javascript)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)

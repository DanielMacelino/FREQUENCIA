# 🚀 Guia de Deploy em Produção

## Checklist Pré-Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Código testado localmente
- [ ] Supabase project criado e funcionando
- [ ] Tabelas criadas no Supabase
- [ ] RLS policies configuradas (para segurança)
- [ ] Build sem erros

## 📦 Arquivos Necessários

### Frontend (Frequência)

**Arquivo:** `frontend/.env.production`

```env
VITE_SUPABASE_URL=https://seu-projeto-prod.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-prod
VITE_API_URL=https://api.seudominio.com/api
```

**Build:**

```bash
cd frontend
npm run build
```

Saída em: `frontend/dist/`

### Fatura (CRA)

**Arquivo:** `fatura/client/.env.production`

```env
REACT_APP_SUPABASE_URL=https://seu-projeto-prod.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-anon-prod
```

**Build:**

```bash
cd fatura/client
npm run build
```

Saída em: `fatura/client/build/`

## 🌍 Opções de Deploy

### Opção 1: Vercel (Recomendado - Gratuito + Paid)

#### Frontend (Frequência)

1. Acesse https://vercel.com
2. Importe o repositório
3. Selecione pasta raiz: `frontend`
4. Configure variáveis de ambiente em **Settings > Environment Variables**
5. Deploy automático ao fazer push

#### Fatura

1. Crie novo projeto Vercel
2. Selecione pasta raiz: `fatura/client`
3. Configure variáveis de ambiente
4. Deploy

### Opção 2: Netlify (Gratuito + Paid)

1. Acesse https://netlify.com
2. Conecte seu repositório GitHub
3. Configure:
   - **Build command:** `npm run build` (frontend) ou `CI=false npm run build` (fatura)
   - **Publish directory:** `dist/` (frontend) ou `build/` (fatura)
4. Adicione variáveis de ambiente em **Site settings > Build & deploy > Environment**
5. Deploy

### Opção 3: Railway (Gratuito + Paid)

1. Acesse https://railway.app
2. Conecte GitHub
3. Crie novo projeto
4. Configure build command e variáveis
5. Deploy

### Opção 4: Docker + Cloud (AWS, GCP, Azure)

**Dockerfile para Frontend:**

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build e Deploy:**

```bash
docker build -t frequencia-app .
docker push seu-registry/frequencia-app
```

## 🔄 Pipeline CI/CD (GitHub Actions)

Arquivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm install
      
      - name: Build
        working-directory: ./frontend
        run: npm run build
      
      - name: Deploy to Vercel
        working-directory: ./frontend
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}

  deploy-fatura:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        working-directory: ./fatura/client
        run: npm install
      
      - name: Build
        working-directory: ./fatura/client
        run: CI=false npm run build
      
      - name: Deploy to Vercel
        working-directory: ./fatura/client
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN_FATURA }}
```

## 📊 Configurações do Supabase para Produção

### 1. Ativar RLS (Row Level Security)

**Frequências Table:**

```sql
ALTER TABLE frequencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas frequências"
ON frequencias FOR SELECT
USING (usuario = auth.uid()::text);

CREATE POLICY "Usuários inserem suas frequências"
ON frequencias FOR INSERT
WITH CHECK (usuario = auth.uid()::text);

CREATE POLICY "Usuários editam suas frequências"
ON frequencias FOR UPDATE
USING (usuario = auth.uid()::text);

CREATE POLICY "Usuários deletam suas frequências"
ON frequencias FOR DELETE
USING (usuario = auth.uid()::text);
```

**Gastos Table (sem restrição se for compartilhado):**

```sql
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode ler gastos"
ON gastos FOR SELECT
USING (true);

CREATE POLICY "Qualquer um pode inserir gastos"
ON gastos FOR INSERT
WITH CHECK (true);

CREATE POLICY "Qualquer um pode deletar gastos"
ON gastos FOR DELETE
USING (true);
```

### 2. Backup Automático

No Supabase Dashboard:
- Vá para **Settings > Backups**
- Escolha frequência de backup automático
- Configure retenção de backups

### 3. Monitoramento

- Ative **Auth > Rate Limiting**
- Configure **Logs** para monitorar erros
- Crie alertas em **Database > Monitoring**

## 📱 Domínio Customizado

### Frontend (Frequência)

Se usar Vercel:
1. Vá para **Domains** no projeto
2. Adicione seu domínio
3. Configure DNS records

Exemplo: `frequencia.seudominio.com`

### Fatura

Exemplo: `fatura.seudominio.com`

## 🔒 Variáveis de Ambiente de Produção

Nunca commit `.env.production` com valores reais!

**Frontend - .gitignore:**

```
.env.local
.env.production
.env.*.local
```

**Fatura - .gitignore:**

```
.env
.env.production
```

## ✅ Teste Pós-Deploy

1. Acesse o site em produção
2. Selecione um usuário
3. Teste criar frequência
4. Teste adicionar gasto
5. Verifique se dados salvam no Supabase
6. Teste deletar registros
7. Teste alternar entre Frequência e Fatura

## 📞 Suporte e Troubleshooting

### Erro 401 (Não autorizado)

- Verifique a chave Anon Key
- Confirme que RLS policies estão corretas

### Erro 403 (Proibido)

- Verifique RLS policies
- Confirme permissões do usuário

### Performance Lenta

- Adicione índices nas tabelas (veja SUPABASE_SETUP.md)
- Use CDN para arquivos estáticos
- Otimize queries

## 📈 Próximos Passos

1. **Implementar autenticação real** (Supabase Auth)
2. **Adicionar multi-language** (i18n)
3. **Melhorar UI/UX** com temas
4. **Implementar analytics** (Posthog, Mixpanel)
5. **Adicionar notificações** (Email, SMS)

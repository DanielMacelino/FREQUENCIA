# 🎯 COMECE AQUI - Guia Rápido para Produção

## ⚡ TL;DR (Versão Ultra Rápida)

1. Crie projeto em https://supabase.com
2. Execute SQL em `SUPABASE_SETUP.md` (Passo 2)
3. Configure `.env` files com URL e chave do Supabase
4. Rode `npm install` em frontend e fatura/client
5. Teste com `npm run dev` e `npm start`
6. Deploy com Vercel, Netlify ou Railway

---

## 📖 Documentação (Ordem de Leitura)

### 1. **Para Entender o Projeto** (5 min)
   - Arquivo: `README_PRODUCAO.md`
   - Contém: Features, arquitetura, tecnologias usadas

### 2. **Para Configurar Supabase** (30 min) ⭐ IMPORTANTE
   - Arquivo: `SUPABASE_SETUP.md`
   - Contém: Passo-a-passo completo (6 passos)
   - SQL para criar tabelas
   - Variáveis de ambiente
   - Como testar

### 3. **Para Ver Exemplos de Dados** (10 min)
   - Arquivo: `EXEMPLOS_DADOS.md`
   - Contém: Como ficam os dados no Supabase
   - Queries úteis
   - Dashboard mockups

### 4. **Para Deploy em Produção** (20 min)
   - Arquivo: `PRODUCAO.md`
   - Contém: Vercel, Netlify, Railway, Docker
   - CI/CD com GitHub Actions
   - Configurações de segurança

### 5. **Para Checklist Final** (5 min)
   - Arquivo: `CHECKLIST.md`
   - Contém: Lista completa de tarefas
   - Testes pré-deploy

---

## 🚀 Passos Rápidos (Copiar e Colar)

### Passo 1: Clonar e Instalar

```bash
cd /home/server/Documentos/projetos/FREQUENCIA

# Frontend
cd frontend
npm install

# Fatura
cd ../fatura/client
npm install
```

### Passo 2: Configurar .env

**Frontend:**
```bash
cp frontend/.env.example frontend/.env.local
# Edite com seu editor: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
```

**Fatura:**
```bash
cp fatura/client/.env.example fatura/client/.env
# Edite com seu editor: REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY
```

### Passo 3: Testar Localmente

**Terminal 1:**
```bash
cd frontend && npm run dev
# Acesse http://localhost:5173
```

**Terminal 2:**
```bash
cd fatura/client && npm start
# Acesse http://localhost:3000
```

### Passo 4: Deploy

Veja `PRODUCAO.md` para Vercel, Netlify ou Railway.

---

## 📋 Checklist Antes de Começar

- [ ] Você tem conta no Supabase? (https://supabase.com)
- [ ] Você tem Node.js 16+? (verifique com `node --version`)
- [ ] Você tem npm instalado? (verifique com `npm --version`)
- [ ] Você leu `SUPABASE_SETUP.md`?
- [ ] Você criou as tabelas no Supabase?
- [ ] Você configurou os `.env` files?

---

## 🆘 Problemas Comuns

### "Variáveis de ambiente não configuradas"
→ Veja `SUPABASE_SETUP.md` (Passo 3)

### "npm command not found"
→ Instale Node.js: https://nodejs.org/

### "Dados não salvam"
→ Verifique console do navegador (F12)
→ Confirme que as tabelas existem no Supabase
→ Veja `EXEMPLOS_DADOS.md`

### "Erro ao conectar Supabase"
→ Verifique a chave Anon Key
→ Verifique a URL do projeto
→ Teste em https://supabase.com/docs/reference/javascript

---

## 📚 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `SUPABASE_SETUP.md` | ⭐ Setup completo (COMECE AQUI DEPOIS) |
| `README_PRODUCAO.md` | Features e arquitetura |
| `PRODUCAO.md` | Deploy em produção |
| `EXEMPLOS_DADOS.md` | Exemplos de dados e queries |
| `CHECKLIST.md` | Checklist de tarefas |
| `INDICE.md` | Índice completo de documentação |

---

## ⏱️ Tempo Estimado

- Leitura de documentação: **30-45 min**
- Configuração Supabase: **15-20 min**
- Instalação de dependências: **5-10 min**
- Testes locais: **10-15 min**
- Deploy em produção: **10-20 min**

**Total**: ~2-3 horas para tudo pronto em produção

---

## 🎯 Próximo Passo

**Abra agora**: `SUPABASE_SETUP.md`

E siga os 6 passos descritos lá.

---

**Status**: ✅ Código pronto, você precisa apenas configurar Supabase!

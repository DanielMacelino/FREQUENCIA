# 🗄️ Como Executar o Script SQL no Supabase

## 📋 Pré-Requisitos

- ✅ Conta Supabase criada
- ✅ Projeto Supabase criado
- ✅ Acesso ao dashboard do Supabase

---

## 🚀 Passo-a-Passo (Com Imagens)

### PASSO 1: Acessar o SQL Editor

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. No menu à esquerda, clique em **SQL Editor**

```
Supabase Dashboard
├─ Authentication
├─ Database
├─ SQL Editor  ← CLIQUE AQUI
├─ Storage
├─ Realtime
└─ ...
```

### PASSO 2: Criar uma Nova Query

1. Clique em **+ New Query** (botão azul)
2. Dê um nome (ex: "Create Tables - Frequência Fatura")
3. Uma aba em branco vai aparecer

```
┌─────────────────────────────────────┐
│  New Query    │  Favorites  │ ...   │
├─────────────────────────────────────┤
│ + New Query                         │
├─────────────────────────────────────┤
│ [editor SQL vazio aqui]             │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### PASSO 3: Copiar o Script SQL

1. Abra o arquivo: `SQL_CRIAR_BANCO.sql`
2. Copie TUDO o conteúdo (Ctrl+A → Ctrl+C)

### PASSO 4: Colar no Editor SQL

1. Clique no editor SQL vazio no Supabase
2. Cole o código (Ctrl+V)
3. Você vai ver o script completo

```
editor sql:

-- =====================================================================
-- SCRIPT SQL PARA SUPABASE - FREQUÊNCIA + FATURA
-- =====================================================================
-- Este script cria as tabelas com suporte a múltiplos usuários
...
```

### PASSO 5: Executar o Script

1. Clique no botão azul **Run** (canto superior direito)
2. OU use o atalho: `Ctrl + Enter`
3. Aguarde a execução

```
┌─────────────────────────────────────┐
│  [Run] [Save] [Delete]              │
├─────────────────────────────────────┤
│ Script SQL...                       │
├─────────────────────────────────────┤
│ EXECUTION RESULTS                   │
│ ✓ Query executed successfully       │
│ Duration: 234ms                     │
└─────────────────────────────────────┘
```

### PASSO 6: Verificar Sucesso

Se você vir:
```
✓ Query executed successfully
Duration: XXXms
```

**Parabéns! As tabelas foram criadas! 🎉**

---

## ✅ Como Verificar se Funcionou

### Método 1: Verificar no Table Editor

1. No menu esquerdo, clique em **Table Editor**
2. Você deve ver as 3 tabelas:
   - `frequencias`
   - `gastos`
   - `usuarios`

```
Table Editor
├─ frequencias ✓
├─ gastos ✓
└─ usuarios ✓
```

### Método 2: Usar SELECT para Verificar

Execute estas queries uma por uma no SQL Editor:

**Query 1: Contar frequências**
```sql
SELECT COUNT(*) as total_frequencias FROM frequencias;
```

Resultado esperado:
```
total_frequencias
─────────────────
0
```

**Query 2: Contar gastos**
```sql
SELECT COUNT(*) as total_gastos FROM gastos;
```

Resultado esperado:
```
total_gastos
────────────
0
```

**Query 3: Listar usuários**
```sql
SELECT * FROM usuarios;
```

Resultado esperado:
```
id │ nome          │ email
───┼───────────────┼──────────────────
1  │ Daniel        │ daniel@exemplo.com
2  │ douglas       │ douglas@exemplo.com
3  │ Convidado 1   │ convidado1@exemplo.com
```

---

## 🔍 Estrutura das Tabelas Criadas

### Tabela: frequencias

```
┌─────────────────────────────────────────────────────────────┐
│ FREQUENCIAS                                                 │
├────┬──────────┬──────────┬───────┬───────────┬──────────────┤
│ id │ usuario  │ data     │ horas │ atividade │ observacao   │
├────┼──────────┼──────────┼───────┼───────────┼──────────────┤
│    │ Daniel   │ 2024-... │ 4.5   │ Dev       │              │
│    │ douglas  │ 2024-... │ 3.0   │ Testes    │              │
│    │ ...      │ ...      │ ...   │ ...       │ ...          │
└────┴──────────┴──────────┴───────┴───────────┴──────────────┘
```

### Tabela: gastos

```
┌──────────────────────────────────────────────────────────┐
│ GASTOS                                                   │
├────┬───────────┬────────┬──────────┬─────────┬───┬────┤
│ id │ descricao │ valor  │ categorias│ pessoa  │ano│mes │
├────┼───────────┼────────┼──────────┼─────────┼───┼────┤
│    │ Almoço    │ 45.50  │ Alimento │ Daniel  │...│... │
│    │ Uber      │ 35.00  │ Transpo. │ douglas │...│... │
│    │ ...       │ ...    │ ...      │ ...     │...│... │
└────┴───────────┴────────┴──────────┴─────────┴───┴────┘
```

### Tabela: usuarios

```
┌────────────────────────────────────────────────┐
│ USUARIOS                                       │
├────┬──────────────┬────────────────────────────┤
│ id │ nome         │ email                      │
├────┼──────────────┼────────────────────────────┤
│ 1  │ Daniel       │ daniel@exemplo.com         │
│ 2  │ douglas      │ douglas@exemplo.com        │
│ 3  │ Convidado 1  │ convidado1@exemplo.com     │
└────┴──────────────┴────────────────────────────┘
```

---

## ❓ Se der Erro

### Erro: "CREATE TABLE already exists"

**Solução**: Isso é normal! A tabela já existe de uma tentativa anterior.
- Você pode ignorar o erro
- Ou adicionar `IF NOT EXISTS` (já está no script!)

### Erro: "Permission denied"

**Solução**: 
1. Verifique se você está logado na conta correta
2. Confirme que tem permissão de admin no projeto
3. Se necessário, recrie o projeto

### Erro: "Syntax error"

**Solução**:
1. Verifique se copiou o script inteiro
2. Não deixe partes do script de fora
3. Tente copiar novamente

---

## 🔐 Ativar Segurança (RLS) - OPCIONAL

Se quiser ativar segurança (Row Level Security):

1. No script `SQL_CRIAR_BANCO.sql`, procure por:
   ```
   -- ALTER TABLE frequencias ENABLE ROW LEVEL SECURITY;
   ```

2. Remova o `--` do início (descomente)

3. Execute o script novamente

Isso vai garantir que:
- Cada usuário vê apenas suas próprias frequências
- Ninguém consegue acessar dados de outro usuário

---

## ✨ Próximos Passos

1. ✅ Executar o script SQL (você está aqui!)
2. ⏭️ Configurar variáveis de ambiente (.env)
3. ⏭️ Testar localmente com `npm run dev`
4. ⏭️ Deploy em produção

---

## 📞 Checklist Final

- [ ] Acessei https://app.supabase.com
- [ ] Selecionei meu projeto
- [ ] Abri o SQL Editor
- [ ] Copiei o script `SQL_CRIAR_BANCO.sql`
- [ ] Colei no editor SQL
- [ ] Cliquei em "Run"
- [ ] Vi mensagem "Query executed successfully"
- [ ] Verifiquei as 3 tabelas no Table Editor
- [ ] Os usuários aparecem na tabela `usuarios`

**Se tudo está OK, você está pronto para configurar o .env!** 🚀

---

**Próximo arquivo a abrir**: `SUPABASE_SETUP.md` (Passo 3 - Configurar .env)

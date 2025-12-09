# 📊 Exemplos de Dados no Supabase

## Tabela: frequencias

| id | usuario | data | horas | atividade | observacao | ano | mes | created_at |
|----|---------|------|-------|-----------|-----------|-----|-----|-----------|
| 1 | Daniel | 2024-12-09 | 4.5 | Desenvolvimento | Frontend do menu | 2024 | 12 | 2024-12-09 10:30:00 |
| 2 | Daniel | 2024-12-10 | 6.0 | Reunião | Discussão do projeto | 2024 | 12 | 2024-12-09 14:15:00 |
| 3 | douglas | 2024-12-09 | 3.0 | Testes | Testes de integração | 2024 | 12 | 2024-12-09 11:20:00 |
| 4 | Convidado 1 | 2024-12-08 | 2.5 | Documentação | Escrita de README | 2024 | 12 | 2024-12-08 16:45:00 |

### Query Exemplo

```sql
-- Buscar frequências de Daniel em dezembro/2024
SELECT * FROM frequencias 
WHERE usuario = 'Daniel' 
AND ano = 2024 
AND mes = 12
ORDER BY data ASC;

-- Total de horas por usuário
SELECT usuario, SUM(horas) as total_horas 
FROM frequencias 
WHERE ano = 2024 AND mes = 12
GROUP BY usuario;
```

---

## Tabela: gastos

| id | descricao | valor | categorias | pessoa | mes | ano | data_criacao |
|----|-----------|-------|-----------|--------|-----|-----|-------------|
| 1 | Almoço | 45.50 | Alimentação | Daniel | 12 | 2024 | 2024-12-09 12:00:00 |
| 2 | Combustível | 85.00 | Transporte | douglas | 12 | 2024 | 2024-12-09 13:30:00 |
| 3 | Cinema | 60.00 | Entretenimento | Daniel | 12 | 2024 | 2024-12-09 18:00:00 |
| 4 | Supermercado | 120.00 | Alimentos | Convidado 1 | 12 | 2024 | 2024-12-08 15:00:00 |
| 5 | Uber | 35.50 | Transporte | Daniel | 12 | 2024 | 2024-12-09 19:00:00 |

### Queries Exemplo

```sql
-- Gastos por pessoa em dezembro
SELECT pessoa, SUM(valor) as total 
FROM gastos 
WHERE ano = 2024 AND mes = 12
GROUP BY pessoa
ORDER BY total DESC;

-- Gastos por categoria
SELECT categorias, SUM(valor) as total 
FROM gastos 
WHERE ano = 2024 AND mes = 12
GROUP BY categorias
ORDER BY total DESC;

-- Total geral
SELECT SUM(valor) as total_geral 
FROM gastos 
WHERE ano = 2024 AND mes = 12;

-- Gastos de Daniel
SELECT * FROM gastos 
WHERE pessoa = 'Daniel' 
AND ano = 2024 
AND mes = 12
ORDER BY data_criacao DESC;
```

---

## Visualização no Dashboard - Frequência

### Exemplo: Período de 20/11/2024 a 19/12/2024

```
═════════════════════════════════════════════════════════════════
  Sistema de Frequência - PET Saúde Digital
  Usuário: Daniel

═════════════════════════════════════════════════════════════════

  📊 ESTATÍSTICAS DO PERÍODO
  ─────────────────────────────
  Total de Horas: 10.5h
  Registros: 2
  Período: 20/11 - 19/12/2024

═════════════════════════════════════════════════════════════════

  📅 NOVEMBRO 2024
  
    Dom  Seg  Ter  Qua  Qui  Sex  Sab
                               20   21
     22   23   24   25   26   27   28
     29   30

═════════════════════════════════════════════════════════════════

  📅 DEZEMBRO 2024
  
    Dom  Seg  Ter  Qua  Qui  Sex  Sab
                                1    2
      3    4    5    6    7    8    9*
     10*  11   12   13   14   15   16
     17   18   19   20   21   22   23
     24   25   26   27   28   29   30
     31

  * = com frequência registrada

═════════════════════════════════════════════════════════════════

  📋 LISTAGEM DE FREQUÊNCIAS
  
  09/12/2024 | 4.5h | Desenvolvimento | Frontend do menu
  10/12/2024 | 6.0h | Reunião | Discussão do projeto

═════════════════════════════════════════════════════════════════
```

---

## Visualização no Dashboard - Fatura

### Exemplo: Dezembro 2024

```
═════════════════════════════════════════════════════════════════
           💳 Controle de Fatura
           Gerenciamento de gastos do cartão compartilhado

═════════════════════════════════════════════════════════════════

  📊 GRÁFICOS
  ──────────────────────────────────────────────────────────
  
  Gastos por Pessoa:
  ┌─ Daniel        └─────────────────── 140.50 (52%)
  ├─ douglas       └─────── 85.00 (32%)
  └─ Convidado 1   └─── 120.00 (16%)
  
  Gastos por Categoria:
  ┌─ Transporte    └─────────────── 120.50 (45%)
  ├─ Alimentação   └─────── 45.50 (17%)
  ├─ Alimentos     └─────── 120.00 (45%)
  └─ Entretenimento└─ 60.00 (22%)

═════════════════════════════════════════════════════════════════

  💰 GASTOS POR PESSOA
  
  Daniel:
    → Almoço: R$ 45.50
    → Cinema: R$ 60.00
    → Uber: R$ 35.50
    Total: R$ 140.50

  douglas:
    → Combustível: R$ 85.00
    Total: R$ 85.00

  Convidado 1:
    → Supermercado: R$ 120.00
    Total: R$ 120.00

═════════════════════════════════════════════════════════════════

  📋 TODOS OS GASTOS
  
  Data      │ Descrição      │ Valor  │ Categoria      │ Pessoa
  ──────────┼────────────────┼────────┼────────────────┼──────────────
  09/12/24  │ Almoço         │ 45.50  │ Alimentação    │ Daniel
  09/12/24  │ Combustível    │ 85.00  │ Transporte     │ douglas
  09/12/24  │ Cinema         │ 60.00  │ Entretenimento │ Daniel
  08/12/24  │ Supermercado   │ 120.00 │ Alimentos      │ Convidado 1
  09/12/24  │ Uber           │ 35.50  │ Transporte     │ Daniel

═════════════════════════════════════════════════════════════════

  💵 RESUMO FINAL
  
  Total Daniel:        R$ 140.50
  Total douglas:       R$  85.00
  Total Convidado 1:   R$ 120.00
  ─────────────────────────────────
  TOTAL GERAL:         R$ 345.50

═════════════════════════════════════════════════════════════════
```

---

## Estrutura de Dados Completa

### Frequencia Object (TypeScript)

```typescript
interface Frequencia {
  id?: number;
  usuario: string;        // 'Daniel', 'douglas', 'Convidado 1'
  data: string;          // 'YYYY-MM-DD'
  horas: number;         // Ex: 4.5
  atividade: string;     // Ex: 'Desenvolvimento'
  observacao?: string;   // Ex: 'Frontend do menu'
  ano: number;           // Ex: 2024
  mes: number;           // Ex: 12
  created_at?: string;   // timestamp automático
  updated_at?: string;   // timestamp automático
}
```

### Gasto Object (TypeScript)

```typescript
interface Gasto {
  id: number;
  descricao: string;     // Ex: 'Almoço'
  valor: number;         // Ex: 45.50
  categorias: string;    // Ex: 'Alimentação'
  pessoa: string;        // Ex: 'Daniel'
  mes: number;           // Ex: 12
  ano: number;           // Ex: 2024
  data_criacao?: string; // timestamp automático
}
```

---

## Índices Recomendados (Performance)

```sql
-- Frequências
CREATE INDEX idx_frequencias_usuario ON frequencias(usuario);
CREATE INDEX idx_frequencias_periodo ON frequencias(ano, mes);
CREATE INDEX idx_frequencias_usuario_periodo ON frequencias(usuario, ano, mes);

-- Gastos
CREATE INDEX idx_gastos_periodo ON gastos(ano, mes);
CREATE INDEX idx_gastos_pessoa ON gastos(pessoa);
```

---

## Consultas Úteis para Análise

### Total de Horas por Usuário (Período)

```sql
SELECT 
  usuario,
  SUM(horas) as total_horas,
  COUNT(*) as total_registros,
  AVG(horas) as media_horas
FROM frequencias
WHERE ano = 2024 AND mes = 12
GROUP BY usuario
ORDER BY total_horas DESC;
```

### Gastos por Categoria (Análise)

```sql
SELECT 
  categorias,
  SUM(valor) as total,
  COUNT(*) as quantidade,
  AVG(valor) as valor_medio,
  ROUND(SUM(valor) * 100.0 / 
    (SELECT SUM(valor) FROM gastos WHERE ano = 2024 AND mes = 12), 2) as percentual
FROM gastos
WHERE ano = 2024 AND mes = 12
GROUP BY categorias
ORDER BY total DESC;
```

### Quem Gasta Mais (Top Gastos)

```sql
SELECT 
  pessoa,
  SUM(valor) as total_gasto,
  COUNT(*) as total_transacoes,
  AVG(valor) as ticket_medio
FROM gastos
WHERE ano = 2024 AND mes = 12
GROUP BY pessoa
ORDER BY total_gasto DESC;
```

---

## Backup de Dados

### Exportar Frequências (CSV)

```sql
COPY (
  SELECT * FROM frequencias
  WHERE ano = 2024 AND mes = 12
  ORDER BY data
) TO STDOUT WITH CSV HEADER;
```

### Exportar Gastos (CSV)

```sql
COPY (
  SELECT * FROM gastos
  WHERE ano = 2024 AND mes = 12
  ORDER BY data_criacao
) TO STDOUT WITH CSV HEADER;
```

---

✅ Assim que você criar dados no Supabase, eles aparecem exatamente neste formato!

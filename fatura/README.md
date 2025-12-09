# 💳 Controle de Fatura

Sistema profissional de controle de fatura de cartão de crédito compartilhado.

## ⚠️ IMPORTANTE: Instalar Node.js Primeiro!

**Antes de começar, você precisa instalar o Node.js:**

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendada)
3. Execute o instalador
4. **Feche e abra novamente o terminal** após a instalação

### Verificar Instalação

Execute no PowerShell:
```powershell
node --version
npm --version
```

Se aparecerem números de versão, está tudo certo!

**Ou execute o script de verificação:**
```powershell
.\verificar-node.ps1
```

---

## 🚀 Funcionalidades

- ✅ Seleção de mês e ano para visualização
- ✅ Visualização de fatura para meses passados (somente leitura)
- ✅ Adição de gastos para o mês atual
- ✅ Categorização múltipla (Coisas de Casa, Alimentação, Besteira, Viagens, Outros)
- ✅ Identificação de quem fez a compra (Daniel, Douglas, Casa)
- ✅ Gráficos interativos (pizza e barras)
- ✅ Estatísticas detalhadas
- ✅ Interface moderna e responsiva

## 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior) - [Baixar aqui](https://nodejs.org/)
- npm (vem junto com o Node.js)

## 🛠️ Instalação

### 1. Instalar Node.js (se ainda não tiver)

Acesse https://nodejs.org/ e baixe a versão LTS.

### 2. Instalar Dependências do Projeto

Após instalar o Node.js e **fechar/abrir o terminal novamente**, execute:

```bash
npm run install-all
```

Isso instalará todas as dependências do backend e frontend.

## 🎯 Como Usar

### ⚠️ Se `npm run dev` der erro "spawn cmd.exe ENOENT"

**Use terminais separados (Solução mais confiável):**

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend (abra um novo terminal):**
```powershell
cd client
npm start
```

**Ou use o script PowerShell:**
```powershell
.\start-dev-separado.ps1
```

### Iniciar o Sistema Completo (se funcionar)

```bash
npm run dev
```

Isso iniciará automaticamente:
- **Backend** na porta 5000
- **Frontend** na porta 3000

### Ou Iniciar Separadamente

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend (em outro terminal):**
```bash
cd client
npm install
npm start
```

### Acessar o Sistema

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📁 Estrutura do Projeto

```
fatura/
├── server/          # Backend (Node.js + Express + SQLite)
│   ├── index.js     # Servidor principal
│   └── package.json
├── client/          # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── types.ts
│   └── package.json
├── package.json     # Scripts principais
└── verificar-node.ps1  # Script de verificação
```

## 📊 Funcionalidades Principais

### Seleção de Mês
- Escolha qualquer mês/ano para visualizar a fatura
- Meses passados: apenas visualização
- Mês atual: permite adicionar novos gastos

### Adicionar Gastos
- Descrição do gasto
- Valor em reais
- Múltiplas categorias
- Identificação da pessoa (Daniel/Douglas/Casa)

### Visualização
- Lista completa de gastos do mês
- Total da fatura
- Gráficos de distribuição
- Estatísticas por pessoa e categoria

## 🗄️ Banco de Dados

O sistema utiliza SQLite para armazenamento local. O banco de dados é criado automaticamente na primeira execução em `server/database.sqlite`.

## 🎨 Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Chart.js
- **Backend:** Node.js, Express
- **Banco de Dados:** SQLite
- **Estilização:** CSS3 com design moderno

## ❓ Problemas Comuns

### "npm não é reconhecido"
- Certifique-se de que o Node.js foi instalado
- **Feche e abra novamente o terminal** após instalar
- Reinicie o Cursor/IDE

### Porta já em uso
- Feche outros programas que possam estar usando as portas 3000 ou 5000

### Erro de permissão
- Execute o terminal como administrador (se necessário)

## 📝 Notas

- O banco de dados SQLite será criado automaticamente na primeira execução
- Todos os dados são persistidos localmente
- Para produção, considere migrar para PostgreSQL ou MySQL

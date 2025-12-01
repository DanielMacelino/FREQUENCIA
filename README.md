# Sistema de Frequência - PET Saúde Digital

Sistema web completo para registro e controle de frequência da bolsa de estudo PET Saúde Digital.

## 📋 Funcionalidades

- ✅ Dashboard com calendário interativo
- ✅ Registro de atividades (data, horas, atividade, observação)
- ✅ Listagem mensal automática
- ✅ Cálculo automático de horas totais
- ✅ Período específico: dia 20 ao dia 19 do próximo mês
- ✅ Edição e exclusão de registros
- ✅ Interface moderna e responsiva

## 🚀 Tecnologias

### Backend
- Node.js + Express
- TypeScript
- SQLite

### Frontend
- React + TypeScript
- Vite
- date-fns
- Axios

## 📦 Instalação

1. Instale as dependências de todos os projetos:

```bash
npm run install:all
```

Ou instale manualmente:

```bash
# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

## 🏃 Executando o Projeto

### Desenvolvimento

Execute o backend e frontend em terminais separados:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

O backend estará disponível em: `http://localhost:3001`
O frontend estará disponível em: `http://localhost:3000`

### Produção

```bash
# Build do backend
npm run build:backend

# Build do frontend
npm run build:frontend
```

## 📁 Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   │   ├── server.ts          # Servidor Express
│   │   ├── database.ts         # Configuração do banco de dados
│   │   └── routes/
│   │       └── frequencia.ts   # Rotas da API
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.tsx   # Página principal
│   │   ├── services/
│   │   │   └── api.ts           # Serviço de API
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🎯 Como Usar

1. Acesse o sistema em `http://localhost:3000`
2. Clique em "Nova Frequência" para registrar uma atividade
3. Preencha os dados:
   - Data da atividade
   - Horas trabalhadas
   - Descrição da atividade
   - Observações (opcional)
4. Visualize no calendário os dias com frequência registrada
5. Veja o total de horas no período (dia 20 ao dia 19 do próximo mês)
6. Edite ou exclua registros clicando nos botões correspondentes

## 📊 API Endpoints

- `GET /api/frequencias` - Lista todas as frequências
- `GET /api/frequencias/periodo/:ano/:mes` - Lista frequências do período
- `GET /api/frequencias/:id` - Busca frequência por ID
- `POST /api/frequencias` - Cria nova frequência
- `PUT /api/frequencias/:id` - Atualiza frequência
- `DELETE /api/frequencias/:id` - Deleta frequência
- `GET /api/frequencias/stats/geral` - Estatísticas gerais

## 📝 Licença

MIT


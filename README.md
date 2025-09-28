# 🌊 Maré ERP - Sistema de Gestão Empresarial

Sistema completo de gestão empresarial desenvolvido com Next.js, TypeScript, Prisma e PostgreSQL.

## ✨ Funcionalidades

- 🔐 **Autenticação completa** - Login/registro com JWT
- 📊 **Dashboard** - Métricas e visão geral do negócio
- 👥 **Gestão de Clientes** - Cadastro e controle completo
- 📦 **Controle de Estoque** - Produtos e serviços
- 💰 **Módulo Financeiro** - Entradas, saídas e fluxo de caixa
- 🛒 **Gestão de Vendas** - Pedidos e orçamentos
- 🏢 **Multi-empresa** - Suporte a múltiplos workspaces

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 18+
- Docker
- Git

### 1. Extrair e instalar
```bash
unzip mare-erp-otimizado.zip
cd mare-erp-otimizado
npm install
```

### 2. Configurar banco de dados
```bash
# Iniciar PostgreSQL com Docker
docker run -d --name postgres-mare \\
  -e POSTGRES_USER=postgres \\
  -e POSTGRES_PASSWORD=123456 \\
  -e POSTGRES_DB=mare_erp \\
  -p 5432:5432 \\
  postgres:15

# Aguardar 10 segundos para inicializar
sleep 10
```

### 3. Configurar banco
```bash
# Aplicar migrações
npx prisma migrate dev --name init

# Popular com dados de exemplo
npx tsx prisma/seed.ts
```

### 4. Iniciar aplicação
```bash
npm run dev
```

### 5. Acessar sistema
- **URL**: http://localhost:3000
- **Email**: admin@teste.com
- **Senha**: 123456

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar em modo desenvolvimento
npm run build           # Build para produção
npm run start           # Iniciar em produção

# Banco de dados
npx prisma studio       # Interface visual do banco
npx prisma generate     # Gerar cliente Prisma
npx prisma migrate dev  # Aplicar migrações
npx prisma db seed      # Popular banco com dados

# Docker
docker ps               # Ver containers rodando
docker logs postgres-mare  # Ver logs do PostgreSQL
```

## 📁 Estrutura do Projeto

```
mare-erp-otimizado/
├── src/
│   ├── app/                 # Páginas Next.js 14
│   │   ├── (auth)/         # Grupo de rotas de autenticação
│   │   ├── api/            # API Routes
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── clients/        # Gestão de clientes
│   │   ├── products/       # Controle de estoque
│   │   └── transactions/   # Módulo financeiro
│   ├── components/         # Componentes React
│   └── lib/               # Utilitários e configurações
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── seed.ts           # Dados iniciais
└── public/               # Arquivos estáticos
```

## 🎨 Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco**: PostgreSQL + Prisma ORM
- **Autenticação**: JWT + bcrypt
- **Icons**: Lucide React

## 🔧 Configuração Avançada

### Variáveis de Ambiente (.env)
```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/mare_erp?schema=public"
JWT_SECRET="mare-erp-jwt-secret-key-2024"
NEXTAUTH_SECRET="mare-erp-nextauth-secret-2024"
NEXTAUTH_URL="http://localhost:3000"
```

### Configuração para Produção
1. Configure um banco PostgreSQL em produção
2. Atualize a `DATABASE_URL`
3. Execute `npm run build`
4. Execute `npm run start`

## 📊 Dados de Exemplo

O sistema vem com dados pré-configurados:
- **1 usuário admin**: admin@teste.com / 123456
- **3 clientes** de exemplo
- **4 produtos** (incluindo um com estoque baixo)
- **2 pedidos** de exemplo
- **3 transações financeiras**

## 🐛 Solução de Problemas

### Erro de conexão com banco
```bash
# Verificar se o PostgreSQL está rodando
docker ps | grep postgres

# Reiniciar container se necessário
docker restart postgres-mare
```

### Erro de migração
```bash
# Resetar banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset --force

# Aplicar migrações novamente
npx prisma migrate dev
```

### Porta em uso
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar porta diferente
npm run dev -- -p 3001
```

## 📈 Performance

- ✅ Consultas otimizadas com índices
- ✅ Paginação em todas as listagens
- ✅ Lazy loading de componentes
- ✅ Compressão de assets
- ✅ Cache de queries do Prisma

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Middleware de proteção de rotas
- ✅ Validação de dados de entrada
- ✅ Sanitização de queries
- ✅ Headers de segurança

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção de solução de problemas
2. Consulte os logs da aplicação
3. Verifique se todas as dependências estão instaladas

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para gestão empresarial eficiente**

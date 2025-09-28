#!/bin/bash

# 🌊 Maré ERP - Script de Instalação Automática
# Este script configura automaticamente o ambiente completo

set -e  # Parar em caso de erro

echo "🌊 Iniciando instalação do Maré ERP..."
echo "========================================"

# Verificar pré-requisitos
echo "📋 Verificando pré-requisitos..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale Docker primeiro."
    exit 1
fi

echo "✅ Pré-requisitos verificados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar banco de dados
echo "🐘 Configurando PostgreSQL..."

# Parar container existente se houver
docker stop postgres-mare 2>/dev/null || true
docker rm postgres-mare 2>/dev/null || true

# Iniciar novo container PostgreSQL
docker run -d --name postgres-mare \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=mare_erp \
  -p 5432:5432 \
  postgres:15

echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 15

# Verificar se o container está rodando
if ! docker ps | grep -q postgres-mare; then
    echo "❌ Erro ao iniciar PostgreSQL"
    exit 1
fi

echo "✅ PostgreSQL iniciado com sucesso"

# Configurar Prisma
echo "🔧 Configurando banco de dados..."
npx prisma generate
npx prisma migrate dev --name init

# Popular banco com dados
echo "🌱 Populando banco com dados de exemplo..."
npx tsx prisma/seed.ts

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo "========================================"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute: npm run dev"
echo "2. Acesse: http://localhost:3000"
echo "3. Faça login com:"
echo "   📧 Email: admin@teste.com"
echo "   🔑 Senha: 123456"
echo ""
echo "🚀 Para iniciar o sistema agora:"
echo "npm run dev"
echo ""
echo "💡 Comandos úteis:"
echo "- npm run dev      # Iniciar desenvolvimento"
echo "- npm run build    # Build para produção"
echo "- npx prisma studio # Interface do banco"
echo ""
echo "🐛 Em caso de problemas:"
echo "- Verifique se a porta 5432 está livre"
echo "- Execute: docker logs postgres-mare"
echo "- Consulte o README.md para mais detalhes"

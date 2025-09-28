import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Empresa Demo'
    }
  })

  console.log('✅ Workspace criado:', workspace.name)

  // Create admin user
  const hashedPassword = await bcrypt.hash('123456', 12)
  const user = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@teste.com',
      password: hashedPassword
    }
  })

  console.log('✅ Usuário criado:', user.email)

  // Create workspace membership
  await prisma.workspaceMember.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      role: 'ADMIN'
    }
  })

  console.log('✅ Membership criado')

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'João Silva',
        document: '12345678901',
        email: 'joao@email.com',
        phone: '(11) 99999-1111',
        workspaceId: workspace.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Maria Santos',
        document: '98765432100',
        email: 'maria@email.com',
        phone: '(11) 99999-2222',
        workspaceId: workspace.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Empresa ABC Ltda',
        document: '12345678000199',
        email: 'contato@empresaabc.com',
        phone: '(11) 3333-4444',
        workspaceId: workspace.id
      }
    })
  ])

  console.log('✅ Clientes criados:', clients.length)

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Produto A',
        sku: 'PROD-001',
        price: 99.90,
        costPrice: 50.00,
        quantity: 100,
        minStock: 10,
        isService: false,
        workspaceId: workspace.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Produto B',
        sku: 'PROD-002',
        price: 149.90,
        costPrice: 75.00,
        quantity: 50,
        minStock: 5,
        isService: false,
        workspaceId: workspace.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Consultoria',
        price: 200.00,
        quantity: 0,
        minStock: 0,
        isService: true,
        workspaceId: workspace.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Produto C - Estoque Baixo',
        sku: 'PROD-003',
        price: 79.90,
        costPrice: 40.00,
        quantity: 3,
        minStock: 10,
        isService: false,
        workspaceId: workspace.id
      }
    })
  ])

  console.log('✅ Produtos criados:', products.length)

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      clientId: clients[0].id,
      totalAmount: 299.70,
      status: 'SOLD',
      workspaceId: workspace.id,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: 99.90
          },
          {
            productId: products[1].id,
            quantity: 1,
            unitPrice: 149.90
          }
        ]
      }
    }
  })

  const order2 = await prisma.order.create({
    data: {
      clientId: clients[1].id,
      totalAmount: 200.00,
      status: 'BUDGET',
      workspaceId: workspace.id,
      items: {
        create: [
          {
            productId: products[2].id,
            quantity: 1,
            unitPrice: 200.00
          }
        ]
      }
    }
  })

  console.log('✅ Pedidos criados:', 2)

  // Create sample transactions
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        description: 'Venda para João Silva',
        amount: 299.70,
        type: 'INCOME',
        status: 'PAID',
        dueDate: new Date(),
        paidAt: new Date(),
        category: 'Vendas',
        orderId: order1.id,
        workspaceId: workspace.id
      }
    }),
    prisma.transaction.create({
      data: {
        description: 'Pagamento fornecedor',
        amount: 500.00,
        type: 'EXPENSE',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        category: 'Fornecedores',
        workspaceId: workspace.id
      }
    }),
    prisma.transaction.create({
      data: {
        description: 'Aluguel do escritório',
        amount: 1200.00,
        type: 'EXPENSE',
        status: 'PAID',
        dueDate: new Date(),
        paidAt: new Date(),
        category: 'Despesas Fixas',
        workspaceId: workspace.id
      }
    })
  ])

  console.log('✅ Transações criadas:', transactions.length)

  console.log('🎉 Seed concluído com sucesso!')
  console.log('📧 Email: admin@teste.com')
  console.log('🔑 Senha: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

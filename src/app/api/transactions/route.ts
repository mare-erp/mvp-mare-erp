import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/transactions - List transactions with filters
export async function GET(request: NextRequest) {
  try {
    const workspaceId = request.headers.get('x-workspace-id')
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // 'INCOME' or 'EXPENSE'
    const status = searchParams.get('status') // 'PENDING', 'PAID', 'OVERDUE'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { workspaceId }
    
    if (type) {
      where.type = type
    }
    
    if (status) {
      where.status = status
    }
    
    if (startDate || endDate) {
      where.dueDate = {}
      if (startDate) where.dueDate.gte = new Date(startDate)
      if (endDate) where.dueDate.lte = new Date(endDate)
    }

    // Parallel queries
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        select: {
          id: true,
          description: true,
          amount: true,
          type: true,
          status: true,
          dueDate: true,
          paidAt: true,
          category: true,
          createdAt: true,
          order: {
            select: {
              id: true,
              client: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { dueDate: 'asc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({ where })
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const workspaceId = request.headers.get('x-workspace-id')
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 403 })
    }

    const { description, amount, type, dueDate, category, orderId } = await request.json()

    // Validation
    if (!description || !amount || !type || !dueDate) {
      return NextResponse.json({ 
        error: 'Descrição, valor, tipo e data de vencimento são obrigatórios' 
      }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Valor deve ser maior que zero' }, { status: 400 })
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json({ error: 'Tipo deve ser INCOME ou EXPENSE' }, { status: 400 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        dueDate: new Date(dueDate),
        category,
        orderId: orderId || null,
        workspaceId
      }
    })

    return NextResponse.json({ transaction }, { status: 201 })

  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products - List products with pagination and search
export async function GET(request: NextRequest) {
  try {
    const workspaceId = request.headers.get('x-workspace-id')
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const lowStock = searchParams.get('lowStock') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { workspaceId }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (lowStock) {
      where.AND = [
        { isService: false },
        { quantity: { lte: prisma.product.fields.minStock } }
      ]
    }

    // Parallel queries
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          costPrice: true,
          quantity: true,
          minStock: true,
          isService: true,
          createdAt: true
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const workspaceId = request.headers.get('x-workspace-id')
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 403 })
    }

    const { name, description, price, costPrice, quantity, sku, isService, minStock } = await request.json()

    // Validation
    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 })
    }

    if (price < 0 || (costPrice && costPrice < 0)) {
      return NextResponse.json({ error: 'Preços não podem ser negativos' }, { status: 400 })
    }

    // Check for duplicate SKU if provided
    if (sku) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          workspaceId,
          sku
        }
      })

      if (existingProduct) {
        return NextResponse.json({ error: 'Produto com este SKU já existe' }, { status: 409 })
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        costPrice: costPrice ? parseFloat(costPrice) : null,
        quantity: isService ? 0 : (quantity || 0),
        sku,
        isService: !!isService,
        minStock: isService ? 0 : (minStock || 5),
        workspaceId
      }
    })

    return NextResponse.json({ product }, { status: 201 })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

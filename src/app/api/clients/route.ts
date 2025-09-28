import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/clients - List clients with pagination and search
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

    const skip = (page - 1) * limit

    // Build where clause for search
    const where: any = { workspaceId }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { document: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Parallel queries for better performance
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        select: {
          id: true,
          name: true,
          document: true,
          email: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.client.count({ where })
    ])

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST /api/clients - Create new client
export async function POST(request: NextRequest) {
  try {
    const workspaceId = request.headers.get('x-workspace-id')
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 403 })
    }

    const { name, document, email, phone } = await request.json()

    // Validation
    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    // Check for duplicate document if provided
    if (document) {
      const existingClient = await prisma.client.findFirst({
        where: {
          workspaceId,
          document
        }
      })

      if (existingClient) {
        return NextResponse.json({ error: 'Cliente com este documento já existe' }, { status: 409 })
      }
    }

    // Check for duplicate email if provided
    if (email) {
      const existingClient = await prisma.client.findFirst({
        where: {
          workspaceId,
          email
        }
      })

      if (existingClient) {
        return NextResponse.json({ error: 'Cliente com este email já existe' }, { status: 409 })
      }
    }

    const client = await prisma.client.create({
      data: {
        name,
        document,
        email,
        phone,
        workspaceId
      }
    })

    return NextResponse.json({ client }, { status: 201 })

  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

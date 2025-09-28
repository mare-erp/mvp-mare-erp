import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const workspaceId = request.headers.get('x-workspace-id')

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Workspace não encontrado' },
        { status: 403 }
      )
    }

    // Get current month dates
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Optimized parallel queries
    const [
      totalClients,
      totalProducts,
      lowStockProducts,
      currentMonthSales,
      pendingReceivables,
      pendingPayables,
      recentOrders
    ] = await Promise.all([
      // Total clients - simple count
      prisma.client.count({
        where: { workspaceId }
      }),

      // Total products - simple count
      prisma.product.count({
        where: { workspaceId }
      }),

      // Low stock products - optimized with index
      prisma.product.count({
        where: {
          workspaceId,
          isService: false,
          quantity: { lte: 5 }
        }
      }),

      // Current month sales - aggregated
      prisma.order.aggregate({
        where: {
          workspaceId,
          status: 'SOLD',
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd
          }
        },
        _sum: { totalAmount: true },
        _count: true
      }),

      // Pending receivables - aggregated
      prisma.transaction.aggregate({
        where: {
          workspaceId,
          type: 'INCOME',
          status: 'PENDING'
        },
        _sum: { amount: true }
      }),

      // Pending payables - aggregated
      prisma.transaction.aggregate({
        where: {
          workspaceId,
          type: 'EXPENSE',
          status: 'PENDING'
        },
        _sum: { amount: true }
      }),

      // Recent orders - limited and optimized
      prisma.order.findMany({
        where: { workspaceId },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          client: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5 // Reduced from 10 for better performance
      })
    ])

    // Calculate cash flow
    const cashFlow = (pendingReceivables._sum.amount || 0) - (pendingPayables._sum.amount || 0)

    const dashboard = {
      overview: {
        totalClients,
        totalProducts,
        lowStockProducts,
        currentMonthRevenue: currentMonthSales._sum.totalAmount || 0,
        currentMonthOrders: currentMonthSales._count || 0
      },
      financial: {
        pendingReceivables: pendingReceivables._sum.amount || 0,
        pendingPayables: pendingPayables._sum.amount || 0,
        cashFlow
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        clientName: order.client.name,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }))
    }

    return NextResponse.json({ dashboard })

  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

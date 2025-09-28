'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react'

interface DashboardData {
  overview: {
    totalClients: number
    totalProducts: number
    lowStockProducts: number
    currentMonthRevenue: number
    currentMonthOrders: number
  }
  financial: {
    pendingReceivables: number
    pendingPayables: number
    cashFlow: number
  }
  recentOrders: Array<{
    id: string
    clientName: string
    totalAmount: number
    status: string
    createdAt: string
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const result = await response.json()
        setData(result.dashboard)
      } else {
        setError('Erro ao carregar dados do dashboard')
      }
    } catch (err) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SOLD': return 'status-success'
      case 'BUDGET': return 'status-info'
      case 'CANCELED': return 'status-error'
      default: return 'status-info'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SOLD': return 'Vendido'
      case 'BUDGET': return 'Orçamento'
      case 'CANCELED': return 'Cancelado'
      default: return status
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Carregando dashboard...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Visão geral do seu negócio</p>
        </div>

        {data && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{data.overview.totalClients}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Produtos</p>
                    <p className="text-2xl font-bold text-gray-900">{data.overview.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Estoque Baixo</p>
                    <p className="text-2xl font-bold text-yellow-600">{data.overview.lowStockProducts}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Vendas do Mês</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(data.overview.currentMonthRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">A Receber</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(data.financial.pendingReceivables)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">A Pagar</p>
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(data.financial.pendingPayables)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fluxo de Caixa</p>
                    <p className={`text-xl font-bold ${data.financial.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.financial.cashFlow)}
                    </p>
                  </div>
                  <TrendingUp className={`w-8 h-8 ${data.financial.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h2>
                <ShoppingCart className="w-5 h-5 text-gray-400" />
              </div>
              
              {data.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="table-header">Cliente</th>
                        <th className="table-header">Valor</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Data</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="table-cell font-medium">{order.clientName}</td>
                          <td className="table-cell">{formatCurrency(order.totalAmount)}</td>
                          <td className="table-cell">
                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="table-cell text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum pedido encontrado
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

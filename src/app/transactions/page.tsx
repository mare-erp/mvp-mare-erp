'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { DollarSign, Plus, Filter, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  status: 'PENDING' | 'PAID' | 'OVERDUE'
  dueDate: string
  paidAt?: string
  category?: string
  createdAt: string
  order?: {
    id: string
    client: {
      name: string
    }
  }
}

interface TransactionsData {
  transactions: Transaction[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  })
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    dueDate: '',
    category: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [filters])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      
      const response = await fetch(`/api/transactions?${params}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        setError('Erro ao carregar transações')
      }
    } catch (err) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({
          description: '',
          amount: '',
          type: 'INCOME',
          dueDate: '',
          category: ''
        })
        fetchTransactions()
      } else {
        const result = await response.json()
        setError(result.error || 'Erro ao criar transação')
      }
    } catch (err) {
      setError('Erro de conexão')
    } finally {
      setSubmitting(false)
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
      case 'PAID': return 'status-success'
      case 'PENDING': return 'status-warning'
      case 'OVERDUE': return 'status-error'
      default: return 'status-info'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID': return 'Pago'
      case 'PENDING': return 'Pendente'
      case 'OVERDUE': return 'Vencido'
      default: return status
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'INCOME' ? TrendingUp : TrendingDown
  }

  const getTypeColor = (type: string) => {
    return type === 'INCOME' ? 'text-green-600' : 'text-red-600'
  }

  const getTypeText = (type: string) => {
    return type === 'INCOME' ? 'Entrada' : 'Saída'
  }

  // Calculate totals
  const totals = data?.transactions.reduce((acc, transaction) => {
    if (transaction.type === 'INCOME') {
      acc.income += transaction.amount
    } else {
      acc.expense += transaction.amount
    }
    return acc
  }, { income: 0, expense: 0 }) || { income: 0, expense: 0 }

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
            <p className="mt-2 text-gray-600">Controle suas transações financeiras</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Entradas</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totals.income)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Saídas</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totals.expense)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Saldo</p>
                <p className={`text-2xl font-bold ${totals.income - totals.expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totals.income - totals.expense)}
                </p>
              </div>
              <DollarSign className={`w-8 h-8 ${totals.income - totals.expense >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="input-field w-auto"
            >
              <option value="">Todos os tipos</option>
              <option value="INCOME">Entradas</option>
              <option value="EXPENSE">Saídas</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="input-field w-auto"
            >
              <option value="">Todos os status</option>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="OVERDUE">Vencido</option>
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="input-field w-auto"
              placeholder="Data inicial"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="input-field w-auto"
              placeholder="Data final"
            />

            <button
              onClick={() => setFilters({ type: '', status: '', startDate: '', endDate: '' })}
              className="btn-secondary"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Transactions Table */}
        <div className="card">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Carregando transações...</div>
            </div>
          ) : data && data.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Descrição</th>
                    <th className="table-header">Tipo</th>
                    <th className="table-header">Valor</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Vencimento</th>
                    <th className="table-header">Categoria</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.transactions.map((transaction) => {
                    const TypeIcon = getTypeIcon(transaction.type)
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="table-cell">
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            {transaction.order && (
                              <div className="text-sm text-gray-500">
                                Cliente: {transaction.order.client.name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center">
                            <TypeIcon className={`w-4 h-4 mr-2 ${getTypeColor(transaction.type)}`} />
                            <span className={getTypeColor(transaction.type)}>
                              {getTypeText(transaction.type)}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                            {getStatusText(transaction.status)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            {formatDate(transaction.dueDate)}
                          </div>
                        </td>
                        <td className="table-cell">
                          {transaction.category || '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma transação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando uma nova transação
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Nova Transação
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Transação</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'INCOME' | 'EXPENSE'})}
                      className="input-field"
                      required
                    >
                      <option value="INCOME">Entrada</option>
                      <option value="EXPENSE">Saída</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Vencimento *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="input-field"
                      placeholder="ex: Vendas, Fornecedores, Impostos..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary"
                    >
                      {submitting ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

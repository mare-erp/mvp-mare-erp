'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Package, Plus, Search, AlertTriangle, DollarSign } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku?: string
  price: number
  costPrice?: number
  quantity: number
  minStock: number
  isService: boolean
  createdAt: string
}

interface ProductsData {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function ProductsPage() {
  const [data, setData] = useState<ProductsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    costPrice: '',
    quantity: '',
    minStock: '5',
    isService: false,
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      
      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        setError('Erro ao carregar produtos')
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
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
          quantity: formData.isService ? 0 : parseInt(formData.quantity || '0'),
          minStock: formData.isService ? 0 : parseInt(formData.minStock || '5')
        }),
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({
          name: '',
          sku: '',
          price: '',
          costPrice: '',
          quantity: '',
          minStock: '5',
          isService: false,
          description: ''
        })
        fetchProducts()
      } else {
        const result = await response.json()
        setError(result.error || 'Erro ao criar produto')
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

  const getStockStatus = (product: Product) => {
    if (product.isService) return 'N/A'
    if (product.quantity === 0) return 'Sem estoque'
    if (product.quantity <= product.minStock) return 'Estoque baixo'
    return 'Normal'
  }

  const getStockColor = (product: Product) => {
    if (product.isService) return 'text-gray-500'
    if (product.quantity === 0) return 'text-red-600'
    if (product.quantity <= product.minStock) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
            <p className="mt-2 text-gray-600">Gerencie seus produtos e estoque</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
              placeholder="Buscar por nome ou SKU..."
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="card">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Carregando produtos...</div>
            </div>
          ) : data && data.products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Produto</th>
                    <th className="table-header">SKU</th>
                    <th className="table-header">Tipo</th>
                    <th className="table-header">Preço</th>
                    <th className="table-header">Custo</th>
                    <th className="table-header">Estoque</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <Package className="h-4 w-4 text-primary-600" />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        {product.sku || '-'}
                      </td>
                      <td className="table-cell">
                        <span className={`status-badge ${product.isService ? 'status-info' : 'status-success'}`}>
                          {product.isService ? 'Serviço' : 'Produto'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          {formatCurrency(product.price)}
                        </div>
                      </td>
                      <td className="table-cell">
                        {product.costPrice ? formatCurrency(product.costPrice) : '-'}
                      </td>
                      <td className="table-cell">
                        {product.isService ? 'N/A' : `${product.quantity} / ${product.minStock}`}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          {!product.isService && product.quantity <= product.minStock && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                          )}
                          <span className={getStockColor(product)}>
                            {getStockStatus(product)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search ? 'Tente uma busca diferente' : 'Comece criando um novo produto'}
              </p>
              {!search && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Novo Produto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Novo Produto</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="input-field"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isService"
                      checked={formData.isService}
                      onChange={(e) => setFormData({...formData, isService: e.target.checked})}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isService" className="ml-2 block text-sm text-gray-900">
                      É um serviço
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço de Venda *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço de Custo
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {!formData.isService && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estoque Mínimo
                        </label>
                        <input
                          type="number"
                          value={formData.minStock}
                          onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                          className="input-field"
                        />
                      </div>
                    </div>
                  )}

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

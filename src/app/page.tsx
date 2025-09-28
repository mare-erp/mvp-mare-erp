'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Users, Package, DollarSign } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Maré <span className="text-primary-600">ERP</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="btn-primary"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Gestão Empresarial
            <span className="block text-primary-600">Simples e Eficiente</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
            Controle vendas, estoque, financeiro e clientes em uma única plataforma. 
            Otimize sua gestão e acelere o crescimento do seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href="/register"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
            >
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-lg px-8 py-3"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para gerenciar seu negócio
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Módulos integrados para uma gestão completa e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Vendas</h3>
              <p className="text-gray-600">
                Controle pedidos, orçamentos e acompanhe suas vendas em tempo real
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estoque</h3>
              <p className="text-gray-600">
                Gerencie produtos, controle estoque e receba alertas automáticos
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financeiro</h3>
              <p className="text-gray-600">
                Controle fluxo de caixa, contas a pagar e receber
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clientes</h3>
              <p className="text-gray-600">
                Cadastre e gerencie seus clientes com histórico completo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar sua gestão?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Comece agora mesmo e veja a diferença em poucos minutos
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Criar Conta Gratuita
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Maré <span className="text-primary-400">ERP</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Sistema de gestão empresarial completo e moderno
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Maré ERP. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

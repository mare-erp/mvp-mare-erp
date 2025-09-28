import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Pega o token dos cookies da requisição
  const token = request.cookies.get('token')?.value

  // 2. Pega a URL que o usuário está tentando acessar
  const { pathname } = request.nextUrl

  // 3. Define quais são as rotas públicas (que não precisam de login)
  const publicPaths = ['/login', '/register'] // Adicione outras rotas públicas se houver

  const isPublicPath = publicPaths.includes(pathname)

  // LÓGICA DE REDIRECIONAMENTO
  // CASO 1: O usuário está logado (tem token)
  if (token) {
    // Se ele está logado e tenta acessar a página de login ou registro,
    // redireciona para o dashboard (página inicial).
    if (isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  // CASO 2: O usuário NÃO está logado (não tem token)
  else {
    // Se ele não está logado e tenta acessar uma página protegida,
    // redireciona para a página de login.
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Se nenhuma das condições acima for atendida, permite que a requisição continue
  return NextResponse.next()
}

// Configuração do Matcher: Define em quais rotas o middleware será executado
export const config = {
  matcher: [
    /*
     * Faz o match com todas as rotas, exceto as que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (imagens otimizadas)
     * - favicon.ico (ícone do site)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
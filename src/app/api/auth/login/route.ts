import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validação básica dos dados de entrada
    if (!email || !password) {
      return NextResponse.json(
        { message: 'E-mail e senha são obrigatórios.' },
        { status: 400 }, // Bad Request
      )
    }

    // 1. Encontrar o usuário no banco de dados pelo e-mail
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(), // Normalizar o e-mail para minúsculas
      },
    })

    // Se o usuário não existe, a senha está errada.
    // Usamos bcrypt.compare com uma string aleatória para evitar "timing attacks",
    // tornando o tempo de resposta semelhante ao de um login válido.
    if (!user) {
      await bcrypt.compare(password, '$2a$10$invalidhashplaceholder') // Placeholder para segurança
      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 }, // Unauthorized
      )
    }

    // 2. Comparar a senha fornecida com o hash salvo no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 },
      )
    }

    // 3. Gerar o Token JWT se a senha estiver correta
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('A chave secreta JWT não foi configurada no .env')
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      secret,
      {
        expiresIn: '1d', // O token expira em 1 dia
      },
    )

    // 4. Retornar o token para o cliente
    return NextResponse.json({
      message: 'Login bem-sucedido!',
      token,
    })
  } catch (error) {
    // Log do erro no servidor para depuração
    console.error('[LOGIN_API_ERROR]', error)

    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
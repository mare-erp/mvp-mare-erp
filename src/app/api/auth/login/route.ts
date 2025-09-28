import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { verifyPassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('Login request body:', await request.clone().text());
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Find user with workspace info (optimized query)
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        workspaces: {
          include: {
            workspace: {
              select: {
                id: true,
                name: true
              }
            }
          },
          take: 1 // Get only the first workspace for now
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Get workspace ID (user should have at least one workspace)
    const workspaceId = user.workspaces[0]?.workspace.id

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Usuário não possui workspace ativo' },
        { status: 403 }
      )
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      workspaceId
    })

    // Set token in an HTTP-Only cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workspace: {
          id: workspaceId,
          name: user.workspaces[0].workspace.name
        }
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2021') {
        return NextResponse.json(
          { error: 'Erro de banco de dados: A tabela não foi encontrada.' },
          { status: 500 }
        )
      }
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
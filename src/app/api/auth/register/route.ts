import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, workspaceName } = await request.json()

    // Validation
    if (!name || !email || !password || !workspaceName) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user and workspace in a transaction (optimized)
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      })

      // Create workspace
      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName
        }
      })

      // Create workspace membership
      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: 'ADMIN'
        }
      })

      return { user, workspace }
    })

    // Generate JWT token
    const token = signToken({
      userId: result.user.id,
      email: result.user.email,
      workspaceId: result.workspace.id
    })

    return NextResponse.json({
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        workspace: {
          id: result.workspace.id,
          name: result.workspace.name
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

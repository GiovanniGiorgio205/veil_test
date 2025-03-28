import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const { email, password } = body

	try {
		const user = await prisma.users.findUnique({ where: { email } })

		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			)
		}

		const isValidPassword = await bcrypt.compare(
			password,
			user.encryptedPassword
		)

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			)
		}

		const session = await prisma.session.create({
			data: {
				sessionToken:
					Math.random().toString(36).substring(2, 15) +
					Math.random().toString(36).substring(2, 15),
				userId: user.id,
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
						displayName: true,
					},
				},
			},
		})

		const response = NextResponse.json({
			user: session.user,
			expires: session.expires.toISOString(),
		})

		response.cookies.set('session-token', session.sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 30 * 24 * 60 * 60, // 30 days
			path: '/',
		})

		return response
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

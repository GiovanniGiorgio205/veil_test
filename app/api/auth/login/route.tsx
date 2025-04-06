import { prisma } from '@/lib/prisma'
import { checkPassword } from '@/lib/utils'
import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {}

export async function HEAD(request: Request) {}
export async function POST(req: NextRequest) {
	const body = await req.json()
	const { login, password } = body

	try {
		const user = await prisma.users.findUnique({ where: { login } })

		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			)
		}

		const isValidPassword = checkPassword(
			user.encryptedPassword as string,
			password
		)

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			)
		}

		// Create a session in the database
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
						login: true,
						email: true,
						displayName: true,
						birthdayDate: true,
						image: true,
						type: true,
						Workspaces: true,
					},
				},
			},
		})

		// Create a JWT token
		const secret = new TextEncoder().encode(process.env.JWT_SECRET)
		const token = await new SignJWT({
			userId: user.id,
			sessionId: session.id,
			login: user.login,
			email: user.email,
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('30d')
			.sign(secret)

		const response = NextResponse.json({
			user: {
				id: user.id,
				login: user.login,
				email: user.email,
				displayName: user.displayName,
				birthdayDate: user.birthdayDate,
				image: user.image,
				type: user.type,
			},
			expires: session.expires.toISOString(),
		})

		// Set both the session token and JWT token
		response.cookies.set('session-token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
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

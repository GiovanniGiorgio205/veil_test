import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const sessionToken = req.cookies.get('session-token')?.value

	if (!sessionToken) {
		return NextResponse.json({ error: 'No session found' }, { status: 401 })
	}

	try {
		// Verify the JWT token
		const secret = new TextEncoder().encode(process.env.JWT_SECRET)
		const { payload } = await jwtVerify(sessionToken, secret)

		// Get the user from the database
		const user = await prisma.users.findUnique({
			where: { id: payload.userId as string },
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
		})

		if (!user) {
			const response = NextResponse.json(
				{ error: 'Invalid session' },
				{ status: 401 }
			)
			response.cookies.set('session-token', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 0,
				path: '/',
			})
			return response
		}

		return NextResponse.json({
			user,
			expires: new Date(payload.exp! * 1000).toISOString(),
		})
	} catch (error) {
		console.error('Session check error:', error)
		const response = NextResponse.json(
			{ error: 'Invalid session' },
			{ status: 401 }
		)
		response.cookies.set('session-token', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 0,
			path: '/',
		})
		return response
	}
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

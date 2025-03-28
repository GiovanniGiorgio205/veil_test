/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const sessionToken = req.cookies.get('session-token')?.value

	if (!sessionToken) {
		return NextResponse.json({ error: 'No session found' }, { status: 401 })
	}

	try {
		const session = await prisma.session.findUnique({
			where: { sessionToken },
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

		if (!session) {
			const response = NextResponse.json(
				{ error: 'Invalid session' },
				{ status: 401 }
			)
			response.cookies.set('session-token', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 0,
				path: '/',
			})
			return response
		}

		if (new Date(session.expires) < new Date()) {
			const response = NextResponse.json(
				{ error: 'Session expired' },
				{ status: 401 }
			)
			response.cookies.set('session-token', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 0,
				path: '/',
			})
			return response
		}

		return NextResponse.json({
			user: session.user,
			expires: session.expires.toISOString(),
		})
	} catch (error) {
		console.error('Session check error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

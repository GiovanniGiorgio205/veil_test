import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(req: NextRequest) {
	const sessionToken = req.cookies.get('session-token')?.value

	if (sessionToken) {
		try {
			// Verify the JWT token
			const secret = new TextEncoder().encode(process.env.JWT_SECRET)
			const { payload } = await jwtVerify(sessionToken, secret)

			// Delete the session from the database
			if (payload.sessionId) {
				await prisma.session.delete({
					where: { id: payload.sessionId as string },
				})
			}
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	const response = NextResponse.json({ message: 'Logged out successfully' })
	response.cookies.set('session-token', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 0,
		path: '/',
	})

	return response
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

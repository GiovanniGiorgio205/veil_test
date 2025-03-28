import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(req: NextRequest) {
	const sessionToken = req.cookies.get('session-token')?.value

	if (sessionToken) {
		try {
			await prisma.session.delete({
				where: { sessionToken },
			})
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	const response = NextResponse.json({ message: 'Logged out successfully' })
	response.cookies.set('session-token', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 0,
		path: '/',
	})

	return response
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

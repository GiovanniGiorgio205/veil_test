import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

// Public paths that don't require authentication
const publicPaths = [
	'/', // Home page
	'/login', // Login page
	'/register', // Registration page
	'/forgot-password', // Forgot password page
	'/reset-password', // Reset password page
	'/api/auth/login', // Auth API routes
	'/api/auth/logout',
	'/api/auth/signup',
	'/api/auth/session',
	'/api/auth/forgot-password',
	'/api/auth/reset-password',
	'/api/health',
	// '/api/auth/sso', // SSO routes
	// '/api/auth/callback',
]

// Function to check if the path is public
function isPublicPath(path: string): boolean {
	return publicPaths.some(
		(publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
	)
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if the path is public
	if (isPublicPath(pathname)) {
		return NextResponse.next()
	}

	// Check for session token
	const sessionToken = request.cookies.get('session-token')?.value

	// If no session token, redirect to login
	if (!sessionToken) {
		const url = new URL('/login', request.url)
		url.searchParams.set('callbackUrl', encodeURI(request.url))
		return NextResponse.redirect(url)
	}

	try {
		// Instead of checking the database, we'll use a JWT token
		// This assumes you've modified your auth system to use JWT tokens
		const secret = new TextEncoder().encode(process.env.JWT_SECRET)
		await jwtVerify(sessionToken, secret)

		// Token is valid, proceed
		return NextResponse.next()
	} catch (error) {
		console.error('Middleware error:', error)
		// On error, redirect to login
		const response = NextResponse.redirect(new URL('/login', request.url))
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

// Specify which paths this middleware should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
}

import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const {
		login,
		display_name,
		email,
		password,
		password_verify,
		birthday_date,
		image,
	} = body

	try {
		const user = await prisma.users.findUnique({ where: { login } })

		// https://i.pinimg.com/736x/fb/7e/c1/fb7ec1c340c75820d03934cfaa947cfb.jpg
		if (user) {
			return NextResponse.json(
				{ error: 'Invalid credentials: User with this login already exists' },
				{ status: 401 }
			)
		}

		const isValidPassword = password === password_verify

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			)
		}

		const created_user = await prisma.users.create({
			data: {
				login: login,
				displayName: display_name,
				email: email,
				encryptedPassword: hashPassword(password),
				birthdayDate: birthday_date,
				image: !image
					? 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_960_720.png'
					: image,
			},
		})
		if (created_user) {
			const response = NextResponse.json(
				{
					user: created_user,
				},
				{ status: 200, statusText: 'User signed up successfully!' }
			)

			return response
		} else {
			return NextResponse.json(
				{
					error:
						'Invalid credentials: Error while creating user. Try again or wait for a while',
				},
				{ status: 401 }
			)
		}
	} catch (error) {
		console.error('Sign up error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

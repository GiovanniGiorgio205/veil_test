import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ app_id: string }> }
) {
	const { app_id } = await params

	try {
		const application = await prisma.applications.findUnique({
			where: { ID: app_id as string },
			include: {
				AppUsers: true,
			},
		})

		console.log(application)

		const response = NextResponse.json({
			application: application,
		})
		return response
	} catch (e) {
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

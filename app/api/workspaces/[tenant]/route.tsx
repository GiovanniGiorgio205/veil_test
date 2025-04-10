import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ tenant: string }> }
) {
	const { tenant } = await params

	try {
		const workspace = await prisma.workspaces.findUnique({
			where: { tenant: tenant as string },
			include: {
				Applications: true,
			},
		})

		const response = NextResponse.json({
			workspace: workspace,
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

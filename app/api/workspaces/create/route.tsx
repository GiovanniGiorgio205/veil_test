import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const { name, tenant, description, ws_type, uid } = body

	try {
		const workspace = await prisma.workspaces.findUnique({ where: { tenant } })

		if (workspace) {
			return NextResponse.json(
				{
					error:
						'Invalid credentials: workspace with this tenant already exists',
				},
				{ status: 401 }
			)
		}

		const created_workspace = await prisma.workspaces.create({
			data: {
				name: name,
				tenant: tenant,
				description: description,
				WS_Type: ws_type,
				UID: uid,
			},
		})
		if (created_workspace) {
			const response = NextResponse.json(
				{
					workspace: created_workspace,
				},
				{ status: 200, statusText: 'Workspace created successfully!' }
			)

			return response
		} else {
			return NextResponse.json(
				{
					error:
						'Invalid credentials: Error while creating workspace. Try again or wait for a while',
				},
				{ status: 401 }
			)
		}
	} catch (error) {
		console.error('Creating workspace error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

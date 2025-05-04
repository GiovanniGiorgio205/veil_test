import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const { applicationName, applicationTenant, ws_id } = body

	console.log(`${applicationName} | ${applicationTenant} | ${ws_id}`)

	try {
		const workspace = await prisma.workspaces.findUnique({
			where: { tenant: ws_id },
		})

		if (!workspace) {
			return NextResponse.json(
				{
					error: 'Invalid credentials: workspace for application is not exists',
				},
				{ status: 401 }
			)
		}

		console.log(workspace.ID)

		const application = await prisma.applications.findUnique({
			where: { ApplicationTenant: applicationTenant },
		})

		if (application) {
			return NextResponse.json(
				{
					error:
						'Invalid credentials: application with this tenant already exists',
				},
				{ status: 401 }
			)
		}

		const created_application = await prisma.applications.create({
			data: {
				ApplicationName: applicationName,
				ApplicationTenant: applicationTenant,
				WS_ID: workspace.ID,
			},
		})
		if (created_application) {
			const response = NextResponse.json(
				{
					application: created_application,
				},
				{ status: 200, statusText: 'Application created successfully!' }
			)

			return response
		} else {
			return NextResponse.json(
				{
					error:
						'Invalid credentials: Error while creating application. Try again or wait for a while',
				},
				{ status: 401 }
			)
		}
	} catch (error) {
		console.error('Creating application error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

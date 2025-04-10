import { Applications, Workspaces } from '@prisma/client'

export interface ApplicationsWorkspace extends Workspaces {
	Applications: Array<Applications>
}

export interface UserApplications extends Applications{
	
}
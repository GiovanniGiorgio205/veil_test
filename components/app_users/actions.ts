'use server'

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { revalidatePath } from 'next/cache'

import type { AppUser, AppUserFormData } from './data'

const prisma = new PrismaClient()

export async function getAppUsers(app_id?: string): Promise<AppUser[]> {
	try {
		const where = app_id ? { app_id } : {}

		console.log(app_id)

		if (where) {
			const users = await prisma.appUsers.findMany({
				where: {
					app_id: app_id,
				},
				orderBy: {
					createdAt: 'desc',
				},
			})

			return users as AppUser[]
		} else {
			return Array<AppUser>()
		}
	} catch (error) {
		console.error('Failed to fetch app users:', error)
		throw new Error('Failed to fetch app users')
	}
}

export async function getAppUser(id: string): Promise<AppUser | null> {
	try {
		const user = await prisma.appUsers.findUnique({
			where: { id },
		})

		return user as AppUser | null
	} catch (error) {
		console.error(`Failed to fetch app user with ID ${id}:`, error)
		throw new Error('Failed to fetch app user')
	}
}

export async function createAppUser(data: AppUserFormData): Promise<AppUser> {
	try {
		// Check if user with login or email already exists
		const existingUser = await prisma.appUsers.findFirst({
			where: {
				OR: [{ login: data.login }, { email: data.email }],
			},
		})

		if (existingUser) {
			throw new Error('A user with this login or email already exists')
		}

		// Hash password if provided
		let encryptedPassword = undefined
		if (data.password) {
			encryptedPassword = await hash(data.password, 10)
		}

		const user = await prisma.appUsers.create({
			data: {
				login: data.login,
				email: data.email,
				displayName: data.displayName,
				type: 'Free', // Default to Free
				birthdayDate: data.birthdayDate,
				encryptedPassword,
				app_id: data.app_id,
			},
		})

		revalidatePath('/app-users')
		return user as AppUser
	} catch (error) {
		console.error('Failed to create app user:', error)
		throw new Error('Failed to create app user')
	}
}

export async function updateAppUser(
	id: string,
	data: AppUserFormData
): Promise<AppUser> {
	try {
		// Check if another user with the same login or email exists
		const existingUser = await prisma.appUsers.findFirst({
			where: {
				OR: [{ login: data.login }, { email: data.email }],
				NOT: {
					id,
				},
			},
		})

		if (existingUser) {
			throw new Error('Another user with this login or email already exists')
		}

		// Prepare update data
		const updateData: any = {
			login: data.login,
			email: data.email,
			displayName: data.displayName,
			birthdayDate: data.birthdayDate,
			updatedAt: new Date(),
		}

		// Update app_id if provided
		if (data.app_id) {
			updateData.app_id = data.app_id
		}

		// Only update password if provided
		if (data.password) {
			updateData.encryptedPassword = await hash(data.password, 10)
		}

		const user = await prisma.appUsers.update({
			where: { id },
			data: updateData,
		})

		revalidatePath('/app-users')
		return user as AppUser
	} catch (error) {
		console.error(`Failed to update app user with ID ${id}:`, error)
		throw new Error('Failed to update app user')
	}
}

export async function deleteAppUser(id: string): Promise<void> {
	try {
		await prisma.appUsers.delete({
			where: { id },
		})

		revalidatePath('/app-users')
	} catch (error) {
		console.error(`Failed to delete app user with ID ${id}:`, error)
		throw new Error('Failed to delete app user')
	}
}

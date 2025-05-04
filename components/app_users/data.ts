export interface AppUser {
	id: string
	login: string
	email: string
	role?: string
	birthdayDate?: string
	createdAt?: string
	displayName?: string
	emailVerified?: string
	image?: string
	updatedAt?: string
	type?: string
	app_id?: string
}

export type AppUserFormData = {
	login: string
	email: string
	displayName?: string
	role?: string
	birthdayDate?: Date
	password?: string
	app_id?: string
}

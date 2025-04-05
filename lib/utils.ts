import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import * as crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function checkPassword(
	encryptedPassword: string,
	inputPassword: string
) {
	if (
		crypto.createHash('sha256').update(inputPassword).digest('hex') ==
		encryptedPassword
	) {
		return true
	}
	return false
}

export function hashPassword(inputPassword: string) {
	const hashedPass = crypto
		.createHash('sha256')
		.update(inputPassword)
		.digest('hex')
	console.log(hashedPass)
	return hashedPass
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import SHA256 from 'crypto-ts'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function checkPassword(
	encryptedPassword: string,
	inputPassword: string
) {
	if (SHA256.SHA256(inputPassword) == encryptedPassword) {
		return true
	}
	return false
}

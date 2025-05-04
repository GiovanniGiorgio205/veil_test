'use client'

import { account_type, Workspaces, WS_Type } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type User = {
	id: string
	login: string
	email: string
	displayName: string | null
	image: string
	birthdayDate: Date
	type: account_type
	Workspaces: Workspaces[]
}

type Session = {
	user: User
	expires: string
}

type AuthContextType = {
	user: User | null
	session: Session | null
	login: (email: string, password: string) => Promise<void>
	signup: (
		login: string,
		display_name: string,
		email: string,
		password: string,
		password_verify: string,
		birthday_date: Date,
		image: string
	) => Promise<void>
	createWorkspace: (
		name: string,
		tenant: string,
		description: string,
		ws_type: WS_Type,
		uid: string
	) => Promise<void>
	createApplication: (
		applicationName: string,
		applicationTenant: string,
		ws_id: string
	) => Promise<void>
	logout: () => Promise<void>
	isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	const searchParams = useSearchParams()

	useEffect(() => {
		checkSession()
	}, [])

	async function createApplication(
		applicationName: string,
		applicationTenant: string,
		ws_id: string
	) {
		setIsLoading(true)
		try {
			const response = await fetch('/api/applications/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ applicationName, applicationTenant, ws_id }),
			})
			if (response.ok) {
				const data = await response.json()
				console.log(data)
				router.push(`../${ws_id}/${data.application.ID}`)
			}
		} catch (error) {
			console.error('Failed to create workspaces:', error)
		} finally {
			setIsLoading(false)
		}
	}

	async function createWorkspace(
		name: string,
		tenant: string,
		description: string,
		ws_type: WS_Type,
		uid: string
	) {
		setIsLoading(true)
		try {
			const response = await fetch('/api/workspaces/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, tenant, description, ws_type, uid }),
			})
			if (response.ok) {
				const data = await response.json()
				console.log(data)
				router.push('/workspaces')
			}
		} catch (error) {
			console.error('Failed to create workspaces:', error)
		} finally {
			setIsLoading(false)
		}
	}

	async function checkSession() {
		setIsLoading(true)
		try {
			const response = await fetch('/api/auth/session')
			if (response.ok) {
				const sessionData = await response.json()
				setSession(sessionData)
				setUser(sessionData.user)
			}
		} catch (error) {
			console.error('Failed to check session:', error)
		} finally {
			setIsLoading(false)
		}
	}

	async function Login(login: string, password: string) {
		setIsLoading(true)
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ login, password }),
			})
			if (response.ok) {
				const sessionData = await response.json()
				setSession(sessionData)
				setUser(sessionData.user)

				const callbackUrl = searchParams.get('callbackUrl')

				if (callbackUrl) {
					router.push(callbackUrl)
				} else {
					router.push('/workspaces')
				}
			} else {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Login failed')
			}
		} catch (error) {
			console.error('Login error:', error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	async function signup(
		login: string,
		display_name: string,
		email: string,
		password: string,
		password_verify: string,
		birthday_date: Date,
		image: string
	) {
		setIsLoading(true)
		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					login,
					display_name,
					email,
					password,
					password_verify,
					birthday_date,
					image,
				}),
			})
			if (response.ok) {
				const signupData = await response.json()
				console.info(signupData)
				router.push('/login')
			} else {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Signup failed')
			}
		} catch (error) {
			console.error('Signup error:', error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	async function logout() {
		setIsLoading(true)
		try {
			const response = await fetch('/api/auth/logout', { method: 'POST' })
			if (response.ok) {
				setUser(null)
				setSession(null)
				router.push('/')
			} else {
				throw new Error('Logout failed')
			}
		} catch (error) {
			console.error('Logout error:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				login: Login,
				signup,
				logout,
				createWorkspace,
				createApplication,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

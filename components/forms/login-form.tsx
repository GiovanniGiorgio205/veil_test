'use client'

import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Alert, AlertDescription } from '../ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'

const formSchema = z.object({
	login: z.string().min(2, { message: 'Please enter a valid login' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
})

export function LoginForm({ className }: React.ComponentProps<'form'>) {
	const { login } = useAuth()
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			login: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setError(null)
		try {
			await login(values.login, values.password)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Login failed. Please try again.'
			)
		}
	}

	return (
		<Card className={cn(className, 'w-full max-w-lg')}>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold tracking-tight">
					Sign in to your account
				</CardTitle>
				<CardDescription>
					Enter your login and password to sign in
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="login"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Login</FormLabel>
									<FormControl>
										<Input placeholder="example_user" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="••••••••" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Sign in
						</Button>
					</form>
				</Form>

				{/* {ssoProviders.length > 0 && (
						<>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>

							<div className="grid gap-2">
								{ssoProviders.map((provider) => (
									<Button
										key={provider.id}
										variant="outline"
										type="button"
										disabled={isLoading}
										onClick={() => handleSSOLogin(provider.id)}
										className="w-full"
									>
										{provider.name}
									</Button>
								))}
							</div>
						</>
					)} */}
			</CardContent>
			<CardFooter className="flex flex-col space-y-2">
				<div className="text-sm text-center text-muted-foreground">
					Don{"'"}t have an account?{' '}
					<a
						href="/register"
						className="underline underline-offset-4 hover:text-primary"
					>
						Sign up
					</a>
				</div>
				<div className="text-sm text-center text-muted-foreground">
					<a
						href="/forgot-password"
						className="underline underline-offset-4 hover:text-primary"
					>
						Forgot your password?
					</a>
				</div>
			</CardFooter>
		</Card>
	)
}

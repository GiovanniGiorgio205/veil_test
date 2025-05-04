'use client'

import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { notificationService } from '@/hooks/use-notifications'
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
	applicationName: z
		.string()
		.min(2, { message: 'Please enter a valid application name' }),
	applicationTenant: z
		.string()
		.min(2, { message: 'Please enter a valid application tenant' }),
	ws_id: z.string(),
})

export function CreateApplicationForm({ className = '', ws_id = '' }) {
	const { createApplication, isLoading } = useAuth()
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			applicationName: '',
			applicationTenant: '',
			ws_id: ws_id,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setError(null)
		try {
			await createApplication(
				values.applicationName,
				values.applicationTenant,
				values.ws_id
			)
			notificationService.success(
				'Application created successfully',
				`Great work, ten'kan!`
			)
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
					Create application
				</CardTitle>
				<CardDescription>
					Enter credentials to create application. Not book, but there will be a
					lot of information too.
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
							name="applicationName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Application Name</FormLabel>
									<FormControl>
										<Input placeholder="Example Application" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="applicationTenant"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Application Tenant</FormLabel>
									<FormControl>
										<Input placeholder="example_tenant" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isLoading}>
							Create application
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
				{/* <div className="text-sm text-center text-muted-foreground">
					Don{"'"}t have an account?{' '}
					<a
						href="/register"
						className="underline underline-offset-4 hover:text-primary"
					>
						Sign up
					</a>
				</div> */}
				{/* <div className="text-sm text-center text-muted-foreground">
					<a
						href="/forgot-password"
						className="underline underline-offset-4 hover:text-primary"
					>
						Forgot your password?
					</a>
				</div> */}
			</CardFooter>
		</Card>
	)
}

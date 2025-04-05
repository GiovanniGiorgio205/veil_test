'use client'

import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { WS_Type } from '@prisma/client'
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
	name: z.string().min(2, { message: 'Please enter a valid workspace name' }),
	tenant: z
		.string()
		.min(2, { message: 'Please enter a valid workspace tenant' }),
	description: z.string(),
	ws_type: z.nativeEnum(Object.values(WS_Type)),
	uid: z.string(),
})

export function CreateWorkspaceForm({
	className,
}: React.ComponentProps<'form'>) {
	const { signup } = useAuth()
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			tenant: '',
			description: '',
			ws_type: WS_Type,
			uid: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setError(null)
		try {
			await signup(
				values.name,
				values.tenant,
				values.description,
				values.ws_type,
				values.uid
			)
			router.push('/login')
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Register failed. Please try again.'
			)
		}
	}

	return (
		<Card className={cn(className, 'w-full max-w-lg')}>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold tracking-tight">
					Create workspace
				</CardTitle>
				<CardDescription>
					Enter credentials for new workspace, that should be amazing!
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
							name="display_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Name</FormLabel>
									<FormControl>
										<Input placeholder="Example User" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Create Workspace
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
				<p className="text-sm text-center text-muted-foreground">
					Workspace - special space for you or your organization for creating
					your own Auth for various applications, that you developing.
				</p>
				<p className="text-sm text-center text-muted-foreground">
					*You can do whatever you want with your workspace: create, edit and
					delete in every moment, that you want.*
				</p>
			</CardFooter>
		</Card>
	)
}

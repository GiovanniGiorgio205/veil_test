'use client'

import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { AlertCircle, CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Alert, AlertDescription } from '../ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Calendar } from '../ui/calendar'
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const formSchema = z.object({
	login: z.string().min(2, { message: 'Please enter a valid login' }),
	display_name: z.string().min(2, { message: 'Please enter a valid login' }),
	email: z.string().email(),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
	password_verify: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
	birthday_date: z.date(),
	image: z.string(),
})

export function RegisterForm({ className }: React.ComponentProps<'form'>) {
	const { signup } = useAuth()
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			login: '',
			display_name: '',
			email: '',
			password: '',
			password_verify: '',
			birthday_date: new Date(),
			image: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setError(null)
		try {
			await signup(
				values.login,
				values.display_name,
				values.email,
				values.password,
				values.password_verify,
				values.birthday_date,
				values.image
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
					Create new account
				</CardTitle>
				<CardDescription>
					Enter credentials for new account and create it!
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
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="example@user.com"
											{...field}
										/>
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
						<FormField
							control={form.control}
							name="password_verify"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password Verify</FormLabel>
									<FormControl>
										<Input type="password" placeholder="••••••••" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="birthday_date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date of birth</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={'outline'}
													className={cn(
														'w-full pl-3 text-left font-normal',
														!field.value && 'text-muted-foreground'
													)}
												>
													{field.value ? (
														format(field.value, 'PPP')
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												captionLayout="dropdown"
												toYear={
													new Date().getUTCFullYear().toString() as number
												}
												fromYear={1900}
												classNames={{
													day_hidden: 'invisible',
													dropdown:
														'px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
													caption_dropdowns: 'flex gap-3',
													vhidden: 'hidden',
													caption_label: 'hidden',
												}}
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) =>
													date > new Date() || date < new Date('1900-01-01')
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>
										Your date of birth is used to calculate your age.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Avatar (*optional)</FormLabel>
									<FormControl>
										<div className="flex gap-1">
											<Avatar>
												<AvatarImage
													src={field.value != '' ? field.value : null}
												/>
												<AvatarFallback>
													{form.getValues().display_name.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
											<Input {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Sign up
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

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'

import { cn } from '@/lib/utils'
import { createAppUser, updateAppUser } from '../actions'
import type { AppUser } from '../data'

const formSchema = z.object({
	login: z.string().min(3, {
		message: 'Login must be at least 3 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	displayName: z.string().optional(),
	birthdayDate: z.date().optional(),
	password: z
		.string()
		.min(6, {
			message: 'Password must be at least 6 characters.',
		})
		.optional(),
})

interface AppUserFormProps {
	open: boolean
	onOpenChange: (refresh?: boolean) => void
	user: AppUser | null
	app_id: string
}

export function AppUserForm({
	open,
	onOpenChange,
	user,
	app_id,
}: AppUserFormProps) {
	const { toast } = useToast()
	const isEditing = !!user

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			login: '',
			email: '',
			displayName: '',
			birthdayDate: undefined,
			password: '',
		},
	})

	useEffect(() => {
		if (user) {
			form.reset({
				login: user.login,
				email: user.email,
				displayName: user.displayName || '',
				birthdayDate: user.birthdayDate
					? new Date(user.birthdayDate)
					: undefined,
				password: '', // Don't populate password field when editing
			})
		} else {
			form.reset({
				login: '',
				email: '',
				displayName: '',
				birthdayDate: undefined,
				password: '',
			})
		}
	}, [user, form])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (isEditing && user) {
				await updateAppUser(user.id, { ...values, app_id })
				toast({
					title: 'Success',
					description: 'App user updated successfully',
				})
			} else {
				await createAppUser({ ...values, app_id })
				toast({
					title: 'Success',
					description: 'App user created successfully',
				})
			}
			onOpenChange(true) // Close form and refresh data
		} catch (error) {
			toast({
				title: 'Error',
				description: isEditing
					? 'Failed to update app user'
					: 'Failed to create app user',
				variant: 'destructive',
			})
		}
	}

	return (
		<Dialog open={open} onOpenChange={() => onOpenChange()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit App User' : 'Create App User'}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? 'Update the app user details below.'
							: 'Fill in the details to create a new app user.'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="login"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Login</FormLabel>
									<FormControl>
										<Input placeholder="johndoe" {...field} />
									</FormControl>
									<FormDescription>
										This is the user's login name.
									</FormDescription>
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
										<Input placeholder="john@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Name</FormLabel>
									<FormControl>
										<Input placeholder="John Doe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="birthdayDate"
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{isEditing
											? 'New Password (leave blank to keep current)'
											: 'Password'}
									</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit">
								{isEditing ? 'Update User' : 'Create User'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

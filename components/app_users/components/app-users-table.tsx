'use client'

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type ColumnSizingState,
	type SortingState,
	type VisibilityState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import {
	ArrowUpDown,
	MoreHorizontal,
	PlusCircle,
	RefreshCw,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

import { cn } from '@/lib/utils'
import { deleteAppUser, getAppUsers } from '../actions'
import type { AppUser } from '../data'
import { AppUserForm } from './app-user-form'

export function AppUsersTable({
	app_id,
	className = '',
}: {
	app_id: string
	className: string
}) {
	const router = useRouter()
	const { toast } = useToast()
	const [data, setData] = useState<AppUser[]>([])
	const [loading, setLoading] = useState(true)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [userToDelete, setUserToDelete] = useState<string | null>(null)
	const [formOpen, setFormOpen] = useState(false)
	const [editingUser, setEditingUser] = useState<AppUser | null>(null)

	const fetchData = async () => {
		setLoading(true)
		try {
			const users = await getAppUsers(app_id)
			setData(users)
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to fetch app users',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	// Fetch data on component mount
	useEffect(() => {
		fetchData()
	}, [])

	const handleDelete = async () => {
		if (!userToDelete) return

		try {
			await deleteAppUser(userToDelete)
			toast({
				title: 'Success',
				description: 'App user deleted successfully',
			})
			fetchData()
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete app user',
				variant: 'destructive',
			})
		} finally {
			setDeleteDialogOpen(false)
			setUserToDelete(null)
		}
	}

	const openDeleteDialog = (id: string) => {
		setUserToDelete(id)
		setDeleteDialogOpen(true)
	}

	const openEditForm = (user: AppUser) => {
		setEditingUser(user)
		setFormOpen(true)
	}

	const openCreateForm = () => {
		setEditingUser(null)
		setFormOpen(true)
	}

	const handleFormClose = (refresh?: boolean) => {
		setFormOpen(false)
		setEditingUser(null)
		if (refresh) {
			fetchData()
		}
	}

	const columns: ColumnDef<AppUser>[] = [
		{
			accessorKey: 'login',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Login
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue('login')}</div>
			),
			size: 150,
		},
		{
			accessorKey: 'email',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Email
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			size: 200,
		},
		{
			accessorKey: 'displayName',
			header: 'Display Name',
			cell: ({ row }) => row.getValue('displayName') || '-',
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }) => {
				const role = row.getValue('role') as string
				return role ? <Badge variant="outline">{role}</Badge> : '-'
			},
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Created At
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => {
				const date = row.getValue('createdAt') as string
				return date ? format(new Date(date), 'PPP') : '-'
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const user = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => openEditForm(user)}>
								Edit
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => openDeleteDialog(user.id)}
								className="text-destructive focus:text-destructive"
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
			size: 80,
		},
	]

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onColumnSizingChange: setColumnSizing,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			columnSizing,
		},
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
	})

	return (
		<div className={cn(className, '')}>
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Filter by email..."
					value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('email')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={fetchData}
						disabled={loading}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
						/>
						Refresh
					</Button>
					<Button onClick={openCreateForm}>
						<PlusCircle className="h-4 w-4 mr-2" />
						Add User
					</Button>
				</div>
			</div>
			<div className="rounded-md border flex-1 overflow-auto">
				<Table className="min-w-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{loading ? 'Loading...' : 'No results.'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4 mt-auto">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							user and remove their data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Create/Edit Form Dialog */}
			<AppUserForm
				open={formOpen}
				onOpenChange={handleFormClose}
				user={editingUser}
				app_id={app_id}
			/>
		</div>
	)
}

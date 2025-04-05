import { CreateWorkspaceForm } from '@/components/forms/create-workspace-form'

export default function CreateWorkspacePage() {
	return (
		<section className="w-full flex justify-center py-8">
			<div className="container flex flex-col h-16 space-x-4 sm:justify-between sm:space-x-0 gap-2">
				<CreateWorkspaceForm />
			</div>
		</section>
	)
}

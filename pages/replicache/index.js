// Packages
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useSubscribe } from 'replicache-react'
import { useRouter } from 'next/router'
// Utilities
import utilGenerateId from 'utils/generateId'
// Hooks
import useReplicache from 'hooks/replicache'

const PagesReplicache = () => {
	const router = useRouter()

	const { isSignedIn, signOut } = useAuth()

	useEffect(() => {
		if (!isSignedIn) router.push('/')
	}, [isSignedIn])

	const { data: rep } = useReplicache()

	const todos = useSubscribe(rep, async tx => await tx.scan({ prefix: `todo/` }).toArray(), [rep])

	const handleUpdateTodo = update => rep.mutate.update(update)

	console.log('Todos:', todos)

	return (
		<div>
			<button onClick={() => signOut()}>Sign out</button>

			<button
				onClick={async () =>
					await rep.mutate.create({
						todoId: utilGenerateId(),
						isArchived: false,
						isDraft: false,
						name: `To-do #${todos?.length + 1}`,
						sortOrder: 0
					})
				}
			>
				Create new
			</button>

			{todos?.some(x => x)
				? todos?.map(todo => (
						<p key={todo.todoId} onClick={async () => await rep.mutate.delete(todo.todoId)}>
							<b>{todo.todoId}:</b> <span>{todo.name}</span>
						</p>
				  ))
				: null}
		</div>
	)
}

export default PagesReplicache

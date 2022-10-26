// Packages
import { useState, useEffect } from 'react'
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

	const [demoTodoSequence, setDemoTodoSequence] = useState(1)

	useEffect(() => {
		if (!isSignedIn) router.push('/')
	}, [isSignedIn])

	// For demonstration purposes, create a continuous sequence of to-do names, even if browser reloads
	useEffect(() => {
		const stored = window.localStorage.getItem('demo')

		if (stored) setDemoTodoSequence(stored)
	}, [])

	useEffect(() => window.localStorage.setItem('demo', demoTodoSequence), [demoTodoSequence])

	const { data: rep } = useReplicache()

	const todos = useSubscribe(rep, async tx => await tx.scan({ prefix: `todo/` }).toArray(), [rep])

	const handleUpdateTodo = update => rep.mutate.update(update)

	console.log('Todos:', todos)

	return (
		<div>
			<button onClick={() => signOut()}>Sign out</button>

			<button
				onClick={async () => {
					await rep.mutate.create({
						todoId: utilGenerateId(),
						isArchived: false,
						isDraft: false,
						name: `To-do #${demoTodoSequence}`,
						sortOrder: 0
					})

					setDemoTodoSequence(prev => prev + 1)
				}}
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

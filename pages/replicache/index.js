// Packages
import { useAuth } from '@clerk/nextjs'
import { useSubscribe } from 'replicache-react'
// Utilities
import utilGenerateId from 'utils/generateId'
// Hooks
import useDemoSequence from 'hooks/demoSequence'
import usePokeListener from 'hooks/pokeListener'
import useReplicache from 'hooks/replicache'
import useSignInRequired from 'hooks/signInRequired'

const PagesReplicache = () => {
	const { signOut } = useAuth()

	useSignInRequired()

	const [demoTodoSequence, setDemoTodoSequence] = useDemoSequence()

	const { data: rep } = useReplicache()

	usePokeListener({ rep })

	const todos = useSubscribe(rep, async tx => await tx.scan({ prefix: `todo/` }).toArray(), [rep])

	console.log('Todos:', todos)

	return (
		<div>
			<button onClick={() => signOut()}>Sign out</button>

			<button
				onClick={async () => {
					await rep.mutate.create({
						todoId: utilGenerateId(),
						name: `To-do #${demoTodoSequence}`,
						sortOrder: 0
					})

					setDemoTodoSequence(prev => prev + 1)
				}}
			>
				Create new
			</button>

			{todos?.some(x => x)
				? todos
						?.sort((a, b) => a.sortOrder - b.sortOrder)
						?.map(todo => (
							<p key={todo.todoId}>
								<button
									onClick={async () =>
										await rep.mutate.update({ todoId: todo.todoId, name: utilGenerateId() })
									}
								>
									Change Name
								</button>{' '}
								<button onClick={async () => await rep.mutate.delete(todo.todoId)}>Delete</button>{' '}
								<b>{todo.todoId}:</b> <span>{todo.name}</span>{' '}
							</p>
						))
				: null}
		</div>
	)
}

export default PagesReplicache

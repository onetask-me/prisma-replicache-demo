// Packages
import { useSubscribe } from 'replicache-react'
// Utilities
import utilGenerateId from 'utils/generateId'
// Hooks
import usePokeListener from 'hooks/pokeListener'
import useReplicache from 'hooks/replicache'
import useSignInRequired from 'hooks/signInRequired'

const PagesHome = () => {
	useSignInRequired()

	const [demoTodoSequence, setDemoTodoSequence] = useState(0)

	const { data: rep } = useReplicache()

	usePokeListener({ rep })

	const todos = useSubscribe(rep, async tx => await tx.scan({ prefix: `todo/` }).toArray(), [rep])

	return (
		<div>
			<button
				onClick={() => {
					rep.mutate.create({
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
									onClick={() => {
										rep.mutate.update({ todoId: todo.todoId, name: utilGenerateId() })
									}}
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

export default PagesHome

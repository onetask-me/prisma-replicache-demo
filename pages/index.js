// Packages
import { useSubscribe } from 'replicache-react'
// Utilities
import utilGenerateId from 'utils/generateId'
// Hooks
import useGetUserIdAndSpaceId from 'hooks/getUserIdAndSpaceId'
import usePokeListener from 'hooks/pokeListener'
import useReplicache from 'hooks/replicache'
import useSignInRequired from 'hooks/signInRequired'

const PagesHome = () => {
	useSignInRequired()

	const {
		data: { spaceId, userId }
	} = useGetUserIdAndSpaceId()

	const { data: rep } = useReplicache()

	usePokeListener({ rep })

	const todos = useSubscribe(
		rep,
		async tx => await tx.scan({ prefix: `${spaceId}/todo/` }).toArray(),
		[rep]
	)

	return (
		<div>
			<h1>Home</h1>

			<p>User ID: {userId}</p>
			<p>Space ID: {spaceId}</p>

			<button
				onClick={() => {
					rep.mutate.create({
						todoId: utilGenerateId(),
						name: `Task #${todos?.length + 1}`,
						sortOrder: 0
					})
				}}
			>
				Create a new task
			</button>

			{todos?.some(x => x)
				? todos
						?.sort((a, b) => a.sortOrder - b.sortOrder)
						?.map(todo => (
							<p key={todo.todoId}>
								<button
									onClick={() => {
										rep.mutate.update({
											todoId: todo.todoId,
											name: `${todo.name} ${utilGenerateId()}`
										})
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

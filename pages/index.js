// Packages
import { useState } from 'react'
import { useSubscribe } from 'replicache-react'
import { useRouter } from 'next/router'
// Utilities
import utilGenerateId from 'utils/generateId'
// Hooks
import usePokeListener from 'hooks/pokeListener'
import useReplicache from 'hooks/replicache'

const PagesHome = () => {
	const router = useRouter()

	const [spaceId, setSpaceId] = useState(null)
	const [userId, setUserId] = useState(null)

	const { data: rep } = useReplicache({ setSpaceId, setUserId, spaceId, userId })

	usePokeListener({ rep })

	const todos = useSubscribe(
		rep,
		async tx => await tx.scan({ prefix: `${spaceId}/todo/` }).toArray(),
		[rep]
	)

	if (!spaceId || !userId)
		return (
			<div>
				<button
					onClick={() => {
						router.push('/login')
					}}
				>
					Log in
				</button>
			</div>
		)

	return (
		<div>
			<h1>Home</h1>

			<p>User ID: {userId}</p>

			<button
				onClick={() => {
					setUserId(null)

					setSpaceId(null)
				}}
			>
				Log out
			</button>

			<p>---</p>

			<p>Space ID: {spaceId}</p>

			<button
				onClick={() => {
					if (spaceId === window.localStorage.getItem('spaceId')) setSpaceId(utilGenerateId())
					else setSpaceId(window.localStorage.getItem('spaceId'))
				}}
			>
				Switch space
			</button>

			<p>---</p>

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

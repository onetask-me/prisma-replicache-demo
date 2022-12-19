// Packages
import { useState } from 'react'
import { useSubscribe } from 'replicache-react'
import { useRouter } from 'next/router'
// Utilities
import utilResetAccount from 'utils/resetAccount'
import utilGenerateId from 'utils/generateId'
// Hooks
import useOnLoad from 'hooks/onLoad'
import usePokeListener from 'hooks/pokeListener'
import useReplicache from 'hooks/replicache'

const PagesHome = () => {
	const router = useRouter()

	const [spaceId, setSpaceId] = useState(null)
	const [userId, setUserId] = useState(null)

	useOnLoad({ setSpaceId, setUserId })

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

			<button
				onClick={() => {
					utilResetAccount({ setSpaceId, setUserId })
				}}
			>
				Log out and remove cookies
			</button>

			<p>---</p>

			<p>Space ID: {spaceId}</p>

			<button
				onClick={() => {
					setSpaceId(prev =>
						prev === window.localStorage.getItem('spaceId1')
							? window.localStorage.getItem('spaceId2')
							: window.localStorage.getItem('spaceId1')
					)
				}}
			>
				Switch space
			</button>

			<p>---</p>

			<button
				onClick={() => {
					rep.mutate.create({
						todoId: utilGenerateId(),
						isDeleted: false,
						name: `Task #${todos?.length + 1}`
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
											isDeleted: false,
											name: `${todo.name} ${utilGenerateId()}`
										})
									}}
								>
									Change Name
								</button>{' '}
								<button onClick={async () => await rep.mutate.delete(todo.todoId)}>Delete</button>{' '}
								<span>{todo.name}</span>{' '}
							</p>
						))
				: null}
		</div>
	)
}

export default PagesHome

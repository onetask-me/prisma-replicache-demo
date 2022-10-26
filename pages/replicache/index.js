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

	const handleNewItem = text =>
		rep.mutate.create({ todoId: utilGenerateId(), isArchived: false, isDraft: false, name: text })

	const handleUpdateTodo = update => rep.mutate.update(update)

	const handleDeleteTodos = async id => await rep.mutate.delete(id)

	console.log('Todos:', todos)

	return (
		<div>
			<button onClick={() => signOut()}>Sign out</button>

			<button onClick={() => handleNewItem('yo')}>Create new</button>

			{todos?.some(x => x)
				? todos?.map(todo => (
						<p key={todo.todoId} onClick={() => handleDeleteTodos(todo.todoId)}>
							<b>{todo.todoId}: </b>
							{todo.name}
						</p>
				  ))
				: null}
		</div>
	)
}

export default PagesReplicache

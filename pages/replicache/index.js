// Packages
import { useSubscribe } from 'replicache-react'
// Utilities
import utilGenerateId from 'utils/generateId'
// Hooks
import useReplicache from 'hooks/replicache'

const PagesReplicache = () => {
	const { data: rep } = useReplicache()

	const todos = useSubscribe(rep, async tx => await tx.scan({ prefix: `todo/` }).toArray(), [rep])

	const handleNewItem = text =>
		rep.mutate.create({ todoId: utilGenerateId(), name: text, isDraft: false })

	const handleUpdateTodo = update => rep.mutate.update(update)

	const handleDeleteTodos = async id => await rep.mutate.delete(id)

	console.log('Todos:', todos)

	return (
		<>
			<div className='cursor-pointer' onClick={() => handleNewItem('yo')}>
				Create new
			</div>

			{todos?.some(x => x)
				? todos?.map(todo => (
						<div key={todo.todoId} onClick={() => handleDeleteTodos(todo.todoId)}>
							<b>{todo.todoId}: </b>
							{todo.name}
						</div>
				  ))
				: null}
		</>
	)
}

export default PagesReplicache

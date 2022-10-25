// Replicache
import todoGet from 'resolvers/todo/get'

const ReplicacheTodoCreate = async (tx, todo) => {
	const todos = await todoGet(tx)

	todos.sort((t1, t2) => t1.sortOrder - t2.sortOrder)

	const maxSort = todos.pop()?.sortOrder ?? 0

	console.log('Create todo:', todo)

	await tx.put(todo.todoId, { ...todo, sortOrder: maxSort + 1 })
}

export default ReplicacheTodoCreate

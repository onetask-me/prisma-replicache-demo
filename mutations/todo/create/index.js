// Replicache
import todoGet from 'mutations/todo/get'

const ResolversTodoCreate = async (tx, todo) => {
	const key = `todo/${todo.todoId}`

	if (await tx.has(key)) throw new Error('Todo already exists')

	const todos = await todoGet(tx)

	console.log('Create todo:', todo)

	await tx.put(key, { ...todo, name: `#${todos?.length + 1} ${todo.name}`, sortOrder: 0 })
}

export default ResolversTodoCreate

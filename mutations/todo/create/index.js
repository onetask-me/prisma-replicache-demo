// Mutations
import mutationTodoGet from 'mutations/todo/get'
import mutationTodoUpdate from 'mutations/todo/update'

const MutationsTodoCreate = async (tx, args) => {
	const key = `todo/${args.todoId}`

	if (await tx.has(key)) throw new Error('Todo already exists')

	const todos = await mutationTodoGet(tx)

	// Update sort order in local cache
	for await (let todo of todos) {
		console.log('Update', todo.sortOrder + 1)

		await mutationTodoUpdate(tx, { todoId: todo.todoId, sortOrder: todo.sortOrder + 1 })
	}

	console.log('Create', args.sortOrder)

	await tx.put(key, args)
}

export default MutationsTodoCreate

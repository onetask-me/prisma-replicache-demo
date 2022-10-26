const ResolversTodoCreate = async (tx, args) => {
	const key = `todo/${args.todoId}`

	if (await tx.has(key)) throw new Error('Todo already exists')

	console.log('Create todo:', args)

	await tx.put(key, args)
}

export default ResolversTodoCreate

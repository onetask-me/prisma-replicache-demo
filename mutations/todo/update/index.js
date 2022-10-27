const MutationsTodoUpdate = async (tx, args) => {
	const key = `todo/${args.todoId}`

	const prev = await tx.get(key)

	await tx.put(key, { ...prev, ...args })
}

export default MutationsTodoUpdate

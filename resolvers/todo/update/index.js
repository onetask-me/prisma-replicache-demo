const ReplicacheTodoUpdate = async (tx, update) => {
	const prev = await tx.get(update.id)

	const next = { ...prev, ...update }

	await tx.put(next.id, next)
}

export default ReplicacheTodoUpdate

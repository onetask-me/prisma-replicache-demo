const UtilsApiMutationsCreate = async ({ args, spaceId, tx, versionNext }) => {
	const prismaTodoFindUnique = await tx.todo.findUnique({ where: { todoId: args.todoId } })

	if (prismaTodoFindUnique) return

	// Update sort order
	const count = await tx.todo.count({
		where: { AND: [{ isDeleted: false }, { spaceId }] }
	})

	try {
		await tx.todo.create({
			data: {
				// --- SYSTEM ---
				versionUpdatedAt: versionNext,
				// --- RELATIONS ---
				space: { connect: { spaceId } },
				// --- FIELDS ---
				...args,
				sortOrder: count
			},
			select: { todoId: true }
		})
	} catch (err) {
		console.error(err.message)
	}

	return
}

export default UtilsApiMutationsCreate

const UtilsApiMutationsCreate = async ({ args, versionNext, spaceId, tx }) => {
	const prismaTodoFindUnique = await tx.todo.findUnique({ where: { todoId: args.todoId } })

	if (prismaTodoFindUnique) return

	// Update sort order
	await tx.todo.updateMany({
		where: {
			AND: [{ isArchived: false }, { isDeleted: false }, { isDraft: false }, { spaceId }]
		},
		data: { sortOrder: { increment: 1 } }
	})

	try {
		await tx.todo.create({
			data: {
				// --- SYSTEM ---
				versionUpdatedAt: versionNext,
				// --- RELATIONS ---
				Space: { connect: { spaceId } },
				// --- FIELDS ---
				...args
			},
			select: { todoId: true }
		})
	} catch (err) {
		console.error(err.message)
	}

	return
}

export default UtilsApiMutationsCreate

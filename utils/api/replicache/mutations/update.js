const UtilsApiMutationsUpdate = async ({ args, spaceId, tx, versionNext }) => {
	try {
		await tx.todo.update({
			where: { todoId: args.todoId },
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

export default UtilsApiMutationsUpdate

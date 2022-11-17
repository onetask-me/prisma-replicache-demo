const UtilsApiMutationsUpdate = async ({ args, versionNext, spaceId, tx }) => {
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
		console.error(err)
	}

	return
}

export default UtilsApiMutationsUpdate

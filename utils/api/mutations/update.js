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
			}
		})
	} catch (err) {
		console.error(err)
	}
}

export default UtilsApiMutationsUpdate

const UtilsApiMutationsDelete = async ({ args, versionNext, spaceId, tx }) => {
	try {
		await tx.todo.updateMany({
			where: { AND: [{ todoId: args, spaceId }] },
			data: {
				// --- SYSTEM ---
				versionUpdatedAt: versionNext,
				// --- FIELDS ---
				isDeleted: true
			}
		})
	} catch (err) {
		console.error(err)
	}

	return
}

export default UtilsApiMutationsDelete

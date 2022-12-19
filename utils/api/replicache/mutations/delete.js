const UtilsApiMutationsDelete = async ({ args, spaceId, tx, versionNext }) => {
	try {
		await tx.todo.updateMany({
			where: { AND: [{ todoId: args }, { spaceId }] },
			data: {
				// --- SYSTEM ---
				versionUpdatedAt: versionNext,
				// --- FIELDS ---
				isDeleted: true
			}
		})
	} catch (err) {
		console.error(err.message)
	}

	return
}

export default UtilsApiMutationsDelete

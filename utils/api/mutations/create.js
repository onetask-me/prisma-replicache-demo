const UtilsApiMutationsCreate = async ({ args, versionNext, spaceId, tx }) => {
	// Update sort order
	await tx.todo.updateMany({
		where: {
			AND: [{ isArchived: false }, { isDeleted: false }, { isDraft: false }, { spaceId }]
		},
		data: {
			sortOrder: { increment: 1 }
		}
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
			}
		})
	} catch (err) {
		console.error(err)
	}

	return
}

export default UtilsApiMutationsCreate

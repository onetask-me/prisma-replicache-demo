const UtilsApiPushMutationsCreate = async ({ args, nextMutationId, spaceId, tx }) => {
	// Update sort order
	await tx.todo.updateMany({
		where: {
			AND: [{ isArchived: false }, { isDeleted: false }, { isDraft: false }, { spaceId }]
		},
		data: {
			sortOrder: { increment: 1 }
		}
	})

	return await tx.todo.create({
		data: {
			// --- RELATIONS ---
			Space: { connect: { spaceId } },
			// --- FIELDS ---
			...args,
			lastModifiedVersion: nextMutationId
		}
	})
}

export default UtilsApiPushMutationsCreate

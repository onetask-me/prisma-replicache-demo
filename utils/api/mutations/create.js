const UtilsApiPushMutationsCreate = async ({ args, nextMutationId, spaceId, tx }) =>
	await tx.todo.create({
		data: {
			// --- RELATIONS ---
			Space: { connect: { spaceId } },
			// --- FIELDS ---
			...args,
			lastModifiedVersion: nextMutationId
		}
	})

export default UtilsApiPushMutationsCreate

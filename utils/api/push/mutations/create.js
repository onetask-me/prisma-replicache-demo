const UtilsApiPushMutationsCreate = async ({ args, nextMutationId, tx, userId }) =>
	await tx.todo.create({
		data: {
			// --- RELATIONS ---
			User: { connect: { userId } },
			// --- FIELDS ---
			...args,
			lastModifiedVersion: nextMutationId
		}
	})

export default UtilsApiPushMutationsCreate

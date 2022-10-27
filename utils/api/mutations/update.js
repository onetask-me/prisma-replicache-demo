const UtilsApiMutationsUpdate = async ({ args, nextMutationId, spaceId, tx }) =>
	await tx.todo.update({
		where: { todoId: args.todoId },
		data: {
			// --- RELATIONS ---
			Space: { connect: { spaceId } },
			// --- FIELDS ---
			...args,
			lastModifiedVersion: nextMutationId
		}
	})

export default UtilsApiMutationsUpdate

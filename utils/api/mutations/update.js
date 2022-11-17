const UtilsApiMutationsUpdate = async ({ args, versionNext, spaceId, tx }) =>
	await tx.todo.update({
		where: { todoId: args.todoId },
		data: {
			// --- RELATIONS ---
			Space: { connect: { spaceId } },
			// --- FIELDS ---
			...args,
			lastModifiedVersion: versionNext
		}
	})

export default UtilsApiMutationsUpdate

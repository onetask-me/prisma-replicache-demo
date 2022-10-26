const UtilsApiPushMutationsDelete = async ({ args, nextMutationId, spaceId, tx }) =>
	await tx.todo.updateMany({
		where: { AND: [{ todoId: args, spaceId }] },
		data: {
			isDeleted: true,
			lastModifiedVersion: nextMutationId
		}
	})

export default UtilsApiPushMutationsDelete

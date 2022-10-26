const UtilsApiPushMutationsDelete = async ({ args, spaceId, tx }) =>
	await tx.todo.updateMany({
		where: { AND: [{ todoId: args, spaceId }] },
		data: {
			isDeleted: true
		}
	})

export default UtilsApiPushMutationsDelete

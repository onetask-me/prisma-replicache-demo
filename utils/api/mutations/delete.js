const UtilsApiPushMutationsDelete = async ({ args, spaceId, tx }) =>
	await tx.todo.deleteMany({ where: { AND: [{ todoId: args, spaceId }] } })

export default UtilsApiPushMutationsDelete

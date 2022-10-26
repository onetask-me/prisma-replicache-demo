const UtilsApiPushMutationsDelete = async ({ spaceId, todoId, tx }) =>
	await tx.todo.deleteMany({ where: { AND: [{ todoId, spaceId }] } })

export default UtilsApiPushMutationsDelete

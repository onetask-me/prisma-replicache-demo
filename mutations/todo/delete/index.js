const ResolversTodoDelete = async (tx, todoId) => await tx.del(todoId)

export default ResolversTodoDelete

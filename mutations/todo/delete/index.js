const ResolversTodoDelete = async (tx, args) => await tx.del(`todo/${args}`)

export default ResolversTodoDelete

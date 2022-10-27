const MutationsTodoDelete = async (tx, args) => await tx.del(`todo/${args}`)

export default MutationsTodoDelete

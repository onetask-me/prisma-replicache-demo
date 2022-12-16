const MutationsTodoDelete = async ({ tx, args, spaceId }) => await tx.del(`${spaceId}/todo/${args}`)

export default MutationsTodoDelete

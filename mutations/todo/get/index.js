const MutationsTodoGet = async tx => await tx.scan().values().toArray()

export default MutationsTodoGet

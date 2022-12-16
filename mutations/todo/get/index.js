const MutationsTodoGet = async (tx, spaceId) =>
	await tx
		.scan({ prefix: `${spaceId}/todo/` })
		.values()
		.toArray()

export default MutationsTodoGet

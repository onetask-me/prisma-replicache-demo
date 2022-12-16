const MutationsTodoGet = async ({ tx, args, spaceId }) =>
	await tx
		.scan({ prefix: `${spaceId}/todo/` })
		.values()
		.toArray()

export default MutationsTodoGet

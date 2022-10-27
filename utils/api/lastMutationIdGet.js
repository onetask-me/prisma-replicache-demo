const UtilsApiLastMutationIdGet = async ({ clientID, tx }) => {
	let lastMutationId

	const prismaReplicacheClientFindUnique = await tx.replicacheClient.findUnique({
		where: { clientId: clientID },
		select: { lastMutationId: true }
	})

	lastMutationId = prismaReplicacheClientFindUnique?.lastMutationId

	if (!prismaReplicacheClientFindUnique) {
		await tx.replicacheClient.create({
			data: {
				clientId: clientID,
				lastMutationId: 0
			}
		})

		lastMutationId = 0
	}

	return { data: lastMutationId }
}

export default UtilsApiLastMutationIdGet

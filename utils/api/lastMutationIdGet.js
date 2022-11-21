const UtilsApiLastMutationIdGet = async ({ clientID, tx }) => {
	let lastMutationId

	const prismaReplicacheFindUnique = await tx.replicache.findUnique({
		where: { replicacheId: clientID },
		select: { lastMutationId: true }
	})

	if (prismaReplicacheFindUnique) lastMutationId = prismaReplicacheFindUnique.lastMutationId
	else {
		await tx.replicache.create({
			data: {
				replicacheId: clientID,
				lastMutationId: 0
			},
			select: { lastMutationId: true }
		})

		lastMutationId = 0
	}

	return { data: lastMutationId }
}

export default UtilsApiLastMutationIdGet

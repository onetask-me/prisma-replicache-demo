const UtilsApiPushLastMutationIdGet = async ({ clientID, tx }) => {
	const prismaReplicacheClientFindUnique = await tx.replicacheClient.findUnique({
		where: { clientId: clientID },
		select: { lastMutationId: true }
	})

	return { data: prismaReplicacheClientFindUnique?.lastMutationId ?? 0 }
}

export default UtilsApiPushLastMutationIdGet

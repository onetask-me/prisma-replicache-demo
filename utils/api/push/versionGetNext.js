const UtilsApiPushVersionGet = async ({ spaceID, tx }) => {
	const prismaReplicacheSpaceFindUnique = await tx.replicacheSpace.findUnique({
		where: { spaceId: spaceID },
		select: { version: true }
	})

	if (!prismaReplicacheSpaceFindUnique) return { error: `Unknown space ${spaceID}` }

	return { data: prismaReplicacheSpaceFindUnique.version + 1 }
}

export default UtilsApiPushVersionGet

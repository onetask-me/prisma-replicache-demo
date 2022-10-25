const UtilsApiPushVersionGet = async ({ tx, userId }) => {
	const prismaReplicacheSpaceFindUnique = await tx.replicacheSpace.findUnique({
		where: { spaceId: userId },
		select: { version: true }
	})

	if (!prismaReplicacheSpaceFindUnique) return { error: `Unknown space ${userId}` }

	return { data: prismaReplicacheSpaceFindUnique.version + 1 }
}

export default UtilsApiPushVersionGet

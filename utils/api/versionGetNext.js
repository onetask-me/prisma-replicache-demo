const UtilsApiPushVersionGet = async ({ tx, spaceId }) => {
	const prismaReplicacheSpaceFindUnique = await tx.space.findUnique({
		where: { spaceId },
		select: { version: true }
	})

	if (!prismaReplicacheSpaceFindUnique) return { error: `spaceId #${spaceId} not found` }

	return { data: prismaReplicacheSpaceFindUnique.version + 1 }
}

export default UtilsApiPushVersionGet

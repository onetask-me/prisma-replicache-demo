const UtilsApiVersionGet = async ({ tx, spaceId, userId }) => {
	// Important: we need to make sure that the `spaceId` provided in the query is also owned by user
	console.log('************ →', spaceId, userId)

	const prismaReplicacheSpaceFindFirst = await tx.space.findFirst({
		where: { AND: [{ spaceId }, { userId }] },
		select: { version: true }
	})

	if (!prismaReplicacheSpaceFindFirst) return { error: `spaceId #${spaceId} not found` }

	return { data: prismaReplicacheSpaceFindFirst.version + 1 }
}

export default UtilsApiVersionGet

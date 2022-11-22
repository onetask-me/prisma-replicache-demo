const UtilsApiVersionGet = async ({ tx, spaceId, userId }) => {
	// Important: we need to make sure that the `spaceId` provided in the query is also owned by user
	const prismaSpaceFindFirst = await tx.space.findFirst({
		where: { AND: [{ spaceId }, { userId }] },
		select: { versionAt: true }
	})

	if (!prismaSpaceFindFirst) throw new Error('space_not_found')

	return { data: prismaSpaceFindFirst.versionAt + 1 }
}

export default UtilsApiVersionGet

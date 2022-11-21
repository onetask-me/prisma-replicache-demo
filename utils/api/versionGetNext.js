const UtilsApiVersionGet = async ({ tx, spaceId, userId }) => {
	// Important: we need to make sure that the `spaceId` provided in the query is also owned by user
	const prismaSpaceFindFirst = await tx.space.findFirst({
		where: { AND: [{ spaceId }, { userId }] },
		select: { versionAt: true }
	})

	if (prismaSpaceFindFirst?.versionAt === undefined) {
		const prismaSpaceCreateOne = await tx.space.create({
			data: {
				// --- PUBLIC ID ---
				spaceId,
				// --- RELATIONS ---
				User: { connect: { userId } },
				// --- FIELDS ---
				versionAt: 0
			},
			select: { versionAt: true }
		})

		return { data: prismaSpaceCreateOne.versionAt + 1 }
	}

	return { data: prismaSpaceFindFirst.versionAt + 1 }
}

export default UtilsApiVersionGet

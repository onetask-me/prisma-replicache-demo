const UtilsApiVersionGet = async ({ tx, spaceId, userId }) => {
	// Important: we need to make sure that the `spaceId` provided in the query is also owned by user
	const prismaSpaceFindFirst = await tx.space.findFirst({
		where: { AND: [{ spaceId }, { userId }] },
		select: { version: true }
	})

	if (prismaSpaceFindFirst?.version === undefined) {
		const prismaSpaceCreateOne = await tx.space.create({
			data: {
				// --- PUBLIC ID ---
				spaceId,
				// --- RELATIONS ---
				User: { connect: { userId } },
				// --- FIELDS ---
				version: 0
			},
			select: { version: true }
		})

		return { data: prismaSpaceCreateOne.version + 1 }
	}

	return { data: prismaSpaceFindFirst.version + 1 }
}

export default UtilsApiVersionGet

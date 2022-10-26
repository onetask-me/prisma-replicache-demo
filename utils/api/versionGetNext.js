const UtilsApiPushVersionGet = async ({ tx, spaceId }) => {
	let version = 0

	const prismaReplicacheSpaceFindUnique = await tx.replicacheSpace.findUnique({
		where: { spaceId },
		select: { version: true }
	})

	version = prismaReplicacheSpaceFindUnique?.version
		? prismaReplicacheSpaceFindUnique.version + 1
		: 0

	if (!prismaReplicacheSpaceFindUnique)
		await tx.replicacheSpace.create({
			data: {
				spaceId,
				version: 0
			}
		})

	return { data: version }
}

export default UtilsApiPushVersionGet

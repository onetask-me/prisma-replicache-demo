const UtilsApiPushVersionGet = async ({ spaceID, tx, version }) =>
	await tx.replicacheSpace.update({
		where: { spaceId: spaceID },
		data: { version }
	})

export default UtilsApiPushVersionGet

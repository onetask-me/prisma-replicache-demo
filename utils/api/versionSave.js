const UtilsApiPushVersionGet = async ({ tx, spaceId, version }) =>
	await tx.replicacheSpace.update({
		where: { spaceId },
		data: { version }
	})

export default UtilsApiPushVersionGet

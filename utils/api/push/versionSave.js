const UtilsApiPushVersionGet = async ({ tx, userId version }) =>
	await tx.replicacheSpace.update({
		where: { spaceId: userId },
		data: { version }
	})

export default UtilsApiPushVersionGet

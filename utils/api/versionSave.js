const UtilsApiVersionGet = async ({ tx, spaceId, version }) =>
	await tx.space.updateMany({
		where: { spaceId },
		data: { version }
	})

export default UtilsApiVersionGet

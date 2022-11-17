const UtilsApiVersionGet = async ({ tx, spaceId, version }) =>
	await tx.space.update({ where: { spaceId }, data: { version } })

export default UtilsApiVersionGet

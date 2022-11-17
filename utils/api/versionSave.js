const UtilsApiVersionSave = async ({ tx, spaceId, version }) => {
	try {
		const prismaSpaceUpdate = await tx.space.update({
			where: { spaceId },
			data: { version },
			select: { version: true }
		})

		return { data: prismaSpaceUpdate }
	} catch (err) {
		console.error(err)
	}
}

export default UtilsApiVersionSave

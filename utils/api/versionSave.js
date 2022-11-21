const UtilsApiVersionSave = async ({ tx, spaceId, versionAt }) => {
	try {
		const prismaSpaceUpdate = await tx.space.update({
			where: { spaceId },
			data: { versionAt },
			select: { versionAt: true }
		})

		return { data: prismaSpaceUpdate }
	} catch (err) {
		console.error(err)
	}
}

export default UtilsApiVersionSave

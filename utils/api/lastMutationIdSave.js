const UtilsApiLastMutationIdSave = async ({ replicacheId, nextMutationId, tx }) => {
	console.log('Setting', replicacheId, 'replicacheId to', nextMutationId)

	await tx.replicache.update({
		where: { replicacheId },
		data: { lastMutationId: nextMutationId }
	})
}

export default UtilsApiLastMutationIdSave

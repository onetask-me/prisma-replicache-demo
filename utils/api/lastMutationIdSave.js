const UtilsApiLastMutationIdSave = async ({ clientID, nextMutationId, tx }) => {
	console.log('Setting', clientID, 'lastMutationId to', nextMutationId)

	await tx.replicache.update({
		where: { replicacheId: clientID },
		data: { lastMutationId: nextMutationId }
	})
}

export default UtilsApiLastMutationIdSave

const UtilsApiLastMutationIdSave = async ({ clientID, nextMutationId, tx }) => {
	console.log('Setting', clientID, 'lastMutationId to', nextMutationId)

	await tx.replicacheClient.update({
		where: { clientId: clientID },
		data: { lastMutationId: nextMutationId }
	})
}

export default UtilsApiLastMutationIdSave

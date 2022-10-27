const UtilsApiLastMutationIdSave = async ({ clientID, lastMutationId, tx }) => {
	console.log('Setting', clientID, 'lastMutationId to', lastMutationId)

	await tx.replicacheClient.update({
		where: { clientId: clientID },
		data: { lastMutationId }
	})
}

export default UtilsApiLastMutationIdSave

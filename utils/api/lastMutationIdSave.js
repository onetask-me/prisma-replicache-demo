const UtilsApiPushLastMutationIdSave = async ({ clientID, tx }) => {
	console.log('Setting', clientID, 'lastMutationId to', lastMutationId)

	await tx.replicacheClient.update({
		where: { clientId: clientID },
		data: { lastMutationId }
	})
}

export default UtilsApiPushLastMutationIdSave

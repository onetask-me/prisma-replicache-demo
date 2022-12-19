const UtilsApiLastMutationIdSave = async ({ replicacheClientId, nextMutationId, tx }) => {
	console.log('Setting', replicacheClientId, 'replicacheClientId to', nextMutationId)

	await tx.replicacheClient.update({
		where: { replicacheClientId },
		data: { lastMutationId: nextMutationId }
	})
}

export default UtilsApiLastMutationIdSave

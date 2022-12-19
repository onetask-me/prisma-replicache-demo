// Utilities
import utilApiMutationsCreate from 'utils/api/replicache/mutations/create'
import utilApiMutationsDelete from 'utils/api/replicache/mutations/delete'
import utilApiMutationsUpdate from 'utils/api/replicache/mutations/update'

const UtilsApiMutations = async ({ lastMutationId, mutations, spaceId, tx, versionNext }) => {
	let nextMutationId = lastMutationId

	for await (const mutation of mutations) {
		// Verify before processing mutation
		if (mutation.id < nextMutationId + 1) {
			console.log(`Mutation ${mutation.id} has already been processed - skipping`)
			continue
		}

		if (mutation.id > nextMutationId + 1) {
			console.warn(`Mutation ${mutation.id} is from the future - aborting`)
			break
		}

		try {
			console.log('Processing mutation', nextMutationId + 1, JSON.stringify(mutation))

			if (mutation.name === 'create')
				await utilApiMutationsCreate({ args: mutation.args, spaceId, tx, versionNext })
			else if (mutation.name === 'update')
				await utilApiMutationsUpdate({ args: mutation.args, spaceId, tx, versionNext })
			else if (mutation.name === 'delete')
				await utilApiMutationsDelete({ args: mutation.args, spaceId, tx, versionNext })

			// Only increase mutation id upon successful mutation
			nextMutationId++
		} catch (err) {
			console.error(err)
		}
	}

	return { data: nextMutationId }
}

export default UtilsApiMutations

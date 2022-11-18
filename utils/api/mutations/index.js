// Utilities
import utilApiMutationsCreate from 'utils/api/mutations/create'
import utilApiMutationsDelete from 'utils/api/mutations/delete'
import utilApiMutationsUpdate from 'utils/api/mutations/update'

const UtilsApiMutations = async ({ lastMutationId, mutations, spaceId, tx, versionNext }) => {
	let nextMutationId = lastMutationId

	nextMutationId++

	for await (const mutation of mutations) {
		if (mutation.id < nextMutationId) {
			console.log(`Mutation ${mutation.id} has already been processed - skipping`)
			continue
		}

		if (mutation.id > nextMutationId) {
			console.warn(`Mutation ${mutation.id} is from the future - aborting`)
			break
		}

		console.log('Processing mutation', nextMutationId, JSON.stringify(mutation))

		if (mutation.name === 'create')
			await utilApiMutationsCreate({ args: mutation.args, versionNext, spaceId, tx })
		else if (mutation.name === 'update')
			await utilApiMutationsUpdate({ args: mutation.args, versionNext, spaceId, tx })
		else if (mutation.name === 'delete')
			await utilApiMutationsDelete({ args: mutation.args, versionNext, spaceId, tx })

		console.log('Completed mutation', mutation.id)

		nextMutationId++
	}

	console.log('Returning version', versionNext)

	return { data: versionNext }
}

export default UtilsApiMutations

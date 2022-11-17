// Utilities
import utilApiMutationsCreate from 'utils/api/mutations/create'
import utilApiMutationsDelete from 'utils/api/mutations/delete'
import utilApiMutationsUpdate from 'utils/api/mutations/update'

const UtilsApiMutations = async ({ lastMutationId, mutations, spaceId, tx, versionNext }) => {
	let nextMutationId = lastMutationId

	for await (const mutation of mutations) {
		nextMutationId++

		if (mutation.id < nextMutationId) {
			console.log(`Mutation ${mutation.id} has already been processed - skipping`)
			continue
		}

		if (mutation.id > nextMutationId) {
			console.warn(`Mutation ${mutation.id} is from the future - aborting`)
			break
		}

		console.log('Processing mutation', nextMutationId, JSON.stringify(mutation))

		switch (mutation.name) {
			case 'create':
				await utilApiMutationsCreate({ args: mutation.args, versionNext, spaceId, tx })
				break

			case 'update':
				await utilApiMutationsUpdate({ args: mutation.args, versionNext, spaceId, tx })
				break

			case 'delete':
				await utilApiMutationsDelete({ args: mutation.args, versionNext, spaceId, tx })
				break

			default:
				throw new Error(`Unknown mutation: ${mutation.name}`)
		}
	}

	return { data: versionNext }
}

export default UtilsApiMutations

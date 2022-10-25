// Utilities
import utilApiMutationsCreate from 'utils/api/mutations/create'

const UtilsApiPushMutations = async ({ mutation, nextMutationId, tx, userId }) => {
	console.log('Processing mutation', nextMutationId, JSON.stringify(mutation))

	switch (mutation.name) {
		case 'create':
			await utilApiMutationsCreate({ args: mutation.args, nextMutationId, tx, userId })
			break

		// ...other mutations, tbd

		default:
			throw new Error(`Unknown mutation: ${mutation.name}`)
	}
}

export default UtilsApiPushMutations

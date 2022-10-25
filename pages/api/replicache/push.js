// Utilities
import prisma from 'utils/prisma'
import utilApiLastMutationIdGet from 'utils/api/lastMutationIdGet'
import utilApiLastMutationIdSave from 'utils/api/lastMutationIdSave'
import utilApiVersionGetNext from 'utils/api/versionGetNext'
import utilApiVersionSave from 'utils/api/versionSave'
import utilApiMutations from 'utils/api/mutations'
import utilAuth from 'utils/auth'

const PagesApiReplicachePush = async (req, res) => {
	console.log('\nPush: ***', req.body, '***\n')

	const { data: authUser, error: authUserErr } = await utilAuth(req, res)
	if (authUserErr) res.json({ error: authUserErr })

	const { clientID, mutations } = req.body

	const userId = authUser.id

	try {
		await prisma.$transaction(async tx => {
			// #1. Get next `version` for Replicache Space
			const { data: versionNext } = await utilApiVersionGetNext({ tx, userId })

			// #2. Get last mutation Id for client
			let { data: lastMutationId } = await utilApiLastMutationIdGet({ clientID, tx })

			// #3. Iterate mutations, increase mutation Id on each iteration
			for (const mutation of mutations) {
				const nextMutationId = lastMutationId + 1

				if (mutation.id < nextMutationId) {
					console.log(`Mutation ${mutation.id} has already been processed - skipping`)
					continue
				}

				if (mutation.id > nextMutationId) {
					console.warn(`Mutation ${mutation.id} is from the future - aborting`)
					break
				}

				// Perform mutations
				await utilApiMutations({ mutation, nextMutationId, tx, userId })

				lastMutationId = nextMutationId
			}

			// #4. Save mutation Id to Client
			await utilApiLastMutationIdSave({ clientID, tx })

			// #5. Save new version to Space
			await utilApiVersionSave({ tx, userId, version: versionNext })
		})

		// #6. We need to use `await` here, otherwise Next.js will frequently kill the request and the poke won't get sent.
		console.log('Poke')

		res.json({ done: true })
	} catch (err) {
		console.error(err)

		res.status(500).send(err.toString())
	}
}

export default PagesApiReplicachePush

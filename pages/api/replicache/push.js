// Packages
import { Prisma } from '@prisma/client'
// Utilities
import prisma from 'utils/prisma'
import utilApiLastMutationIdGet from 'utils/api/lastMutationIdGet'
import utilApiLastMutationIdSave from 'utils/api/lastMutationIdSave'
import utilApiVersionGet from 'utils/api/versionGet'
import utilApiVersionSave from 'utils/api/versionSave'
import utilApiMutations from 'utils/api/mutations'
import utilApiPokeSend from 'utils/api/pokeSend'
import utilAuth from 'utils/auth'

const PagesApiReplicachePush = async (req, res) => {
	console.log('\nPush: ***', req.body, '***\n')

	const { data: userId, error: userErr } = await utilAuth(req, res)
	if (!userId || userErr) return res.status(401).json({ error: 'user_not_found' })

	// Provided by Replicache
	const { clientID, mutations } = req.body

	// Provided by client
	const { spaceId } = req.query

	if (!clientID || !spaceId || !mutations)
		return res.status(403).json({ error: 'insufficient_args' })

	try {
		const { data: versionLatest } = await prisma.$transaction(
			async tx => {
				// #1. Get next `version` for space
				const { data: version } = await utilApiVersionGet({ tx, spaceId, userId })

				const versionNext = version + 1

				// #2. Get last mutation Id for client
				let { data: lastMutationId } = await utilApiLastMutationIdGet({
					replicacheId: clientID,
					tx
				})

				// #3. Iterate mutations, increase mutation Id on each iteration, but use next version for comparison
				const { data: nextMutationId } = await utilApiMutations({
					lastMutationId,
					mutations,
					spaceId,
					tx,
					versionNext
				})

				// #4. Save mutation Id to Client
				await utilApiLastMutationIdSave({ replicacheId: clientID, nextMutationId, tx })

				// #5. Save new version to Space
				const { data: versionUpdated } = await utilApiVersionSave({
					tx,
					spaceId,
					versionAt: versionNext
				})

				return { data: versionUpdated?.versionAt }
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
				maxWait: 5000, // default: 2000
				timeout: 10000 // default: 5000
			}
		)

		// #6. Poke client(s) to send a pull.
		await utilApiPokeSend()

		return res.json({ done: versionLatest })
	} catch (err) {
		console.error(err)

		return res.status(500).json({ error: err.message })
	}
}

export default PagesApiReplicachePush

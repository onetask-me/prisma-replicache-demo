// Packages
import { Prisma } from '@prisma/client'
// Utilities
import prisma from 'utils/api/prisma'
import utilApiEntriesTodoGet from 'utils/api/entries/todoGet'
import utilApiLastMutationIdGet from 'utils/api/lastMutationIdGet'
import utilApiVersionGet from 'utils/api/versionGet'
import utilAuth from 'utils/api/auth'

const PagesApiReplicachePull = async (req, res) => {
	console.log('\nPull: ***', req.body, '***\n')

	const { data: userId, error: userErr } = await utilAuth(req, res)
	if (!userId || userErr) return res.status(401).json({ error: 'user_not_found' })

	// Provided by Replicache
	const { clientID, cookie } = req.body

	// Provided by client
	const { spaceId } = req.query

	if (!clientID || !spaceId || cookie === undefined)
		return res.status(403).json({ error: 'insufficient_args' })

	try {
		const { lastMutationId, versionAt, patch } = await prisma.$transaction(
			async tx => {
				let lastMutationId,
					patch = []

				// #1. Get `version` for space
				const { data: version } = await utilApiVersionGet({ tx, spaceId, userId })

				// #2. Get last mutation Id for the current replicache client
				let { data: mutationId } = await utilApiLastMutationIdGet({ replicacheId: clientID, tx })

				lastMutationId = mutationId

				// #3. Get all transactions done after the last client request for the current space
				const { data: apiEntriesTodoGet } = await utilApiEntriesTodoGet({
					spaceId,
					tx,
					userId,
					versionAt: cookie
				})

				// #4. Put together a patch with instructions for the client
				if (cookie === null) patch.push({ op: 'clear' })

				if (apiEntriesTodoGet?.length)
					patch.push(
						...apiEntriesTodoGet.map(todo => ({
							op: !todo.isDeleted ? 'put' : 'del',
							key: `${spaceId}/todo/${todo.todoId}`,
							value: { ...todo }
						}))
					)

				return { lastMutationId, versionAt: version, patch }
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
				maxWait: 5000, // default: 2000
				timeout: 10000 // default: 5000
			}
		)

		// #5. Return object to client
		return res.json({ lastMutationID: lastMutationId, cookie: versionAt, patch })
	} catch (err) {
		console.error(err)

		return res.status(401).json({ error: err.message })
	}
}

export default PagesApiReplicachePull

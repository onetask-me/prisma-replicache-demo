// Packages
import { Prisma } from '@prisma/client'
// Utilities
import prisma from 'utils/prisma'
import utilApiEntriesTodoGet from 'utils/api/entries/todoGet'
import utilApiLastMutationIdGet from 'utils/api/lastMutationIdGet'
import utilAuth from 'utils/auth'

const PagesApiReplicachePull = async (req, res) => {
	console.log('\nPull: ***', req.body, '***\n')

	const { data: user, error: userErr } = await utilAuth(req, res)
	if (!user || userErr) return res.status(401)

	// Provided by Replicache
	const { clientID, cookie } = req.body

	// Provided by client
	const { spaceId } = req.query

	if (!clientID || !spaceId || cookie === undefined) return res.status(403)

	const { lastMutationId, version, patch } = await prisma.$transaction(
		async tx => {
			let lastMutationId,
				version,
				patch = []

			// #1. Get last mutation Id for the current client
			let { data: mutationId } = await utilApiLastMutationIdGet({ clientID, tx })

			lastMutationId = mutationId

			// #2. Get all transactions done after the last client request for the current space
			const { data: apiEntriesTodoGet } = await utilApiEntriesTodoGet({
				cookie,
				spaceId,
				tx,
				userId: user.id
			})

			// #3. Get the highest authoritative version number
			version = apiEntriesTodoGet?.length
				? Math.max(...apiEntriesTodoGet?.map(x => x.versionUpdatedAt))
				: 0

			// #4. Put together a patch with instructions for the client
			if (cookie === null) patch.push({ op: 'clear' })

			if (apiEntriesTodoGet?.length)
				patch.push(
					...apiEntriesTodoGet.map(todo => {
						delete todo.versionUpdatedAt

						return {
							op: !todo.isDeleted ? 'put' : 'del',
							key: `todo/${todo.todoId}`,
							value: { ...todo }
						}
					})
				)

			return { lastMutationId, version, patch }
		},
		{
			isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
			maxWait: 5000, // default: 2000
			timeout: 10000 // default: 5000
		}
	)

	// #5. Return object to client
	return res.json({ lastMutationID: lastMutationId, cookie: version, patch })
}

export default PagesApiReplicachePull

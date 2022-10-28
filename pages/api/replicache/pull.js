// Utilities
import prisma from 'utils/prisma'
import utilApiEntriesTodoGet from 'utils/api/entries/todoGet'
import utilApiLastMutationIdGet from 'utils/api/lastMutationIdGet'
import utilAuth from 'utils/auth'

const PagesApiReplicachePull = async (req, res) => {
	console.log('\nPull: ***', req.body, '***\n')

	const { data: user, error: userErr } = await utilAuth(req, res)
	if (!user || userErr) return res.status(401)

	const { clientID, cookie } = req.body

	const { spaceId } = req.query

	if (!clientID || !spaceId || cookie === undefined) return res.status(403)

	try {
		await prisma.$transaction(
			async tx => {
				// #1. Get last mutation Id for the current client
				let { data: lastMutationId } = await utilApiLastMutationIdGet({ clientID, tx })

				// #2. Get all transactions done after the last client request for the current space
				const { data: apiEntriesTodoGet } = await utilApiEntriesTodoGet({
					cookie,
					spaceId,
					tx,
					userId: user.id
				})

				// #3. Get the highest authoritative version number
				const replicacheVersion = apiEntriesTodoGet?.length
					? Math.max(...apiEntriesTodoGet?.map(x => x.lastModifiedVersion))
					: 0

				// #4. Put together a patch with instructions for the client
				const patch = []

				if (cookie === null) patch.push({ op: 'clear' })

				patch.push(
					...apiEntriesTodoGet?.map(todo => ({
						op: !todo.isDeleted ? 'put' : 'del',
						key: `todo/${todo.todoId}`,
						value: { ...todo }
					}))
				)

				// #5. Return object to client
				res.json({ lastMutationID: lastMutationId, cookie: replicacheVersion, patch })

				return true
			},
			// FIX: interactive transactions error still occurs with long wait times
			{
				maxWait: 20000,
				timeout: 60000
			}
		)
	} catch (err) {
		console.error(err)

		res.status(500).send(err.toString())
	} finally {
		await prisma.$disconnect()
	}
}

export default PagesApiReplicachePull

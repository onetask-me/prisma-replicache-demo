// Utilities
import prisma from 'utils/prisma'
import utilApiEntriesTodoGet from 'utils/api/entries/todoGet'
import utilApiLastMutationIdGet from 'utils/api/lastMutationIdGet'
import utilAuth from 'utils/auth'

const PagesApiReplicachePull = async (req, res) => {
	console.log('\nPull: ***', req.body, '***\n')

	const { error: authUserErr } = await utilAuth(req, res)
	if (authUserErr) res.json({ error: authUserErr })

	const { clientID, cookie } = req.body

	const { spaceId } = req.query

	try {
		await prisma.$transaction(async tx => {
			// #1. Get last mutation Id for client
			let { data: lastMutationId } = await utilApiLastMutationIdGet({ clientID, tx })

			const { data: apiEntriesTodoGet } = await utilApiEntriesTodoGet({ cookie, spaceId, tx })

			const replicacheVersion = apiEntriesTodoGet?.length
				? Math.max(...apiEntriesTodoGet?.map(x => x.lastModifiedVersion))
				: 0

			const patch = []

			if (cookie === null) patch.push({ op: 'clear' })

			patch.push(
				...apiEntriesTodoGet.map(todo => ({
					op: 'put',
					key: `todo/${todo.todoId}`,
					value: {
						todoId: todo.todoId,
						name: todo.name,
						isArchived: todo.isArchived,
						isDraft: todo.isDraft,
						sortOrder: todo.sortOrder
					}
				}))
			)

			console.log({ lastMutationId, cookie: replicacheVersion, patch })

			res.json({ lastMutationID: lastMutationId, cookie: replicacheVersion, patch })
		})
	} catch (err) {
		console.error(err)

		res.status(500).send(err.toString())
	}
}

export default PagesApiReplicachePull

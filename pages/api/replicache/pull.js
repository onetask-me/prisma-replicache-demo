// Utilities
import prisma from 'utils/prisma'
import utilApiLastMutationIdGet from 'utils/api/lastMutationIdGet'
import utilAuth from 'utils/auth'

const PagesApiReplicachePull = async (req, res) => {
	console.log('\nPull: ***', req.body, '***\n')

	const { data: authUser, error: authUserErr } = await utilAuth(req, res)
	if (authUserErr) res.json({ error: authUserErr })

	const { clientID, cookie } = req.body

	try {
		await prisma.$transaction(async tx => {
			// #1. Get last mutation Id for client
			let { data: lastMutationId } = await utilApiLastMutationIdGet({ clientID, tx })

			const prismaTodoFindMany = await tx.todo.findMany({
				where: {
					AND: [{ lastModifiedVersion: { gt: cookie || 0 } }, { userId: authUser?.userId }]
				},
				select: {
					// --- SYSTEM ---
					lastModifiedVersion: true,
					// --- PUBLIC ID ---
					todoId: true,
					// --- FIELDS ---
					name: true,
					sortOrder: true
				}
			})

			const replicacheVersion = prismaTodoFindMany?.length
				? Math.max(...prismaTodoFindMany?.map(x => x.lastModifiedVersion))
				: 0

			const patch = []

			if (cookie === null) patch.push({ op: 'clear' })

			patch.push(
				...prismaTodoFindMany.map(todo => ({
					op: 'put',
					key: `todo/${todo.todoId}`,
					value: {
						name: todo.name,
						sortOrder: todo.sortOrder
					}
				}))
			)

			console.log({ lastMutationId, cookie: replicacheVersion, patch })

			res.json({ lastMutationId, cookie: replicacheVersion, patch })
		})
	} catch (err) {
		console.error(err)

		res.status(500).send(err.toString())
	}
}

export default PagesApiReplicachePull

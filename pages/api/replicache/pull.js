// Replicache
import todoCreate from 'resolvers/todo/create'
import todoDelete from 'resolvers/todo/delete'
import todoGet from 'resolvers/todo/get'
import todoUpdate from 'resolvers/todo/update'
// Utilities
import prisma from 'utils/prisma'
import utilAuth from 'utils/auth'

const PagesApiReplicachePull = async (req, res) => {
	console.log('\nPull: ***')
	console.log(req.body)
	console.log('Pull: ***\n')

	const { data: authUser, error: authUserErr } = await utilAuth(req, res)
	if (authUserErr) res.json({ error: authUserErr })

	try {
		await prisma.$transaction(async tx => {
			let lastMutationId

			const prismaReplicacheClientFindUnique = await tx.replicacheClient.findUnique({
				where: {
					clientId: req.body.clientID
				},
				select: {
					lastMutationId: true
				}
			})

			lastMutationId = prismaReplicacheClientFindUnique?.lastMutationId || 0

			const prismaTodoFindMany = await tx.todo.findMany({
				where: {
					AND: [{ replicacheVersion: { gt: req.body.cookie || 0 } }, { userId: authUser?.userId }]
				},
				select: {
					// --- SYSTEM ---
					replicacheVersion: true,
					// --- PUBLIC ID ---
					todoId: true,
					// --- FIELDS ---
					name: true,
					sortOrder: true
				}
			})

			const replicacheVersion = prismaTodoFindMany?.length
				? Math.max(...prismaTodoFindMany?.map(x => x.replicacheVersion))
				: 0

			const patch = []

			if (req.body.cookie === null) patch.push({ op: 'clear' })

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

			return res.json({ lastMutationId, cookie: replicacheVersion, patch })
		})
	} catch (err) {
		console.error(err)

		res.status(500).send(err.toString())
	}
}

export default PagesApiReplicachePull

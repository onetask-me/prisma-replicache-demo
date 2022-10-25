// Replicache
import todoCreate from 'resolvers/todo/create'
import todoDelete from 'resolvers/todo/delete'
import todoGet from 'resolvers/todo/get'
import todoUpdate from 'resolvers/todo/update'
// Utilities
import prisma from 'utils/prisma'
import utilAuth from 'utils/auth'
import utilGenerateId from 'utils/generateId'

const PagesApiReplicachePush = async (req, res) => {
	console.log('\nPush: ***')
	console.log(req.body)
	console.log('Push: ***\n')

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

			if (prismaReplicacheClientFindUnique)
				lastMutationId = prismaReplicacheClientFindUnique.lastMutationId
			else {
				const prismaReplicacheClientCreate = await tx.replicacheClient.create({
					data: {
						clientId: req.body.clientID,
						lastMutationId: 0
					},
					select: {
						lastMutationId: true
					}
				})

				lastMutationId = prismaReplicacheClientCreate.lastMutationId
			}

			for (const mutation of req.body.mutations) {
				const t1 = Date.now()

				const expectedMutationId = lastMutationId + 1

				if (mutation.id < expectedMutationId) {
					console.log(`Mutation ${mutation.id} has already been processed - skipping`)
					continue
				}

				if (mutation.id > expectedMutationId) {
					console.warn(`Mutation ${mutation.id} is from the future - aborting`)
					break
				}

				console.log('Processing mutation:', JSON.stringify(mutation))

				console.log('Version:', expectedMutationId)

				switch (mutation.name) {
					case 'create':
						await tx.todo.create({
							data: {
								User: { connect: { userId: authUser.userId } },
								...mutation.args,
								lastModifiedVersion: expectedMutationId
							}
						})
						break

					default:
						throw new Error(`Unknown mutation: ${mutation.name}`)
				}

				lastMutationId = expectedMutationId

				console.log('Processed mutation in', Date.now() - t1)
			}

			console.log('Setting', req.body.clientID, 'lastMutationId to', lastMutationId)

			const prismaReplicacheClientUpdate = await tx.replicacheClient.update({
				where: {
					clientId: req.body.clientID
				},
				data: {
					lastMutationId
				}
			})
		})

		// We need to use `await` here, otherwise Next.js will frequently kill the request and the poke won't get sent.
		console.log('Poke')

		return res.json({ done: true })
	} catch (err) {
		console.error(err)

		res.status(500).send(err.toString())
	}
}

export default PagesApiReplicachePush

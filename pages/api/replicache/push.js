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

	const { clientID, mutations, spaceID } = req.body

	try {
		await prisma.$transaction(async tx => {
			// #1. Get next `version` for Replicache Space
			let versionNext

			const prismaReplicacheSpaceFindUnique = await tx.replicacheSpace.findUnique({
				where: { spaceId: spaceID },
				select: { version: true }
			})

			if (!prismaReplicacheSpaceFindUnique) res.json({ error: `Unknown space ${spaceID}` })

			versionNext = prismaReplicacheSpaceFindUnique.version + 1

			// #2. Get last mutation Id for client
			const prismaReplicacheClientFindUnique = await tx.replicacheClient.findUnique({
				where: { clientId: clientID },
				select: { lastMutationId: true }
			})

			const lastMutationId = prismaReplicacheClientFindUnique?.lastMutationId ?? 0

			// #3. Iterate mutations, increase mutation Id on each iteration
			for (const mutation of mutations) {
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

				// Mutation
				switch (mutation.name) {
					case 'create':
						await tx.todo.create({
							data: {
								// --- RELATIONS ---
								User: { connect: { userId: authUser.userId } },
								// --- FIELDS ---
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

			// #4. Save mutation Id to Client
			console.log('Setting', clientID, 'lastMutationId to', lastMutationId)

			const prismaReplicacheClientUpdate = await tx.replicacheClient.update({
				where: { clientId: clientID },
				data: { lastMutationId }
			})

			// #5. Save new version to Space
			await tx.replicacheSpace.update({
				where: { spaceId: spaceID },
				data: { version: versionNext }
			})
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

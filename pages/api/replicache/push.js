// Utilities
import prisma from 'utils/prisma'
import utilApiLastMutationIdGet from 'utils/api/lastMutationIdGet'
import utilApiLastMutationIdSave from 'utils/api/lastMutationIdSave'
import utilApiVersionGetNext from 'utils/api/versionGetNext'
import utilApiVersionSave from 'utils/api/versionSave'
import utilApiMutations from 'utils/api/mutations'
import utilApiPokeSend from 'utils/api/pokeSend'
import utilAuth from 'utils/auth'

const PagesApiReplicachePush = async (req, res) => {
	console.log('\nPush: ***', req.body, '***\n')

	const { data: user, error: userErr } = await utilAuth(req, res)
	if (!user || userErr) return res.status(401)

	const { clientID, mutations } = req.body

	const { spaceId } = req.query

	if (!clientID || !spaceId || !mutations) return res.status(403)

	try {
		await prisma.$transaction(
			async tx => {
				// #1. Get next `version` for space
				const { data: versionNext, error: versionNextErr } = await utilApiVersionGetNext({
					tx,
					spaceId,
					userId: user.id
				})

				if (versionNextErr) throw new Error('unauthorized')

				// #2. Get last mutation Id for client
				let { data: lastMutationId } = await utilApiLastMutationIdGet({ clientID, tx })

				// #3. Iterate mutations, increase mutation Id on each iteration
				const { data: nextMutationId } = await utilApiMutations({
					lastMutationId,
					mutations,
					spaceId,
					tx
				})

				// #4. Save mutation Id to Client
				await utilApiLastMutationIdSave({ clientID, nextMutationId, tx })

				// #5. Save new version to Space
				await utilApiVersionSave({ tx, spaceId, version: versionNext })

				return true
			},
			// FIX: interactive transactions error still occurs with long wait times
			{
				maxWait: 20000,
				timeout: 60000
			}
		)

		// #6. Poke client(s) to send a pull.
		await utilApiPokeSend()

		res.json({ done: true })
	} catch (err) {
		console.error(err)

		res.status(500).send(err.toString())
	} finally {
		await prisma.$disconnect()
	}
}

export default PagesApiReplicachePush

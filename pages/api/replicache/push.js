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

	await prisma.$transaction(async tx => {
		// #1. Get next `version` for space
		const { data: versionNext } = await utilApiVersionGetNext({
			tx,
			spaceId,
			userId: user.id
		})

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
	})

	// #6. Poke client(s) to send a pull.
	// await utilApiPokeSend()

	res.json({ done: true })
}

export default PagesApiReplicachePush

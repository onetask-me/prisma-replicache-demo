// Packages
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Replicache } from 'replicache'
// Mutations
import mutationTodoCreate from 'mutations/todo/create'
import mutationTodoDelete from 'mutations/todo/delete'
import mutationTodoGet from 'mutations/todo/get'
import mutationTodoUpdate from 'mutations/todo/update'

const HooksReplicache = () => {
	const { user } = useUser()

	const [rep, setRep] = useState(null)
	const [diff, setDiff] = useState(null)

	const spaceId = 'MyUniqueSpace'

	useEffect(() => {
		if (user?.id) {
			const r = new Replicache({
				name: `${user.id}/${spaceId}`,
				licenseKey: process.env.NEXT_PUBLIC_REPLICACHE,
				pushURL: `/api/replicache/push?spaceId=${spaceId}`,
				pullURL: `/api/replicache/pull?spaceId=${spaceId}`,
				mutators: {
					create: mutationTodoCreate,
					delete: mutationTodoDelete,
					get: mutationTodoGet,
					update: mutationTodoUpdate
				}
			})

			setRep(r)

			return () => void r.close()
		}
	}, [user?.id, spaceId])

	useEffect(() => {
		if (rep)
			rep.experimentalWatch(x => setDiff(x), { prefix: 'todo/', initialValuesInFirstDiff: true })
	}, [rep])

	console.log(`diff`, diff)

	return { data: rep }
}

export default HooksReplicache

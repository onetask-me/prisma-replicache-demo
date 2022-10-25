// Packages
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Replicache } from 'replicache'
// Replicache
import todoCreate from 'resolvers/todo/create'
import todoDelete from 'resolvers/todo/delete'
import todoGet from 'resolvers/todo/get'
import todoUpdate from 'resolvers/todo/update'

const HooksReplicache = () => {
	const { user } = useUser()

	const [rep, setRep] = useState(null)

	useEffect(() => {
		if (user?.id) {
			const r = new Replicache({
				name: user.id,
				licenseKey: process.env.NEXT_PUBLIC_REPLICACHE,
				pushURL: '/api/replicache/push',
				pullURL: '/api/replicache/pull',
				mutators: {
					create: todoCreate,
					delete: todoDelete,
					get: todoGet,
					update: todoUpdate
				}
			})

			setRep(r)

			return () => void r.close()
		}
	}, [user?.id])

	return { data: rep }
}

export default HooksReplicache

// Packages
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Replicache } from 'replicache'
// Replicache
import todoCreate from 'mutations/todo/create'
import todoDelete from 'mutations/todo/delete'
import todoGet from 'mutations/todo/get'
import todoUpdate from 'mutations/todo/update'

const HooksReplicache = () => {
	const { user } = useUser()

	const [rep, setRep] = useState(null)

	const spaceId = 'MyUniqueSpace'

	useEffect(() => {
		if (user?.id) {
			const r = new Replicache({
				name: `${user.id}/${spaceId}`,
				licenseKey: process.env.NEXT_PUBLIC_REPLICACHE,
				pushURL: `/api/replicache/push?spaceId=${spaceId}`,
				pullURL: `/api/replicache/pull?spaceId=${spaceId}`,
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
	}, [user?.id, spaceId])

	return { data: rep }
}

export default HooksReplicache

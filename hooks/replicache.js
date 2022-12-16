// Packages
import { useState, useEffect } from 'react'
import { getCookie, deleteCookie } from 'cookies-next'
import { Replicache } from 'replicache'
import { useRouter } from 'next/router'
// Mutations
import mutationTodoCreate from 'mutations/todo/create'
import mutationTodoDelete from 'mutations/todo/delete'
import mutationTodoGet from 'mutations/todo/get'
import mutationTodoUpdate from 'mutations/todo/update'

const HooksReplicache = ({ setSpaceId, setUserId, spaceId, userId }) => {
	const router = useRouter()

	const [rep, setRep] = useState(null)

	useEffect(() => {
		setSpaceId(window.localStorage.getItem('spaceId1'))

		setUserId(getCookie('userId'))
	}, [])

	useEffect(() => {
		if (userId && spaceId) {
			const r = new Replicache({
				name: `${userId}/${spaceId}`,
				licenseKey: process.env.NEXT_PUBLIC_REPLICACHE,
				pushURL: `/api/replicache/push?spaceId=${spaceId}`,
				pullURL: `/api/replicache/pull?spaceId=${spaceId}`,
				mutators: {
					create: (tx, args) => mutationTodoCreate(tx, args, spaceId),
					delete: (tx, args) => mutationTodoDelete(tx, args, spaceId),
					get: (tx, args) => mutationTodoGet(tx, args, spaceId),
					update: (tx, args) => mutationTodoUpdate(tx, args, spaceId)
				}
			})

			// This gets called when the push/pull API returns a `401`.
			r.getAuth = () => {
				deleteCookie('userId')
				setUserId(null)

				window.localStorage.removeItem('spaceId1')
				window.localStorage.removeItem('spaceId2')
				setSpaceId(null)

				router.push('/login')
			}

			setRep(r)

			return () => void r.close()
		}
	}, [spaceId, userId])

	return { data: rep }
}

export default HooksReplicache

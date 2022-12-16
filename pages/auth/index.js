// Packages
import { useEffect } from 'react'
import { useRouter } from 'next/router'
// Utilities
import utilGenerateId from 'utils/generateId'

const PagesAuth = () => {
	const router = useRouter()

	useEffect(() => {
		;(async () => {
			const spaceId = utilGenerateId()
			window.localStorage.setItem('spaceId', spaceId)

			// In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
			const response = await fetch(`/api/auth?spaceId=${spaceId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			})

			const { data } = await response.json()

			if (data) router.push('/')
		})()
	}, [])

	return <></>
}

export default PagesAuth

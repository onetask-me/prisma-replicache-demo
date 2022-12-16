// Packages
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
// Utilities
import utilGenerateId from 'utils/generateId'

const PagesLogin = () => {
	const router = useRouter()

	useEffect(() => {
		;(async () => {
			if (!window.localStorage.getItem('spaceId') || !getCookie('userId')) {
				const spaceId1 = utilGenerateId()
				const spaceId2 = utilGenerateId()

				window.localStorage.setItem('spaceId', spaceId1)

				// In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
				await fetch(`/api/auth?spaceId=${spaceId}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify({ spaceId1, spaceId2 })
				})
			}

			router.push('/')
		})()
	}, [])

	return <></>
}

export default PagesLogin

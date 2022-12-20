// Packages
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
// Utilities
import utilGenerateId from 'utils/generateId'

const PagesLogin = () => {
	const router = useRouter()

	useEffect(() => {
		if (
			!window.localStorage.getItem('spaceId1') ||
			!window.localStorage.getItem('spaceId2') ||
			!getCookie('userId')
		) {
			// Spaces are a user’s different areas of concern. For example, a user might have a space for a personal to-do list and a space for a shared to-do list
			const spaceId1 = utilGenerateId()
			window.localStorage.setItem('spaceId1', spaceId1)

			const spaceId2 = utilGenerateId()
			window.localStorage.setItem('spaceId2', spaceId2)

			// In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
			;(async () => {
				await fetch(`/api/auth`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify({ spaceId1, spaceId2 })
				})
			})()
		}

		router.push('/')
	}, [])

	return <></>
}

export default PagesLogin

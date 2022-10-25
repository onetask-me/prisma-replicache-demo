// Packages
import { useEffect } from 'react'
import { useAuth, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/router'

const PagesAuthSuccess = () => {
	const router = useRouter()

	const { isSignedIn } = useAuth()

	useEffect(() => {
		;(async () => {
			if (isSignedIn) {
				const response = await fetch('/api/auth', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					}
				})

				const { data, error } = await response.json()

				if (data) router.push('/replicache')
			}
		})()
	}, [isSignedIn])

	return <></>
}

export default PagesAuthSuccess

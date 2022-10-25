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
				const { data: user } = await fetch('/api/auth')

				if (user) router.push('/replicache')
			}
		})()
	}, [isSignedIn])

	return <></>
}

export default PagesAuthSuccess

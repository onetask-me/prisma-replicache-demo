// Packages
import { useEffect } from 'react'
import { useAuth, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/router'

const Pages = () => {
	const router = useRouter()

	const { isSignedIn } = useAuth()

	useEffect(() => {
		if (isSignedIn) router.push('/replicache')
	}, [isSignedIn])

	return <SignInButton redirectUrl='/auth/success' />
}

export default Pages

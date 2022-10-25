// Packages
import { useEffect } from 'react'
import { useAuth, SignUpButton } from '@clerk/nextjs'
import { useRouter } from 'next/router'

const Pages = () => {
	const router = useRouter()

	const { isSignedIn } = useAuth()

	useEffect(() => {
		if (isSignedIn) router.push('/replicache')
	}, [isSignedIn])

	return <SignUpButton redirectUrl='/auth/success' />
}

export default Pages

// Packages
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/router'

const HooksSignInRequired = () => {
	const router = useRouter()

	const { isSignedIn } = useAuth()

	useEffect(() => {
		if (!isSignedIn) router.push('/')
	}, [isSignedIn])
}

export default HooksSignInRequired

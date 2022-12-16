// Packages
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'

const HooksSignInRequired = () => {
	const router = useRouter()

	useEffect(() => {
		// In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
		if (!getCookie('userId')) router.push('/auth')
	}, [])
}

export default HooksSignInRequired

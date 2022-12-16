// Packages
import { getCookie } from 'cookies-next'

const UtilsAuth = async (req, _) => {
	// In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
	const user = getCookie('user', { req, res })

	if (!user) return { error: 'user_not_found' }

	return { data: user }
}

export default UtilsAuth

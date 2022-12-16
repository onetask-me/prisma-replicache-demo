// Packages
import { getCookie } from 'cookies-next'

const UtilsAuth = async (req, res) => {
	// In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
	const userId = getCookie('userId', { req, res })

	if (!userId) return { error: 'user_not_found' }

	return { data: userId }
}

export default UtilsAuth

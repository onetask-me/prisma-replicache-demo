// Packages
import { withAuth, users } from '@clerk/nextjs/api'

const ApisUtilsAuthVerify = withAuth(async (req, _) => {
	const { sessionId, userId } = req.auth

	if (!sessionId || !userId) return { error: 'not_signed_in' }

	const clerkUser = await users.getUser(userId)

	if (!clerkUser) return { error: 'user_not_found' }

	return { data: clerkUser }
})

export default ApisUtilsAuthVerify

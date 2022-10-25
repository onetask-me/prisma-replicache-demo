// Packages
import { withAuth, users } from '@clerk/nextjs/api'
// Utilities
import prisma from 'utils/prisma'

const PagesApiLogin = withAuth(async (req, _) => {
	const { sessionId, userId } = req.auth

	if (!sessionId || !userId) return { error: 'not_signed_in' }

	const clerkUser = await users.getUser(userId)

	if (!clerkUser) return { error: 'user_not_found' }

	const email = clerkUser?.emailAddresses?.find(
		x => x.id === clerkUser?.primaryEmailAddressId
	)?.emailAddress

	await prisma.user.upsert({
		where: { userId: clerkUser.id },
		create: { email },
		update: { email }
	})

	return { data: clerkUser }
})

export default PagesApiLogin

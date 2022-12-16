// Packages
import { setCookie } from 'cookies-next'
// Utilities
import prisma from 'utils/prisma'
import utilGenerateId from 'utils/generateId'

const PagesApiAuth = async (req, res) => {
	const { spaceId1, spaceId2 } = req.body

	const userId = utilGenerateId()

	const user = await prisma.user.create({
		data: {
			// --- PUBLIC ID ---
			userId,
			// --- RELATIONS ---
			Spaces: { createMany: [{ spaceId: spaceId1 }, { spaceId: spaceId2 }] }
		}
	})

	// In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
	setCookie('userId', user?.userId, { req, res, maxAge: 60 * 6 * 24 })

	res.json({ data: true })
}

export default PagesApiAuth

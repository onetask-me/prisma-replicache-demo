// Packages
import { PrismaClient } from '@prisma/client'

/** @type {PrismaClient} */

let prisma

// Deployment
if (process.env.ENV === 'prd' || process.env.ENV === 'stg') prisma = new PrismaClient()
// Local development: prevent multiple instances
else {
	if (!global.prisma) global.prisma = new PrismaClient()

	prisma = global.prisma
}

export default prisma

const nextConfig = {
	// env variables that don’t begin with `NEXT_PUBLIC_` need to be assigned here
	env: {
		// Get your keys at clerk.dev
		CLERK_API_KEY: process.env.CLERK_API_KEY,
		CLERK_JWT_KEY: process.env.CLERK_JWT_KEY,
		// `dev`, `stg`, or `prd`
		ENV: process.env.ENV,
		// Get your keys at pusher.com
		PUSHER_REPLICACHE: process.env.PUSHER_REPLICACHE
	},
	reactStrictMode: false,
	webpack: config => config
}

// Export
module.exports = nextConfig

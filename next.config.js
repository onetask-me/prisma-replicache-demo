const nextConfig = {
	// env variables that don’t begin with `NEXT_PUBLIC_` need to be assigned here
	env: {
		CLERK_API_KEY: process.env.CLERK_API_KEY,
		CLERK_JWT_KEY: process.env.CLERK_JWT_KEY,
		ENV: process.env.ENV
	},
	reactStrictMode: false,
	webpack: config => config
}

// Export
module.exports = nextConfig

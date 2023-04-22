/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	env: {
		JWT_SECRET: 'dev',
		DATABASE_URL: 'file:./dev.db',
	},
};

module.exports = nextConfig;

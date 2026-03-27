import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: ['./src/lib/server/schema.ts', './src/lib/server/auth-schema.ts'],
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
});

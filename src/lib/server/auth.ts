import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { dev } from '$app/environment'

import prismaClient from './database'
import type { User } from '@prisma/client'

export const lucia = new Lucia(
	new PrismaAdapter(prismaClient.session, prismaClient.user),
	{
		sessionCookie: {
			attributes: {
				secure: !dev,
			},
		},
		getUserAttributes: (user) => {
			return {
				userId: user.id,
				username: user.username,
			}
		},
	}
)

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: User
	}
}

export type Auth = typeof lucia

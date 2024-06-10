// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import('$lib/server/auth').Auth
	type UserAttributes = {
		username: string
	}
}

declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | null
			session: import('lucia').Session | null
		}
	}
}

export {}

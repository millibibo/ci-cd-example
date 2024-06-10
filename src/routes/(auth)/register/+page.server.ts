import { lucia } from '$lib/server/auth'
import { authSchema } from '$lib/zod/schema'
import { hash } from '@node-rs/argon2'
import { fail, redirect } from '@sveltejs/kit'
import { generateIdFromEntropySize } from 'lucia'
import { zod } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from './$types'
import db from '$lib/server/database'

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/')

	const form = await superValidate(null, zod(authSchema))
	return { form }
}

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const data = await request.formData()
		const form = await superValidate(data, zod(authSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const userId = generateIdFromEntropySize(10)
		const passwordHash = await hash(form.data.password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		})

		// TODO: check if username is already used
		await db.user.create({
			data: {
				id: userId,
				username: form.data.username,
				hashed_password: passwordHash,
			},
		})

		const session = await lucia.createSession(userId, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		})

		redirect(302, '/')
	},
}

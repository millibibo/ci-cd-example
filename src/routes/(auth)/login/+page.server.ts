import { fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { verify } from '@node-rs/argon2'
import { lucia } from '$lib/server/auth'
import { authSchema } from '$lib/zod/schema'
import type { Actions, PageServerLoad } from './$types'
import db from '$lib/server/database'

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/')

	const form = await superValidate(zod(authSchema))
	return { form }
}

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const data = await request.formData()
		const form = await superValidate(data, zod(authSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const existingUser = await db.user.findUnique({
			where: { username: form.data.username.toLowerCase() },
		})
		if (!existingUser) {
			return fail(400, {
				message: 'Incorrect username or password',
			})
		}

		const validPassword = await verify(
			existingUser.hashed_password,
			form.data.password,
			{
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			}
		)
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password',
			})
		}

		const session = await lucia.createSession(existingUser.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		})

		redirect(302, '/')
	},
}

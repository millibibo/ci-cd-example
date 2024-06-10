import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { marked } from 'marked'

import * as posts from '$lib/services/posts'
import { postSchema } from '$lib/zod/schema'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const post = await posts.getPost(params.slug)

	if (!post) {
		throw error(400, 'Could not find post')
	}

	const form = await superValidate(post, zod(postSchema))
	return { form }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(postSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const data = {
				...form.data,
				html: await marked.parse(form.data.markdown),
			}
			await posts.updatePost(form.data.slug, data)
		} catch (error) {
			return fail(400, { form })
		}

		throw redirect(300, '/dashboard')
	},
}

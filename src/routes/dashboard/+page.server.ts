import { fail, redirect } from '@sveltejs/kit'
import * as posts from '$lib/services/posts'
import type { PageServerLoad } from './$types.js'

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login')
	return { posts: await posts.getPosts() }
}

export const actions = {
	delete: async ({ url }: { url: URL }) => {
		const slug = String(url.searchParams.get('slug'))

		try {
			await posts.deletePost(slug)
		} catch (error) {
			return fail(400)
		}
	},
}

<script lang="ts">
	import { page } from '$app/stores'
	import Heading from './heading.svelte'
	import Footer from './footer.svelte'
	import '../app.postcss'

	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<svelte:head>
	<title>Blog</title>
	<link rel="icon" href="https://fav.farm/🔥" />
</svelte:head>

<Heading user={data.user} />
<slot />
<Footer />

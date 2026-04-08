<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Authenticated Session</h1>
<p>Your user ID is {data.session.userId}.</p>
<form method="post" action="?/signOut" use:enhance>
	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Sign out</button
	>
</form>

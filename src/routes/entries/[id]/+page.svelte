<script lang="ts">
	import { Entry } from '$lib/components/_Entry';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.id);
</script>

<Entry id={data.id} />
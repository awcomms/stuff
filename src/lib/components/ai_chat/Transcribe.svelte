<script lang="ts">
	import Record from '../Record.svelte';
	import { createEventDispatcher } from 'svelte';
	import { transcribe } from '$lib/util/transcribe';
	import { key } from './store';
	// import { webm2flac } from '$lib/util/audio/webm2flac';

	const dispatch = createEventDispatcher();
</script>

<Record
	buttonProps={{
		size: 'field'
	}}
	on:pause={async (e) => {
		dispatch(
			'text',
			await transcribe(
				e.detail,
				$key
			)
		);
	}}
/>

<script lang="ts">
	import { Button, Checkbox, CopyButton } from 'carbon-components-svelte';
	export let item: import('$lib/types').TodoItem,
		text = '';

	const copy = async (s: string) => {
		// let all = await navigator.clipboard.read()
		// all.push(new ClipboardItem({string: s}))
		await navigator.clipboard.writeText(s);
		// todo notify with tooltip
	};

	const focus = (s: string) => {};
</script>

<div class:open={item.open}>
	<div class="line">
		<div class="checkbox">
			<Checkbox indeterminate={/*!item.recommended*/false} bind:checked={item.done} />
		</div>
		<Button size="small" kind="ghost" on:click={() => (item.open = !item.open)}>{text}</Button>
		<CopyButton {text} />
	</div>
	{#if item.open && item.suggestions}
		<div class="suggestions">
			{#each Object.keys(item.suggestions) as text}
				<svelte:self {text} item={item.suggestions[text]} />
			{/each}
		</div>
	{/if}
</div>

<style lang="sass">
	.checkbox
		max-width: fit-content
	.line
		display: flex
		align-items: center
		flex-direction: row
	.suggestions
		margin-left: 1rem
</style>

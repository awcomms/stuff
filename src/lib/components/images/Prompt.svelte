<script lang="ts">
	export let value = '';
	export let words: string = '';

	import {copy_element_text} from '$lib/util/copy_element_text'

	let guide_open = false;

	import {
		Link,
		TextArea,
		Button,
		ButtonSet
	} from 'carbon-components-svelte';
	import Todo from './Todo.svelte';
</script>

<ButtonSet
	><Button
		size="small"
		on:click={() => (guide_open = !guide_open)}
		>Open Guide</Button
	></ButtonSet
>
{#if guide_open}
	<Link
		href="https://dallery.gallery/wp-content/uploads/2022/07/The-DALL%C2%B7E-2-prompt-book-v1.02.pdf"
		>Guide book</Link
	>
	<div class="todo">
		<Todo bind:words />
	</div>
{/if}

<p>{words}</p>

<TextArea labelText="Prompt" bind:value />

{#if value || words}
	<p use:copy_element_text>{value}. {words}</p>
{/if}

<style lang="sass">
    .todo
        overflow-x: scroll
        max-height: 370px
</style>

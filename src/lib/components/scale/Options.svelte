<script lang="ts">
	export let options: import('$lib/util/image/scale').Options,
		width = 0,
		height = 0,
		ratio = 1;

	import {
		TextInput,
		Toggle,
		Select,
		SelectItem
	} from 'carbon-components-svelte';
	import Span from './Span.svelte';

	let filter_types = [
			'Nearest',
			'Triangle',
			'CatmullRom',
			'Gaussian',
			'Lanczos3'
		],
		ratio_lock = true;

	const change_width = (
		e: CustomEvent
	) => {
		console.log(e.detail);
		if (ratio_lock) {
			// console.log('-w');
			ratio_width(e.detail);
		}
	};

	const change_height = (
		e: CustomEvent
	) => {
		console.log(e.detail);
		if (ratio_lock) {
			// console.log('-h');
			ratio_height(e.detail);
		}
	};

	const ratio_width = (
		h: number
	) => {
		console.log('--w');
		options.width = h * ratio;
	};

	const ratio_height = (
		w: number
	) => {
		console.log('--h');
		console.log(ratio, w, w / ratio);
		options.height = w / ratio;
	};

	const ratio_if_lock = (
		side: boolean
	) => {
		if (!ratio_lock) return;
		ratio_base(side);
	};

	const apply_ratio = (
		side: boolean
	) => {
		ratio_base(side);
	};

	const ratio_base = (
		side: boolean
	) => {
		side
			? ratio_width(options.height)
			: ratio_height(options.width);
	};

	const formats = [
		{ value: 'avif', text: 'avif' },
		{
			value: 'jpg',
			text: 'jpg (same as "jpeg")'
		},
		{
			value: 'jpeg',
			text: 'jpeg (same as "jpg")'
		},
		{ value: 'png', text: 'png' },
		{ value: 'gif', text: 'gif' },
		{ value: 'webp', text: 'webp' },
		{
			value: 'tif',
			text: 'tif (same as "tiff")'
		},
		{
			value: 'tiff',
			text: 'tiff (same as "tif")'
		},
		{ value: 'tga', text: 'tga' },
		{ value: 'dds', text: 'dds' },
		{ value: 'bmp', text: 'bmp' },
		{ value: 'ico', text: 'ico' },
		{ value: 'hdr', text: 'hdr' },
		{ value: 'exr', text: 'exr' },
		{
			value: 'pbm',
			text: 'pbm (same as "pbm" or "pam" or "ppm" or "pgm")'
		},
		{
			value: 'pam',
			text: 'pam (same as "pbm" or "ppm" or "pgm")'
		},
		{
			value: 'ppm',
			text: 'ppm (same as "pbm" or "pam" or "pgm")'
		},
		{
			value: 'pgm',
			text: 'pgm (same as "pbm" or "pam" or "ppm")'
		},
		{
			value: 'ff',
			text: 'ff (same as "farbfeld")'
		},
		{
			value: 'farbfeld',
			text: 'farbfeld (same as "ff")'
		}
	];
</script>

<!-- <p>{size} bytes</p> -->
<Toggle
	bind:toggled={ratio_lock}
	labelText="Keep ratio while editing dimensions"
/>
<Toggle
	bind:toggled={options.exact}
	labelText="Scale to exact dimensions, ignoring aspect ratio"
/>

<!-- <Select
	labelText="extension"
	helperText="Change this to receive the scaled image as a different format"
	size="sm"
	on:input
	bind:selected={options.extension}
>
	{#each formats as format}
		<SelectItem {...format} />
	{/each}
</Select> -->
<!-- <TextInput
	helperText="Change this to receive the scaled image as a different format"
	on:input
	size="sm"
	bind:value={options.extension}
	labelText="extension"
/> -->
<Span
	on:input
	on:span_change={change_height}
	bind:value={options.width}
	label="width"
	base_value={width}
/>
<Span
	on:input
	on:span_change={change_width}
	bind:value={options.height}
	label="height"
	base_value={height}
/>
<Select
	labelText="Sampling Filter"
	on:input
	bind:selected={options.filter_type}
>
	{#each filter_types as ft}
		<SelectItem
			value={ft}
			text={ft}
		/>
	{/each}
</Select>

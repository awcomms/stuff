<script lang="ts">
	import {
		download_blob,
		average,
		create_blob
	} from '$lib/util';
	import type { Entry } from './types';
	import type { Options as _Options } from '$lib/util/image/scale';
	import FileImage from './Image.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import {
		Row,
		Column,
		Button,
		InlineLoading,
		Toggle,
		Modal
	} from 'carbon-components-svelte';
	import JSZip from 'jszip';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Send from 'carbon-icons-svelte/lib/Send.svelte';
	import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import Maximize from 'carbon-icons-svelte/lib/Maximize.svelte';
	import {
		parse_res,
		scale
	} from '$lib/util/image/scale';
	import Options from './Options.svelte';
	import { onMount } from 'svelte';
	import ScaleSettings from './ScaleSettings.svelte';
	import {
		include_date,
		include_factor
	} from './store';

	$: console.log(scaling);

	onMount(() => {
		height = `${
			(window.innerHeight * 79) / 100
		}px`;
	});

	$: if (
		typeof window !== 'undefined'
	)
		height = `${
			(window.innerHeight * 79) / 100
		}px`;

	let entries: Entry[] = [],
		all_maximized: boolean,
		all_minimized: boolean,
		next_id = 0,
		scaling = false,
		settings_open = false,
		options: _Options = {
			width: 1,
			height: 1,
			exact: true,
			extension: '',
			filter_type: 'Nearest',
			bytes: new Uint8Array()
		},
		height = '670px',
		edit_for_all = false;

	const scale_all = async () => {
		let all = entries.map((e) => {
			let _e = e;
			_e.options = options;
			_e.options.bytes =
				e.options.bytes;
			return _e;
		});
		await act(all);
	};

	const check_all_options_open =
		() => {
			all_maximized = !entries.find(
				(e) => !e.options_open
			);
			all_minimized = !entries.find(
				(e) => e.options_open
			);
		};

	const get_res = (
		e: Entry
	): [Blob, string] => {
		if (!e.result) throw null;
		let [bytes, extension, type] =
			parse_res(e.result);
		return [
			create_blob(bytes, type),
			extension ||
				e.options.extension
		];
	};

	const filename = (
		e: Entry,
		date: string,
		extension: string
	): string => {
		let res = ''
			.concat(e.file.name)
			.concat('- rescaled');
		if ($include_factor)
			res = res
				.concat(' - widthx')
				.concat(
					String(
						e.options.width / e.width
					)
				)
				.concat(',heightx')
				.concat(
					String(
						e.options.height /
							e.height
					)
				);
		if ($include_date)
			res = res
				.concat(' - ')
				.concat(date);
		res = res
			.concat('.')
			.concat(extension);
		return res;
	};

	const act = async (
		entries: Entry[]
	) => {
		scaling = true;
		if (!entries.length) return;
		let date =
			new Date().toString();

		let to_download: Entry[] = [];

		for (let e of entries) {
			await scale(e.options)
				.then((r) => {
					e.result = r;
					to_download.push(e);
				})
				.catch((error) => {
					e.error = {
						error,
						date: new Date()
					};
					console.error(error);
				});
		}
		to_download = to_download.filter(
			(e) => e.result
		);

		// let to_download = entries
		// 	.map((e) => {
		// 		return await scale(e.options)
		// 			.then((r) => {
		// 				e.result = r;
		// 				return e;
		// 			})
		// 			.catch((error) => {
		// 				e.error = { error, date: new Date() };
		// 				console.error(error);
		// 			});
		// 	})
		// 	.filter((e) => e && e.result);
		let zip = new JSZip();
		if (to_download.length > 1) {
			to_download.forEach((e) => {
				let [b, extension] =
					get_res(e);
				zip.file(
					filename(
						e,
						date,
						extension
					),
					b
				);
			});
			zip
				.generateAsync({
					type: 'blob'
				})
				.then((blob) => {
					download_blob(
						blob,
						`${to_download.length} images rescaled.zip`
						// `resize - ${date}.zip`
					);
				});
		} else {
			let e = to_download[0];
			if (!e) return;
			let [blob, extension] =
				get_res(e);
			download_blob(
				blob,
				filename(e, date, extension)
			);
		}
		scaling = false;
	};

	const del = (id: number) => {
		console.log(id);
		entries = entries.filter(
			(e) => e.id !== id
		);
	};

	const change = ({
		detail: files
	}: {
		detail: FileList;
	}) => {
		console.log(files.length);
		for (
			let i = 0;
			i < files.length;
			i++
		) {
			// for (let i = files.length -1 ; i >= 0; i--) {
			const file = files[i];
			let ext_dot_index =
				file.name.lastIndexOf('.');
			entries = [
				...entries,
				{
					id: next_id,
					name: file.name.substring(
						0,
						ext_dot_index
					),
					options_open: true,
					size: file.size,
					ratio: 1,
					width: 1,
					height: 1,
					file,
					options: {
						exact: false,
						width: 1,
						height: 1,
						extension:
							file.name.substring(
								ext_dot_index + 1
							),
						bytes: new Uint8Array(),
						filter_type: 'Nearest'
					}
				}
			];
			++next_id;
		}
		options.width = average(
			entries.map((e) => e.width)
		);
		options.height = average(
			entries.map((e) => e.height)
		);
		options.extension =
			entries[0].options.extension;
	};
</script>

<Modal
	modalHeading="Settings"
	passiveModal
	hasForm
	bind:open={settings_open}
>
	<ScaleSettings />
</Modal>

<Row>
	<Column>
		<div class="all">
			<h3>A tool to scale images</h3>
			<FileUpload
				label="Add images"
				on:change={change}
				button={{ icon: Add }}
				multiple
			/>
			{#if entries.length}
				<Button
					on:click={() =>
						(settings_open = true)}
					icon={Settings}
					>Settings</Button
				>
			{/if}
			{#if entries.length > 1}
				<Button
					on:click={() =>
						(edit_for_all =
							!edit_for_all)}
					>{edit_for_all
						? 'Hide options for all'
						: 'Edit options for all'}</Button
				>
			{/if}

			{#if edit_for_all && entries.length > 1}
				<hr style="width: 100%" />
				<div class="for_all">
					<Options
						bind:options
						width={options.width}
						height={options.height}
						ratio={options.width /
							options.height}
					/>
					<Button
						on:click={scale_all}
						>Scale all with these
						options</Button
					>
				</div>
				<hr style="width: 100%" />
			{/if}

			{#if entries.length > 1}
				<Button
					disabled={all_minimized}
					icon={Minimize}
					iconDescription="Minimize all"
					on:click={() => {
						entries = entries.map(
							(e) => {
								e.options_open = false;
								return e;
							}
						);
					}}
				/>
				<Button
					disabled={all_maximized}
					icon={Maximize}
					iconDescription="Maximize all"
					on:click={() => {
						entries = entries.map(
							(e) => {
								e.options_open = true;
								return e;
							}
						);
					}}
				/>
			{/if}

			<div class="entries-wrapper">
				<div class="entries">
					{#each entries as entry}
						<Row>
							<Column>
								<FileImage
									on:options_open_change={check_all_options_open}
									on:delete={({
										detail: id
									}) => del(id)}
									bind:entry
								/>
							</Column>
						</Row>
					{/each}
				</div>
			</div>

			{#if entries.length}
				<Button
					disabled={scaling}
					icon={scaling
						? InlineLoading
						: Send}
					on:click={() =>
						act(entries)}
				>
					{entries.length < 1
						? 'Scale'
						: 'Scale all'}</Button
				>
			{/if}
		</div>
	</Column>
</Row>

<style lang="sass">
	.for_all
		// padding-bottom: 3.7rem
		display: flex
		flex-direction: column
		row-gap: 2rem
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
		// max-height: 70vh
		// height: 100%
	.entries-wrapper
		flex-grow: 1
	.entries
		display: flex
		flex-direction: column
		row-gap: 2rem
</style>

<script lang="ts" context="module">
	export async function load({ fetch, page }) {
		const dirs = await fetch(`/api/dirs.json?dir=${page.params.dir}`);
		const pipeline = await fetch(`/api/pipeline.json?dir=${page.params.dir}`);
		return {
			props: {
				dirs: await dirs.json(),
				pipeline: await pipeline.json()
			}
		};
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import Graph from '$lib/components/Graph.svelte';
	import type { LogStatus, Pipeline } from '$lib/types/pipeline';
	import { onMount } from 'svelte';

	export let dirs: string[];
	export let pipeline: Pipeline;

	const logHistory: Map<
		string,
		[modificationDurations: number[], lastModified: number]
	> = new Map();
	const LAST_X_DURATIONS = 5;
	const TRESHOLD = 2;

	// Periodically fetch new pipeline status
	onMount(async () => {
		while (isPipeline) {
			pipeline = await (await fetch(`/api/pipeline.json?dir=${$page.params.dir}`)).json();

			// Save the modification dates for visualization purposes
			// TODO: This could be a store?
			pipeline.logs.forEach((log) => {
				if (!logHistory.has(log.name)) {
					logHistory.set(log.name, [[], log.modified]);
				} else {
					const [modificationDurations, lastModified] = logHistory.get(log.name);
					if (lastModified != log.modified) {
						const modificationDuration = log.modified - lastModified;
						console.log(modificationDuration);
						logHistory.set(log.name, [
							[...modificationDurations.slice(LAST_X_DURATIONS - 1), modificationDuration],
							log.modified
						]);
					}
				}
			});

			await new Promise((res) => setTimeout(res, 1000));
		}
	});

	const isLogOk = (log: LogStatus): boolean => {
		if (!logHistory.get(log.name)) return false;
		const [modificationDurations, lastModified] = logHistory.get(log.name);
		const average =
			modificationDurations.reduce((acc, c) => (acc += c), 0) /
			Math.max(modificationDurations.length, 1);
		const unchangedDuration = Math.floor(new Date().valueOf() / 1000) - log.modified;
		return unchangedDuration <= TRESHOLD * average;
	};

	$: previousDir = $page.params.dir?.split('/').slice(0, -1).join('/') || '/';
	$: isPipeline = pipeline.logs.length > 0 || pipeline.pids.length > 0;
	$: displayedDirs = dirs.map((dir) => {
		return { path: dir, name: dir.split('/').reverse()[1] + '/' };
	});

	$: nodes = pipeline.pids.map((pid) => {
		const [id, label] = pid.name.match(/(\d+)-(.+).pid/).slice(1);
		return {
			data: {
				id,
				label,
				color: pid.alive ? '#33cc33' : '#ff0000'
			}
		};
	});
	$: edges = pipeline.logs.map((log) => {
		const [source, target, label] = log.name.match(/l_(\d+)-(\d+)-(.+)\..+/).slice(1);
		return {
			data: {
				id: `${source}_${label}`,
				source,
				target,
				label,
				color: isLogOk(log) ? '#33cc33' : '#ff0000'
			}
		};
	});
</script>

<main class="container">
	<div class="dirs">
		<h2>Directory {$page.params.dir}</h2>
		<ul>
			{#each displayedDirs as dir}
				<li>
					<a href={`/select/${dir.path}`}>
						{dir.name}
					</a>
				</li>
			{/each}
			<li>
				<a href={`/select/${previousDir}`}> ../ </a>
			</li>
		</ul>
		Pipeline {isPipeline ? '' : 'not '} detected!
	</div>
	<div class="pipeline">
		<Graph {edges} {nodes} />
	</div>
</main>

<style>
	.container {
		display: grid;
		grid-template-columns: 33% 66%;
	}

	.dirs {
		grid-column: 1 / 2;
	}

	.pipeline {
		grid-column: 2 / 2;
	}
</style>

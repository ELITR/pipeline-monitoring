<script lang="ts" context="module">
	export async function load({ fetch, page }) {
		const dirs = await fetch(`/dirs.json?dir=${page.params.dir}`);
		const pipeline = await fetch(`/pipeline.json?dir=${page.params.dir}`);
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
	import type { Pipeline } from '$lib/types/pipeline';

	export let dirs: string[];
	export let pipeline: Pipeline;

	$: previousDir = $page.params.dir?.split('/').slice(0, -1).join('/') || '/';
	$: isPipeline = pipeline.logs.length > 0 || pipeline.pids.length > 0;
	$: displayedDirs = dirs.map((dir) => {
		return { path: dir, name: dir.split('/').reverse()[1] + '/' };
	});

	$: nodes = pipeline.pids.map((pid) => {
		console.log(pid);
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
				source,
				target,
				label
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

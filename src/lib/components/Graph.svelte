<script lang="ts">
	import cytoscape from 'cytoscape';
	import dagre from 'cytoscape-dagre';
	import { afterUpdate } from 'svelte';

	cytoscape.use(dagre);

	let refElement = null;

	export let vertices;
	export let edges;

	// Cytoscape needs to know the size of the element it's being mounted to (so it can calculate the positions of the graph)
	afterUpdate(() => {
		cytoscape({
			container: refElement,
			elements: [...vertices, ...edges],
			layout: {
				name: 'dagre',
				nodeSep: 150
			},
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(label)',
						'text-valign': 'bottom'
					}
				},
				{
					selector: 'edge',
					style: {
						'target-arrow-shape': 'triangle',
						'curve-style': 'bezier',
						'arrow-scale': 2
					}
				}
			]
		});
	});
</script>

<div>
	<div class="graph" bind:this={refElement} />
</div>

<style>
	.graph {
		background-color: white;
		height: 90vh;
	}
</style>

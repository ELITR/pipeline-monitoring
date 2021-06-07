<script lang="ts">
	import cytoscape from 'cytoscape';
	import dagre from 'cytoscape-dagre';
	import { afterUpdate } from 'svelte';

	cytoscape.use(dagre);

	let refElement = null;

	export let nodes;
	export let edges;
	export let selectedEdge = '';

	// Cytoscape needs to know the size of the element it's being mounted to (so it can calculate the positions of the graph)
	afterUpdate(() => {
		try {
			const cy = cytoscape({
				container: refElement,
				elements: [...nodes, ...edges],
				layout: {
					name: 'dagre',
					nodeSep: 150
				},
				style: [
					{
						selector: 'node',
						style: {
							label: 'data(label)',
							'text-valign': 'bottom',
							'background-color': 'data(color)'
						}
					},
					{
						selector: 'edge',
						style: {
							'target-arrow-shape': 'triangle',
							'curve-style': 'bezier',
							'arrow-scale': 2,
							'line-color': 'data(color)',
							'target-arrow-color': 'data(color)'
						}
					}
				]
			});
			cy.on('click', 'edge', (event) => {
				selectedEdge = event.target.id();
			});
		} catch (e) {
			console.log(e);
		}
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

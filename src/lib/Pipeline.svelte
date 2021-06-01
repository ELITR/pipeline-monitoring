<div>
    <div class="graph" bind:this={refElement}></div>
    <label>
        <input type=radio bind:group={layoutName} value="cose">
        Cose
    </label>
    <label>
        <input type=radio bind:group={layoutName} value="breadthfirst">
        Breadthfirst
    </label>
    <label>
        <input type=checkbox bind:checked={showLabels}>
        Spread out the graph
    </label>
</div>

<script lang="ts">
    import cytoscape from "cytoscape";
    import { afterUpdate } from "svelte";

    let refElement = null

    export let vertices;
    export let edges;

    let layoutName = 'cose'
    let showLabels = false

    // Cytoscape needs to know the size of the element it's being mounted to (so it can calculate the positions of the graph)
    afterUpdate(() => {
        let cy = cytoscape({
            container: refElement,
            elements: [
                ...vertices,
                ...edges
            ],
            layout: {
                name: layoutName,
                directed: true,
                randomise: false,
                nodeDimensionsIncludeLabels: showLabels,
            },
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'arrow-scale': 2,
                    }
                }
            ]
        })

    })
</script>

<style>
    .graph {
        background-color: white;
        height: 800px;
    }
</style>
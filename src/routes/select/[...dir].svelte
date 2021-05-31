
<main class="container">
    <div class="dirs">

        <h2>Directory {$page.params.dir}</h2>
        <ul>
            {#each dirs as dir}
            <li>
                <a href={`/select/${dir}`}>
                    {dir}
                </a>
            </li>
            {/each}
            <li>
                <a href={`/select/${previousDir}`}>
                    ../
                </a>
            </li>
        </ul>
        Pipeline {isPipeline ? "" : "not "} detected!
    </div>
    <div class="pipeline" bind:this={refElement}></div>
</main>

<script lang="ts" context="module">
    export async function load({ fetch, page }) {
        const dirs = await fetch(`/dirs.json?dir=${page.params.dir}`)
        const files = await fetch(`/files.json?dir=${page.params.dir}`)
        return {
            props: {
                dirs: (await dirs.json()),
                files: (await files.json())
            }
        }
    }
</script>

<script lang="ts">
    import { page } from "$app/stores"
    import cytoscape from "cytoscape"
    import dagre from 'cytoscape-dagre'
    import { onMount } from "svelte";

    let refElement = null

    onMount(() => {

        cytoscape.use(dagre)
        var cy = cytoscape({
            container: refElement,
            elements: [ // list of graph elements to start with
                { // node a
                data: { id: 'a' }
                },
                { // node b
                data: { id: 'b' }
                },
                { // edge ab
                data: { id: 'ab', source: 'a', target: 'b' }
                }
            ],
        })

    })

    export let dirs;
    export let files;

    $: previousDir = $page.params.dir?.split("/").slice(0, -1).join("/") || "/"
    $: isPipeline = ["pid", "log", "err"].every(suffix => files.map(f => f.split(".").pop()).some(s => s == suffix))

</script>

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
        background-color: white;
    }
</style>
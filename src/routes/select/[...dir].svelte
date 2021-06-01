
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
                <a href={`/select/${previousDir}`}>
                    ../
                </a>
            </li>
        </ul>
        Pipeline {isPipeline ? "" : "not "} detected!
    </div>
    <div class="pipeline">
        <Pipeline {edges} {vertices}/>
    </div>
    
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
    import Pipeline from "$lib/Pipeline.svelte"

    export let dirs;
    export let files;

    $: previousDir = $page.params.dir?.split("/").slice(0, -1).join("/") || "/"
    $: isPipeline = ["pid", "log", "err"].every(suffix => files.map(f => f.split(".").pop()).some(s => s == suffix))
    $: displayedDirs = dirs.map(dir => { return { path: dir, name: dir.split("/").reverse()[1] + "/" } });

    console.log(dirs)

    $: vertices = isPipeline ? files.filter(file => file.endsWith(".err"))
            .map(node => {
                const [id, label] = node.match(/(\d+)-(.+).err/).slice(1)
                return {
                    data: {
                        id,
                        label
                    }
                }
            }) : []
    $: edges = isPipeline ? files.filter(file => file.startsWith("l_"))
            .map(edge => {
                const [source, target, label] = edge.match(/l_(\d+)-(\d+)-(.+)\..+/).slice(1)
                return {
                    data: {
                        source,
                        target,
                        label
                    }
                }
            }) : []

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
    }

</style>
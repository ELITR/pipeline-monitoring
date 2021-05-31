
<main>
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
    export let dirs;
    export let files;
    console.log(files)

    $: previousDir = $page.params.dir?.split("/").slice(0, -1).join("/") || "/"
    $: isPipeline = ["pid", "log", "err"].every(suffix => files.map(f => f.split(".").pop()).some(s => s == suffix))

</script>
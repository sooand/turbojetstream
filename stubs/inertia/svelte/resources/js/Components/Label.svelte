<script>
    export let value = ""
    let forKey = ""

    export { forKey as for }
</script>

<label class="block font-medium text-sm text-gray-700" for={forKey}>
    {#if value}
        <span>{ value }</span>
    {:else}
        <span><slot /></span>
    {/if}
</label>

<script>
    import { fade } from 'svelte/transition';

    export let on = false
</script>

{#if on}
    <div transition:fade class="text-sm text-gray-600 {$$restProps?.class ? $$restProps.class : ''}">
        <slot />
    </div>
{/if}

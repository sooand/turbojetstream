<script>
    import { onMount, onDestroy  } from 'svelte'

    export let align = "right"
    export let width = "48"
    export let contentClasses = [
        'py-1',
        'bg-white'
    ]

    let open = false;

    $: widthClass = {
        '48': 'w-48',
    }[width.toString()]
    $: alignmentClasses = align == 'left' ? 'origin-top-left left-0' : align == 'right' ? 'origin-top-right right-0' : 'origin-top'

    const closeOnEscape = (e) => {
        if (open && e.key === 'Escape') {
            open = false
        }
    }


    onMount(() => document.addEventListener('keydown', closeOnEscape))
    onDestroy (() => document.removeEventListener('keydown', closeOnEscape))
</script>

<div class="relative">
    <div on:click={() => open = !open}>
        <slot name="trigger" />
    </div>

    <!-- Full Screen Dropdown Overlay -->
    {#if open}
        <div class="fixed inset-0 z-40" on:click={() => open = false} />
    {/if}
    
    {#if open}
        <div
            class="absolute z-50 mt-2 rounded-md shadow-lg {widthClass} {alignmentClasses}"
            on:click={() => open = false}>
            <div class="rounded-md ring-1 ring-black ring-opacity-5 {contentClasses.join(' ')}">
                <slot name="content" />
            </div>
        </div>
    {/if}
</div>

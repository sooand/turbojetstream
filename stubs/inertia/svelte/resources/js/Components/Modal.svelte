<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte'
    import { fade } from 'svelte/transition'
    import Portal from "@/Components/Portal.svelte"

    const dispatch = createEventDispatcher();

    export let show = false
    export let maxWidth = "2xl"
    export let closeable = true

    $: maxWidthClass = () => {
        return {
            'sm': 'sm:max-w-sm',
            'md': 'sm:max-w-md',
            'lg': 'sm:max-w-lg',
            'xl': 'sm:max-w-xl',
            '2xl': 'sm:max-w-2xl',
        }[maxWidth]
    };
    $: show, () => {
        if (show) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = null
        }
    };
    
    const close = () => {
        if (closeable) {
            dispatch('close')
        }
    };

    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && show) {
            close()
        }
    };

    onMount(() => document.addEventListener('keydown', closeOnEscape))
    onDestroy(() => {
        document.removeEventListener('keydown', closeOnEscape)
        document.body.style.overflow = null
    })
</script>

{#if show}
    <Portal>
        <div class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50" scroll-region>
            <div transition:fade class="fixed inset-0 transform transition-all" on:click={close}>
                <div class="absolute inset-0 bg-gray-500 opacity-75" />
            </div>

            <div transition:fade class="mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto {maxWidthClass()}">
                <slot />
            </div>
        </div>
    </Portal>
{/if}

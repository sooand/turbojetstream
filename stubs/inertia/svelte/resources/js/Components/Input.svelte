<script>
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let value = ''
    export function focus() {
		input.focus()
	}

    let input

    $: props = () => {
        delete $$restProps['class']
        return $$restProps
    }

</script>

<input
    class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm {$$restProps?.class ? $$restProps.class : ''}"
    bind:value
    bind:this={input}
    on:input={dispatch('update:modelValue', value)}
    {...props()}>

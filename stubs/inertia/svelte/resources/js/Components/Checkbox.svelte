<script>
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let value = ""
    export let bindGroup = []

    function onChange({ target }) {
		const { value, checked } = target
		if (checked) {
			bindGroup = [...bindGroup, value]
		} else {
			bindGroup = bindGroup.filter((item) => item !== value)
		}
        dispatch("update:checked", value)
	}
</script>


<input
    checked={bindGroup.includes(value)}
    type="checkbox"
    {value}
    on:change={onChange}
    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    {...$$restProps}>
